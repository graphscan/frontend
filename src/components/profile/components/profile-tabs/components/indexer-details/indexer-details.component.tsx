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
import {
  formatNumber,
  formatTooltipNumber,
} from "../../../../../../utils/number.utils";
import { createTitleWithTooltipDescription } from "../../../../../../utils/table.utils";
import {
  useTooltip,
  tooltipNumberContent,
} from "../../../../../../utils/tooltip.utils";

type Props = {
  id: string;
};

const CapacityRow = ({
  title,
  description,
  value,
  warning = false,
}: {
  title: string;
  description: string;
  value: number | null;
  warning?: boolean;
}) => (
  <Tr>
    <Th>{createTitleWithTooltipDescription(title, description)}</Th>
    <Td>
      <span
        style={{ color: warning ? "#f4466d" : undefined }}
        data-tip={
          value === null
            ? "Capacity unavailable: service parameters are missing."
            : tooltipNumberContent(value)
        }
      >
        {value === null ? "—" : formatNumber(value)}
      </span>
      {value !== null && <Postfix> GRT</Postfix>}
    </Td>
  </Tr>
);

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
    legacyAllocatedTokens,
    allocationCapacity,
    availableToAllocate,
    allocationsAboveCapacity,
    selfStaked,
    lockedTokens,
    thawingTokens,
    lockedAndThawingTokens,
    delegatedTokens,
    activeDelegatedTokens,
    delegatedThawingTokens,
    delegationRemaining,
    delegatorIndexingRewards,
    delegatorQueryFees,
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
                  "Open Allocations",
                  "GRT assigned to open subgraph allocations. This amount can exceed current capacity after undelegations or stake thawing; it is not the available balance.",
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(allocatedTokens)}>
                  {formatNumber(allocatedTokens)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            {legacyAllocatedTokens > 0 && (
              <CapacityRow
                title="Of Which Legacy Allocations"
                description="Open allocations from the legacy protocol, included above. These are tracked separately from current Horizon capacity."
                value={legacyAllocatedTokens}
              />
            )}
            <CapacityRow
              title="Allocation Capacity"
              description="Active self stake provisioned to services plus active delegations, capped by each service's delegation limit. Excludes thawing funds and self stake not assigned to a service."
              value={allocationCapacity}
            />
            <CapacityRow
              title="Available to Allocate"
              description="Capacity remaining for new allocations, calculated separately for each service. Excludes funds thawing for withdrawal. A zero balance means there is no spare allocation capacity."
              value={availableToAllocate}
            />
            {(allocationsAboveCapacity === null ||
              allocationsAboveCapacity > 0) && (
              <CapacityRow
                title="Allocations Above Capacity"
                description="Open Horizon allocations exceeding the current capacity of their service. Capacity can fall after undelegations or stake thawing. Spare capacity in another service does not cover this excess. This is not a token loss or a withdrawable balance."
                value={allocationsAboveCapacity}
                warning={allocationsAboveCapacity !== null}
              />
            )}
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Self Stake",
                  "Deposited self stake minus locked tokens. Includes Horizon thawing stake, which does not contribute to Allocation Capacity.",
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
                  "Locked/Thawing Tokens",
                  "Indexer-owned tokens pending release: locked stake plus Horizon self stake thawing across services. Excludes delegators' thawing balances.",
                )}
              </Th>
              <Td>
                <span
                  data-html
                  data-tip={`Total: ${formatTooltipNumber(lockedAndThawingTokens)} GRT<br />Locked: ${formatTooltipNumber(lockedTokens)} GRT<br />Horizon thawing: ${formatTooltipNumber(thawingTokens)} GRT`}
                >
                  {formatNumber(lockedAndThawingTokens)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Total Delegation Pool",
                  "All delegated tokens still in the pool, including tokens thawing for withdrawal. Excludes the indexer's own stake. Total = Active + Thawing.",
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(delegatedTokens)}>
                  {formatNumber(delegatedTokens)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Active Delegation Pool",
                  "Delegated tokens that are not thawing for withdrawal. This matches the sum of Current Delegation in the delegators table and CSV at the same snapshot.",
                )}
              </Th>
              <Td>
                <span data-tip={tooltipNumberContent(activeDelegatedTokens)}>
                  {formatNumber(activeDelegatedTokens)}
                </span>
                <Postfix> GRT</Postfix>
              </Td>
            </Tr>
            <Tr>
              <Th>
                {createTitleWithTooltipDescription(
                  "Thawing Delegations",
                  "Horizon delegation tokens thawing for withdrawal. Still included in Total Delegation Pool, but excluded from Current Delegation and the active pool. Legacy withdrawal balances outside the pool are not included here.",
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
                <WarningContainer>
                  {createTitleWithTooltipDescription(
                    "Delegation Remaining",
                    "Combined delegation headroom across services: active provisioned self stake times each service's delegation ratio, minus active delegations. Thawing funds are excluded. Service limits apply independently. A dash means service parameters are unavailable.",
                  )}
                  {delegationRemaining !== null && delegationRemaining < 0 && (
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
                  style={{
                    color:
                      delegationRemaining !== null && delegationRemaining < 0
                        ? "#f4466d"
                        : "",
                  }}
                  data-tip={
                    delegationRemaining === null
                      ? "Service parameters unavailable"
                      : tooltipNumberContent(delegationRemaining)
                  }
                >
                  {delegationRemaining === null
                    ? "—"
                    : formatNumber(delegationRemaining)}
                </span>
                {delegationRemaining !== null && <Postfix> GRT</Postfix>}
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
