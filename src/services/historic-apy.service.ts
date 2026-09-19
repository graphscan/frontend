import { gql } from "graphql-request";
import {
  fetchAllConsecutively,
  requestAnalytics,
  REQUEST_LIMIT,
} from "./graphql.service";
import {
  calculateHistoricApys,
  IndexerRateHistory,
  SECONDS_PER_DAY,
} from "../utils/historic-apy.utils";

export const delegationRateSnapshotFragment = gql`
  fragment DelegationRateSnapshotFragment on IndexerDailyData {
    dayEnd
    delegationExchangeRate
    delegatedTokens
    delegatedThawingTokens
    delegatorShares
  }
`;

export const fetchIndexerHistoricApys = async () => {
  const { _meta } = await requestAnalytics<{
    _meta: {
      hasIndexingErrors: boolean;
      block: { number: number; timestamp: number | null };
    };
  }>(gql`
    query {
      _meta {
        hasIndexingErrors
        block {
          number
          timestamp
        }
      }
    }
  `);
  if (_meta.hasIndexingErrors || !_meta.block.timestamp)
    throw new Error("Historical delegation data is unavailable");

  const blockNumber = _meta.block.number;
  const endTimestamp =
    Math.floor(_meta.block.timestamp / SECONDS_PER_DAY) * SECONDS_PER_DAY;
  // Daily records are event-driven. Carry the most recent completed snapshot
  // forward across days with no events; never use a snapshot after a boundary.
  const start30 = endTimestamp - 30 * SECONDS_PER_DAY;
  const start60 = endTimestamp - 60 * SECONDS_PER_DAY;
  const start180 = endTimestamp - 180 * SECONDS_PER_DAY;
  const start360 = endTimestamp - 360 * SECONDS_PER_DAY;
  return fetchAllConsecutively(async (skip) => {
    const { indexers } = await requestAnalytics<{
      indexers: IndexerRateHistory[];
    }>(gql`
      ${delegationRateSnapshotFragment}
      query {
        indexers(first: ${REQUEST_LIMIT}, skip: ${skip}, orderBy: id, orderDirection: asc, block: { number: ${blockNumber} }) {
          id
          provisions(first: 2, orderBy: id, orderDirection: asc) { id }
          end: dailyData(first: 1, orderBy: dayEnd, orderDirection: desc, where: { dayEnd_lte: ${endTimestamp} }) {
            ...DelegationRateSnapshotFragment
          }
          days30: dailyData(first: 1, orderBy: dayEnd, orderDirection: desc, where: { dayEnd_lte: ${start30} }) {
            ...DelegationRateSnapshotFragment
          }
          days60: dailyData(first: 1, orderBy: dayEnd, orderDirection: desc, where: { dayEnd_lte: ${start60} }) {
            ...DelegationRateSnapshotFragment
          }
          days180: dailyData(first: 1, orderBy: dayEnd, orderDirection: desc, where: { dayEnd_lte: ${start180} }) {
            ...DelegationRateSnapshotFragment
          }
          days360: dailyData(first: 1, orderBy: dayEnd, orderDirection: desc, where: { dayEnd_lte: ${start360} }) {
            ...DelegationRateSnapshotFragment
          }
          lastEmpty: dailyData(first: 1, orderBy: dayEnd, orderDirection: desc, where: { dayEnd_lte: ${endTimestamp}, delegatorShares: "0" }) { dayEnd }
        }
      }
    `);
    return indexers.map((indexer) => ({
      id: indexer.id,
      historicApy: calculateHistoricApys(indexer, endTimestamp),
    }));
  });
};
