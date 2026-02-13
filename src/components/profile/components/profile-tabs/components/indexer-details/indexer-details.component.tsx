import { useIndexerDetails } from "./indexer-details.service";
import {
  Container,
  MapContainer,
  Warning,
  WarningContainer,
} from "./indexer-details.styled";
import { IndexerCuts } from "./components/indexer-cuts/indexer-cuts.component";
import { Map } from "./components/map/map.component";
import { Empty } from "../../../../../common/empty/empty.component";
import {
  Table,
  Tr,
  Th,
  Td,
  Postfix,
} from "../../../../../common/details/details.styled";
import { Footer } from "../../../../../common/footer/footer.component";
import { Exclamation } from "../../../../../common/exclamation/exclamation.component";
import { TabPreloader } from "../../../../../common/tab-preloader/tab-preloader.component";
import { formatNumber } from "../../../../../../utils/number.utils";
import { createTitleWithTooltipDescription } from "../../../../../../utils/table.utils";
import {
  useTooltip,
  tooltipNumberContent,
} from "../../../../../../utils/tooltip.utils";

type Props = {
  id: string;
};

export const IndexerDetails: React.FC<Props> = ({ id }) => {
  useTooltip();

  const { data, error, isLoading } = useIndexerDetails(id);

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
    indexingRewardEffectiveCut,
    indexingRewardCut,
    queryFeeEffectiveCut,
    queryFeeCut,
    allocatedTokens,
    notAllocatedTokens,
    selfStaked,
    lockedTokens,
    delegatedTokens,
    delegatedCapacity,
    delegationRemaining,
    delegatorIndexingRewards,
    delegatorQueryFees,
    delegatedThawingTokens,
    indexerIndexingRewards,
    queryFeesCollected,
    queryFeeRebates,
    location,
  } = data;

  return (
    <>
      <Container>
        <Table>
          <tbody>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Effective Rewards cut",
                  `
                    Effective Reward Cut is a fee that Indexer charges Delegators for delegations management.
                    <br><br>- If it's negative, it means that the Indexer is giving away part of their rewards
                    <br><br>- If it's positive, the Indexer is keeping some of the rewards.
                    <br><br>Rewards cut is a technical parameter that shows what % of indexer rewards given 
                    Indexer keeps when sharing rewards with its delegators. It includes rewards for the 
                    Indexer's self-stacked GRTs.
                  `,
                )}
              </Th>
              <Td>
                <IndexerCuts
                  effectiveValue={indexingRewardEffectiveCut}
                  realTitle="Indexing Reward Cut"
                  realValue={indexingRewardCut}
                />
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Effective Query fee cut",
                  `
                    Effective Query fee cut  is a fee that Indexer charges Delegators for 
                    delegations management.
                  `,
                )}
              </Th>
              <Td>
                <IndexerCuts
                  effectiveValue={queryFeeEffectiveCut}
                  realTitle="Query Fee Cut"
                  realValue={queryFeeCut}
                />
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Allocated Tokens",
                  "Stake that indexer is actively allocating towards its indexed subgraphs.",
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(allocatedTokens)}>
                  {formatNumber(allocatedTokens)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "NOT Allocated Tokens",
                  "Not allocated stake. The value can be negative when the Indexer is still using tokens in allocations that have already been undelegated.",
                )}
              </Th>
              <Td>
                <span
                  data-tip={tooltipNumberContent(notAllocatedTokens)}
                  data-text-color="#f4466d"
                  style={{ color: "#f4466d" }}
                >
                  {formatNumber(notAllocatedTokens)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Self Stake",
                  `The Indexer's deposited stake, which may be slashed for malicious or incorrect behavior.`,
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(selfStaked)}>
                  {formatNumber(selfStaked)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Locked Tokens",
                  `The current value of indexer's tokens locked in the graph protocol.`,
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(lockedTokens)}>
                  {formatNumber(lockedTokens)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Delegation Pool",
                  "Amount of delegated tokens that can be eligible for rewards.",
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(delegatedCapacity)}>
                  {formatNumber(delegatedCapacity)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                <WarningContainer>
                  {createTitleWithTooltipDescription(
                    "Delegation Remaining",
                    `
                      Amount of GRT that can be delegated to Indexer  without exceeding Indexer's max 
                      capacity.
                      <br><br>Max Capacity is the maximum amount of delegated stake the Indexer can 
                      productively accept and equal to 16 Indexer's self stake. Indexers can not allocate 
                      delegations that exceed its max capacity. If max capacity is exceeded, Indexer gets 
                      Overdelegated status.
                    `,
                  )}
                  {delegationRemaining < 0 && (
                    <Warning>
                      <Exclamation
                        color={"#ff2055"}
                        tooltipText="OVERDELEGATED"
                      />
                    </Warning>
                  )}
                </WarningContainer>
              </Th>
              <Td>
                <span
                  style={{ color: delegationRemaining < 0 ? "#f4466d" : "" }}
                  data-tip={tooltipNumberContent(delegationRemaining)}
                >
                  {formatNumber(delegationRemaining)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Delegators Earned Rewards",
                  "Indexing rewards from the chosen Indexer.",
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(delegatorIndexingRewards)}>
                  {formatNumber(delegatorIndexingRewards)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Delegators Earned Query Fees",
                  "Query fees from the chosen Indexer.",
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(delegatorQueryFees)}>
                  {formatNumber(delegatorQueryFees)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Delegated Thawing Tokens",
                  "Amount of delegated tokens currently being thawed.",
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(delegatedThawingTokens)}>
                  {formatNumber(delegatedThawingTokens)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Indexer Earnings",
                  `Indexer's indexer rewards.`,
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(indexerIndexingRewards)}>
                  {formatNumber(indexerIndexingRewards)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Indexer Query Fees Collected",
                  `Query fees collected by the Indexer.`,
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(queryFeesCollected)}>
                  {formatNumber(queryFeesCollected)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Indexer Query Fee Rebates",
                  `Query fee rebates claimed by the Indexer.`,
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(queryFeeRebates)}>
                  {formatNumber(queryFeeRebates)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
          </tbody>
        </Table>
        <MapContainer>
          <Map location={location} />
        </MapContainer>
      </Container>
      <Footer />
    </>
  );
};
