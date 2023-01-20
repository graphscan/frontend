import { IndexerDelegationResponse } from './indexer.service';
import { Value, Postfix } from '../../web3-delegation.styled';
import { Loader } from '../loader/loader.component';
import { formatNumber, formatPercents } from '../../../../../../utils/number.utils';
import { tooltipNumberContent } from '../../../../../../utils/tooltip.utils';

export const renderDelegationData = (
  { data, isLoading }: IndexerDelegationResponse,
  key: Exclude<keyof NonNullable<IndexerDelegationResponse['data']>, 'getEstimatedApr'>,
  isPercentage = false,
) => (
  <Value
    data-tip={
      data ? (isPercentage ? `${formatNumber(data[key], 2)}%` : tooltipNumberContent(data[key])) : undefined
    }
  >
    {data && !isLoading ? (
      <>
        {isPercentage ? formatPercents(data[key]) : formatNumber(data[key])}
        <Postfix>{isPercentage ? '%' : 'GRT'}</Postfix>
      </>
    ) : (
      <Loader />
    )}
  </Value>
);

export const renderEstimatedApr = ({ data, isLoading }: IndexerDelegationResponse, input: string) => (
  <Value data-tip={data ? `${formatNumber(data.getEstimatedApr(input), 2)}%` : undefined}>
    {data && !isLoading ? (
      <>
        {formatPercents(data.getEstimatedApr(input) / 100)}
        <Postfix>%</Postfix>
      </>
    ) : (
      <Loader />
    )}
  </Value>
);
