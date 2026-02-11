import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import {
  request as _request,
  RequestDocument,
  Variables,
} from "graphql-request";
import { getEnvVariables } from "../utils/env.utils";

export const REQUEST_LIMIT = 1000;

export const fetchAllConsecutively = async <T>(
  fetcher: (skip: number) => Promise<Array<T>>,
  acc: Array<T> = [],
) => {
  let response: Array<T>;
  do {
    response = await fetcher(acc.length);
    acc.push(...response);
  } while (response.length > 0 && response.length % REQUEST_LIMIT === 0);

  return acc;
};

export const fetchAllParallel = <T>(
  totalItems: number,
  fetcher: (skip: number) => Promise<Array<T>>,
) =>
  Promise.all(
    Array.from(
      {
        length: Math.ceil(totalItems / REQUEST_LIMIT) || 1,
      },
      (_, i) => fetcher(i * REQUEST_LIMIT),
    ),
  ).then((response) => response.flat());

// cleanup that terrible code
const createRequest =
  (getUrl: () => string) =>
  <T = unknown, V extends Variables = Variables>(
    document: RequestDocument | TypedDocumentNode<T, V>,
    ..._variablesAndRequestHeaders: any
  ) => {
    const env = getEnvVariables();
    const [variables, requestHeaders] = _variablesAndRequestHeaders;

    const headers: any = {
      ...requestHeaders,
      ...(env.graphApiKey
        ? { Authorization: `Bearer ${env.graphApiKey}` }
        : {}),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return _request<T, V>(getUrl(), document, ...([variables, headers] as any));
  };

/**
 * Request to MAIN subgraph - use for delegations and most data
 */
export const request = createRequest(() => getEnvVariables().subgraphMainUrl);

/**
 * Request to ANALYTICS subgraph - use only for historical data (dailyData, APY calculations)
 */
export const requestAnalytics = createRequest(
  () => getEnvVariables().subgraphAnalyticsUrl,
);

/**
 * Request to ENS subgraph - for domain name resolution
 */
export const requestEns = createRequest(() => getEnvVariables().ensUrl);
