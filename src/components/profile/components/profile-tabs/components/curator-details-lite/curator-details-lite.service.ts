import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { CuratorDetailsLite, transform } from './curator-details-lite.model';
import { request } from '../../../../../../services/graphql.service';

type CuratorDetailsResponseLite = {
  curator: CuratorDetailsLite;
};

export const useCuratorDetails = (id: string) => {
  return useQuery(['curator-details', id], async () => {
    const { curator } = await request<CuratorDetailsResponseLite>(
      gql`
        query {
          curator(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            activeNameSignalCount
            activeSignalCount
            totalNameSignalledTokens
            totalNameUnsignalledTokens
          }
        }
      `,
    );

    return transform(curator);
  });
};
