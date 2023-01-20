import { makeAutoObservable } from 'mobx';
import { ethers } from 'ethers';
import addresses from '@graphprotocol/contracts/addresses.json';
import stakingAbi from '@graphprotocol/contracts/dist/abis/Staking.json';
import grtTokenAbi from '@graphprotocol/contracts/dist/abis/GraphToken.json';
import tokenLockWalletAbi from '../../../../services/abi/tokenLockWalletAbi.json';
import { connectionViewModel } from '../../../../model/connection.model';
import { DelegationTransactionWithUI, Status } from '../../../../model/web3-transations.model';
import { getSupportedChainId, switchNetwork, stringToBigNumber } from '../../../../utils/web3.utils';

export type SectionProps = {
  amount: string;
  delegated: number;
  status: Status;
  transaction: DelegationTransactionWithUI;
  onSubmit: (() => Promise<void>) | (() => void);
  setAmount: (amount: string) => void;
};

export class Web3DelegationViewModel {
  amount = '';
  status: Status = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentAddress() {
    return connectionViewModel.currentAddress;
  }

  async delegate(indexerId: string) {
    if (!window.ethereum) {
      throw new Error('Metamask must be connected');
    }

    this.setStatus('loading');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const currentChainId = await signer.getChainId();
      const chainId = getSupportedChainId();

      if (String(currentChainId) !== chainId) {
        this.setStatus(null);
        return switchNetwork();
      }

      const stakingAddress = addresses[chainId].Staking.address;

      const staking = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const token = new ethers.Contract(addresses[chainId].GraphToken.address, grtTokenAbi, signer);

      const amountBn = stringToBigNumber(this.amount);
      const allowance = await token.allowance(account, stakingAddress);

      if (allowance.lt(amountBn)) {
        let gasLimit;
        try {
          const estimated = await token.estimateGas.approve(stakingAddress, ethers.constants.MaxUint256);
          gasLimit = 1.2 * Number(estimated.toString());
        } catch {
          gasLimit = 150000;
        }
        await token.approve(stakingAddress, amountBn, {
          gasLimit: Math.round(gasLimit),
        });
      }

      let gasLimit;
      try {
        const estimated = await staking.estimateGas.delegate(indexerId, amountBn);
        gasLimit = 1.2 * Number(estimated.toString());
      } catch {
        gasLimit = 150000;
      }

      const txResponse = await staking.delegate(indexerId, amountBn, {
        gasLimit: Math.round(gasLimit),
      });
      const txReceipt = await txResponse.wait();
      txReceipt.status !== 0 ? this.setStatus('done') : this.onTransactionFail();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      this.onTransactionFail();
    }
  }

  async delegateLocked(indexerId: string) {
    if (!window.ethereum) {
      throw new Error('Metamask must be connected');
    }

    if (typeof this.currentAddress !== 'string') {
      throw new Error('Set token lock wallet address');
    }

    this.setStatus('loading');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const currentChainId = await signer.getChainId();
      const chainId = getSupportedChainId();

      if (String(currentChainId) !== chainId) {
        this.setStatus(null);
        return switchNetwork();
      }

      const lockWallet = new ethers.Contract(this.currentAddress, tokenLockWalletAbi, signer);
      const token = new ethers.Contract(addresses[chainId].GraphToken.address, grtTokenAbi, signer);

      const amountBn = stringToBigNumber(this.amount);
      const allowance = await token.allowance(this.currentAddress, addresses[chainId].Staking.address);

      if (allowance.lt(amountBn)) {
        let gasLimit;
        try {
          const estimated = await lockWallet.estimateGas.approveProtocol();
          gasLimit = 1.2 * Number(estimated.toString());
        } catch {
          gasLimit = 150000;
        }
        await lockWallet.approveProtocol({
          gasLimit: Math.round(gasLimit),
        });
      }

      let gasLimit;
      try {
        const estimated = await lockWallet.estimateGas.delegate(indexerId, amountBn);
        gasLimit = 1.2 * Number(estimated.toString());
      } catch {
        gasLimit = 150000;
      }
      const txResponse = await lockWallet.delegate(indexerId, amountBn, {
        gasLimit: Math.round(gasLimit),
      });
      const txReceipt = await txResponse.wait();
      txReceipt.status !== 0 ? this.setStatus('done') : this.onTransactionFail();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.onTransactionFail();
    }
  }

  setAmount(amount: string) {
    this.amount = amount;
  }

  setStatus(status: Status) {
    this.status = status;
  }

  async undelegate(indexerId: string, delegatedToIndexer: number) {
    if (!window.ethereum) {
      throw new Error('Metamask must be connected');
    }

    this.setStatus('loading');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const currentChainId = await signer.getChainId();
      const chainId = getSupportedChainId();

      if (String(currentChainId) !== chainId) {
        this.setStatus(null);
        return switchNetwork();
      }

      const contract = new ethers.Contract(addresses[chainId].Staking.address, stakingAbi, signer);
      const delegation = await contract.getDelegation(indexerId, account);
      const amountBn = stringToBigNumber(this.amount)
        .mul(delegation.shares)
        .div(stringToBigNumber(String(delegatedToIndexer)));

      let gasLimit;
      try {
        const estimated = await contract.estimateGas.undelegate(indexerId, amountBn);
        gasLimit = 1.2 * Number(estimated.toString());
      } catch {
        gasLimit = 150000;
      }

      const txResponse = await contract.undelegate(indexerId, amountBn, {
        gasLimit: Math.round(gasLimit),
      });
      const txReceipt = await txResponse.wait();
      txReceipt.status !== 0 ? this.setStatus('done') : this.onTransactionFail();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.onTransactionFail();
    }
  }

  async undelegateLocked(indexerId: string, delegatedToIndexer: number) {
    if (!window.ethereum) {
      throw new Error('Metamask must be connected');
    }

    if (typeof this.currentAddress !== 'string') {
      throw new Error('Set token lock wallet address');
    }

    this.setStatus('loading');
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const currentChainId = await signer.getChainId();
      const chainId = getSupportedChainId();

      if (String(currentChainId) !== chainId) {
        this.setStatus(null);
        return switchNetwork();
      }

      const lockWallet = new ethers.Contract(this.currentAddress, tokenLockWalletAbi, signer);
      const staking = new ethers.Contract(addresses[chainId].Staking.address, stakingAbi, signer);

      const delegation = await staking.getDelegation(indexerId, this.currentAddress);
      const amountBn = stringToBigNumber(this.amount)
        .mul(delegation.shares)
        .div(stringToBigNumber(String(delegatedToIndexer)));

      let gasLimit;
      try {
        const estimated = await lockWallet.estimateGas.undelegate(indexerId, amountBn);
        gasLimit = 1.2 * Number(estimated.toString());
      } catch {
        gasLimit = 150000;
      }

      const txResponse = await lockWallet.undelegate(indexerId, amountBn, {
        gasLimit: Math.round(gasLimit),
      });
      const txReceipt = await txResponse.wait();
      txReceipt.status !== 0 ? this.setStatus('done') : this.onTransactionFail();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.onTransactionFail();
    }
  }

  private onTransactionFail() {
    this.setStatus(null);
    this.setAmount('');
  }
}
