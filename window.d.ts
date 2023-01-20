import MetaMaskInpageProvider from './src/libs/metamask-providers/MetaMaskInpageProvider';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}
