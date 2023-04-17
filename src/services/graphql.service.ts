import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { request as _request, RequestDocument, Variables } from 'graphql-request';
import { RemoveIndex } from 'graphql-request/dist/types';
import * as Dom from 'graphql-request/dist/types.dom';
import { getEnvVariables } from '../utils/env.utils';

export const REQUEST_LIMIT = 1000;

export const ENDPOINT_STORAGE_KEY = 'current-endpoint';

const getEndpoint = () => {
  if (typeof sessionStorage !== 'undefined') {
    const endpoint = sessionStorage.getItem(ENDPOINT_STORAGE_KEY);
    if (endpoint) {
      return endpoint;
    }
  }
  return getEnvVariables().subgraphUrl;
};

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

export const fetchAllParallel = <T>(totalItems: number, fetcher: (skip: number) => Promise<Array<T>>) =>
  Promise.all(
    Array.from({
      length: Math.ceil(totalItems / REQUEST_LIMIT) || 1,
    }).map((_, i) => fetcher(i * REQUEST_LIMIT)),
  ).then((response) => response.flat());

export const request = <T = unknown, V = Variables>(
  document: RequestDocument | TypedDocumentNode<T, V>,
  ..._variablesAndRequestHeaders: V extends Record<string, never>
    ? [variables?: V, requestHeaders?: Dom.RequestInit['headers']]
    : keyof RemoveIndex<V> extends never
    ? [variables?: V, requestHeaders?: Dom.RequestInit['headers']]
    : [variables: V, requestHeaders?: Dom.RequestInit['headers']]
) => _request<T, V>(getEndpoint(), document, ..._variablesAndRequestHeaders);
