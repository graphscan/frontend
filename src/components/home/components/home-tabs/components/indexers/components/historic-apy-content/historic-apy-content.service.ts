import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { totalAllocationFragment } from "../../indexers.service";
import {
  fetchAllConsecutively,
  requestAnalytics,
  REQUEST_LIMIT,
} from "../../../../../../../../services/graphql.service";
import ReactTooltip from "react-tooltip";
import {
  DailyData,
  TotalAllocationRaw,
  getHistoricApyPeriod,
  mapDelegatedTokensToAllocations,
} from "../../indexers.model";

type HistoricApyResponse = {
  indexer: {
    id: string;
    totalAllocations: Array<TotalAllocationRaw>;
    dailyData: Array<DailyData>;
  };
};

const createTotalAllocationsFetcher =
  (indexerId: string, dailyData: Array<DailyData>) => async (skip: number) => {
    const {
      indexer: { totalAllocations },
    } = await requestAnalytics<HistoricApyResponse>(
      gql`
        ${totalAllocationFragment}
        query {
          indexer(id: ${JSON.stringify(indexerId)}) {
            id
            totalAllocations (
              first: ${REQUEST_LIMIT},
              skip: ${skip},
              where:{ status_not: Active, closedAt_gte: ${getHistoricApyPeriod(360)} }
            ) {
              ...TotalAllocationFragment
            }
          }
        }
      `,
    );

    return mapDelegatedTokensToAllocations(totalAllocations, dailyData);
  };

const fetchInitialData = async (indexerId: string) => {
  const { indexer } = await requestAnalytics<HistoricApyResponse>(
    gql`
      ${totalAllocationFragment}
      query {
        indexer(id: ${JSON.stringify(indexerId)}) {
          id
          totalAllocations (
            first: ${REQUEST_LIMIT},
            where:{ status_not: Active, closedAt_gte: ${getHistoricApyPeriod(360)} }
          ) {
            ...TotalAllocationFragment
          }
          dailyData(
            first: 360,
            orderBy: dayNumber,
            orderDirection: desc,
            where: { dayStart_gte: ${getHistoricApyPeriod(360)} }
          ) {
            dayNumber
            dayStart
            delegatedTokens
          }
        }
      }
    `,
  );

  return indexer;
};

export const useTotalAllocations = (
  indexerId: string,
  enabled: boolean,
  target: HTMLElement | null,
) => {
  return useQuery(
    ["historic-apy-total-allocations", indexerId],
    async () => {
      const { totalAllocations: rawAllocations, dailyData } =
        await fetchInitialData(indexerId);

      if (rawAllocations.length === REQUEST_LIMIT) {
        const totalAllocations = await fetchAllConsecutively(
          createTotalAllocationsFetcher(indexerId, dailyData),
          mapDelegatedTokensToAllocations(rawAllocations, dailyData),
        );

        return totalAllocations;
      }

      return mapDelegatedTokensToAllocations(rawAllocations, dailyData);
    },
    {
      enabled,
      onSuccess: () => {
        setTimeout(() => {
          ReactTooltip.hide();
          if (target) {
            ReactTooltip.show(target);
          }
        }, 0);
      },
    },
  );
};
