import { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAllConsecutively,
  REQUEST_LIMIT,
  requestEns,
} from "./graphql.service";

type Domain = {
  name: string | null;
  resolvedAddress: {
    id: string;
  };
};

type DomainsResponse = {
  domains: Array<Domain>;
};

export const getEnsName = async (id: string) => {
  const { domains } = await requestEns<DomainsResponse>(
    gql`
      query {
        domains(
          first: 1
          where: {resolvedAddress: ${JSON.stringify(id.toLowerCase())}}
        ) {
          name
        }
      }
    `,
  );

  return domains.at(0)?.name ?? null;
};

const createEnsAccountsFetcher =
  (indexers: Array<string>) => async (skip: number) => {
    const { domains } = await requestEns<DomainsResponse>(
      gql`
      query {
        domains(
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where:{resolvedAddress_in: ${JSON.stringify(indexers)}}
        ) {
          name
          resolvedAddress {
            id
          }
        }
      }
    `,
    );

    return domains;
  };

export const useEnsAccounts = (indexersIds: Array<string> | undefined) => {
  const enabled = Array.isArray(indexersIds) && indexersIds.length > 0;

  return useQuery(
    ["indexers-ens", indexersIds],
    async () => {
      if (!enabled) {
        throw new Error("Missing indexers data.");
      }

      return fetchAllConsecutively(createEnsAccountsFetcher(indexersIds)).then(
        (domains) =>
          Object.fromEntries(
            domains.map(({ resolvedAddress, name }) => [
              resolvedAddress.id,
              name ?? resolvedAddress.id,
            ]),
          ),
      );
    },
    { enabled },
  );
};
