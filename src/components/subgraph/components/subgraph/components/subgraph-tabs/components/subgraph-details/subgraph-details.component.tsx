import { useSubgraphDetails } from "./subgraph-details.service";
import {
  ContainerPad,
  DetailsContainerWithPad,
  TablePad,
  Table,
  Tr,
  Th,
  Td,
  Postfix,
} from "../../../../../../../common/details/details.styled";
import { Empty } from "../../../../../../../common/empty/empty.component";
import { Footer } from "../../../../../../../common/footer/footer.component";
import { TabPreloader } from "../../../../../../../common/tab-preloader/tab-preloader.component";
import { getEnvVariables } from "../../../../../../../../utils/env.utils";
import { preventDefault } from "../../../../../../../../utils/events.utils";
import { formatNumber } from "../../../../../../../../utils/number.utils";
import {
  createTitleWithTooltipDescription,
  renderDeploymentId,
} from "../../../../../../../../utils/table.utils";
import { clampMiddle } from "../../../../../../../../utils/text.utils";
import {
  useTooltip,
  tooltipNumberContent,
} from "../../../../../../../../utils/tooltip.utils";

type Props = {
  deploymentId: string;
  subgraphId: string;
  versionId: string;
};

export const SubgraphDetails: React.FC<Props> = (props) => {
  useTooltip();

  const { data, error, isLoading } = useSubgraphDetails(props);

  if (isLoading) {
    return <TabPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  if (!data) {
    return null;
  }

  const {
    network,
    createdAt,
    creatorAddress,
    deploymentId,
    ownerId,
    website,
    signals,
    subgraphCuratorsCount,
    deploymentCuratorsCount,
    currentSignaled,
    queryFeesAmount,
    indexers,
    currentAllocations,
    indexingRewards,
  } = data;

  return (
    <>
      <ContainerPad>
        <DetailsContainerWithPad>
          <TablePad>
            <Table>
              <tbody>
                {network && (
                  <Tr>
                    <Th>{createTitleWithTooltipDescription("Network")}</Th>
                    <Td>{network}</Td>
                  </Tr>
                )}
                <Tr>
                  <Th>{createTitleWithTooltipDescription("Creator-ID")}</Th>
                  <Td>
                    <a
                      data-tip={creatorAddress ?? ownerId}
                      data-class="monospaced-tooltip"
                      href={`${getEnvVariables().ethereumExplorer}/address/${creatorAddress ?? ownerId}`}
                      target="_blank"
                      rel="noreferrer"
                      onMouseDown={preventDefault}
                    >
                      {clampMiddle(creatorAddress ?? ownerId)}
                    </a>
                  </Td>
                </Tr>
                <Tr>
                  <Th>{createTitleWithTooltipDescription("Created")}</Th>
                  <Td>{createdAt}</Td>
                </Tr>
                <Tr>
                  <Th>{createTitleWithTooltipDescription("Deployment ID")}</Th>
                  <Td>
                    <span data-tip={deploymentId}>
                      {renderDeploymentId(true)(deploymentId)}
                    </span>
                  </Td>
                </Tr>
                <Tr>
                  <Th>{createTitleWithTooltipDescription("Website")}</Th>
                  <Td>
                    {website && (
                      <a
                        onMouseDown={preventDefault}
                        href={`https://${website}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {website}
                      </a>
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Subgraph Curators",
                      "Active (Total)",
                    )}
                  </Th>
                  <Td>{`${subgraphCuratorsCount.active} (${subgraphCuratorsCount.total})`}</Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Deployment Curators",
                      "Active (Total)",
                    )}
                  </Th>
                  <Td>{`${deploymentCuratorsCount.active} (${deploymentCuratorsCount.total})`}</Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>{createTitleWithTooltipDescription("Signals")}</Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(signals)}>
                      {formatNumber(signals)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Current Signaled",
                      "Sum of GRT signaled by Curators to this subgraph.",
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(currentSignaled)}>
                      {formatNumber(currentSignaled)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Query Fees Amount",
                      `
                        The total fees that users have paid for queries from this indexers and their 
                        delegators from this subgraph.
                      `,
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(queryFeesAmount)}>
                      {formatNumber(queryFeesAmount)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>{createTitleWithTooltipDescription("Indexers")}</Th>
                  <Td>{indexers}</Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Current Allocations",
                      "Sum of GRT allocated by Indexers.",
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(currentAllocations)}>
                      {formatNumber(currentAllocations)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      "Indexing rewards",
                      `
                        The total indexing rewards earned by the indexers and their delegators from this 
                        subgraph.
                      `,
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(indexingRewards)}>
                      {formatNumber(indexingRewards)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
        </DetailsContainerWithPad>
      </ContainerPad>
      <Footer />
    </>
  );
};
