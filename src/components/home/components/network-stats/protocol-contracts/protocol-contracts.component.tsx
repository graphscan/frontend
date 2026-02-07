import {
  Table,
  Thead,
  Th,
  BodyRow,
  Td,
  TdContent,
  Anchor,
} from "./protocol-contracts.styled";
import { AccountButtons } from "../../../../common/account-buttons/account-buttons.component";
import { ProtocolContracts as Props } from "../../../../../model/graph-network.model";
import { getEnvVariables } from "../../../../../utils/env.utils";
import { preventDefault } from "../../../../../utils/events.utils";
import { clampMiddle } from "../../../../../utils/text.utils";

export const ProtocolContracts: React.FC<Props> = ({
  arbitrator,
  controller,
  curation,
  gns,
  governor,
  graphToken,
  rewardsManager,
  serviceRegistry,
  staking,
  epochManager,
}) => {
  const renderAddress = (address: string) => (
    <TdContent>
      <Anchor
        onMouseDown={preventDefault}
        href={`${getEnvVariables().ethereumExplorer}/address/${address}`}
        target="_blank"
        rel="noreferrer"
      >
        {clampMiddle(address)}
      </Anchor>
      <AccountButtons id={address} />
    </TdContent>
  );

  return (
    <Table>
      <Thead>
        <tr>
          <Th>Contract</Th>
          <Th>Address</Th>
        </tr>
      </Thead>
      <tbody>
        <BodyRow>
          <Td>Staking</Td>
          <Td>{renderAddress(staking)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Curation</Td>
          <Td>{renderAddress(curation)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Graph Token</Td>
          <Td>{renderAddress(graphToken)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>GNS</Td>
          <Td>{renderAddress(gns)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Rewards Manager</Td>
          <Td>{renderAddress(rewardsManager)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Epoch Manager</Td>
          <Td>{renderAddress(epochManager)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Controller</Td>
          <Td>{renderAddress(controller)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Arbitrator</Td>
          <Td>{renderAddress(arbitrator)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Governor</Td>
          <Td>{renderAddress(governor)}</Td>
        </BodyRow>
        <BodyRow>
          <Td>Service Registry</Td>
          <Td>{renderAddress(serviceRegistry)}</Td>
        </BodyRow>
      </tbody>
    </Table>
  );
};
