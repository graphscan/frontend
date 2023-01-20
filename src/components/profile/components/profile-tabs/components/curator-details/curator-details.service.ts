import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { CuratorDetails, transform } from './curator-details.model';
import { request } from '../../../../../../services/graphql.service';

type CuratorDetailsResponse = {
  curator: CuratorDetails;
};

export const useCuratorDetails = (id: string) => {
  return useQuery(['curator-details', id], async () => {
    const { curator } = await request<CuratorDetailsResponse>(
      gql`
        query {
          curator(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            currentNameSignalCount
            currentSignalCount
            allCurrentGRTValue
            totalNameSignalledTokens
            totalNameUnsignalledTokens
            PLGrt
            realizedPLGrt
            unrealizedPLGrt
          }
        }
      `,
    );

    return transform(curator);
  });
};
