import { useDelegatorDetails } from './delegator-details-lite.service';
import {
  DetailsContainerWithPad,
  ContainerPad,
  TablePad,
  Table,
  Tr,
  Th,
  Td,
  Postfix,
} from '../../../../../common/details/details.styled';
import { Empty } from '../../../../../common/empty/empty.component';
import { Footer } from '../../../../../common/footer/footer.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { formatNumber } from '../../../../../../utils/number.utils';
import { createTitleWithTooltipDescription } from '../../../../../../utils/table.utils';
import { useTooltip, tooltipNumberContent } from '../../../../../../utils/tooltip.utils';

type Props = {
  id: string;
};

export const DelegatorDetailsLite: React.FC<Props> = ({ id }) => {
  useTooltip();

  const { data, error, isLoading } = useDelegatorDetails(id);

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
    delegationsCount,
    delegatedTotal,
    undelegatedTotal,
    totalRewards,
    realizedRewards,
    unrealizedRewards,
    lastDelegation,
    lastUndelegation,
  } = data;

  return (
    <>
      <ContainerPad>
        <DetailsContainerWithPad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription('Delegations Count', 'Current number of delegations.')}
                  </Th>
                  <Td>{delegationsCount}</Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      'Delegated Total',
                      'All time delegations to all chosen indexers including repeated ones',
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(delegatedTotal)}>
                      {formatNumber(delegatedTotal)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      'Undelegated Total',
                      'All time undelegations from all indexers including repeated ones.',
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(undelegatedTotal)}>
                      {formatNumber(undelegatedTotal)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      'Total Rewards',
                      'Realized rewards + Unrealized rewards from delegating.',
                    )}
                  </Th>
                  <Td style={{ color: '#4cd08e' }}>
                    <span data-tip={tooltipNumberContent(totalRewards)}>{formatNumber(totalRewards)}</span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
          <TablePad>
            <Table>
              <tbody>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      'Realized Rewards',
                      'The amount of <strong>undelegated</strong> rewards from all indexers.',
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(realizedRewards)}>
                      {formatNumber(realizedRewards)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>
                    {createTitleWithTooltipDescription(
                      'Unrealized Rewards',
                      `
                        Sum of <strong>accumulated and not yet undelegated</strong> rewards from
                        delegating.
                      `,
                    )}
                  </Th>
                  <Td>
                    <span data-tip={tooltipNumberContent(unrealizedRewards)}>
                      {formatNumber(unrealizedRewards)}
                    </span>
                    <Postfix> GRT</Postfix>
                  </Td>
                </Tr>
                <Tr>
                  <Th>{createTitleWithTooltipDescription('Last Delegation')}</Th>
                  <Td>{lastDelegation}</Td>
                </Tr>
                <Tr>
                  <Th>{createTitleWithTooltipDescription('Last Undelegation')}</Th>
                  <Td>{lastUndelegation}</Td>
                </Tr>
              </tbody>
            </Table>
          </TablePad>
        </DetailsContainerWithPad>
      </ContainerPad>
      <Footer />
    </>
  );
};
