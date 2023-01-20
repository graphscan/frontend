import { useRef } from 'react';
import { sort } from 'ramda';
import Link from 'next/link';
import { Lifetime } from './components/lifetime.styled';
import { Warning, WarningContainer } from './components/warning.styled';
import { formatTableNumber, formatNumberToPercent, formatTooltipNumber, formatNumber } from '../number.utils';
import { clampMiddle, isOverflow } from '../text.utils';
import { handleTooltipLinkClick } from '../tooltip.utils';
import { bs58encode } from '../bs58.utils';
import { unixTimeToDateString } from '../date.utils';
import { onImageLoadError } from '../image.utils';
import { SubgraphStates } from '../../model/subgraph-states.model';
import { SortParams } from '../../model/sort.model';
import { EffectiveRealContainer } from '../../components/common/effective-real-container/effective-real-container.styled';
import { SubgraphWarning } from '../../components/common/subgraph-warning/subgraph-warning.component';

export const formatTableDate = unixTimeToDateString('MMM dd, yyyy HH:mm');

export const renderDate = (date: number | null) =>
  date ? <span className="ant-table-cell-monospaced-value">{formatTableDate(date)}</span> : null;

export const createTitleWithTooltipDescription = (title: string, description?: string) => (
  <span
    data-html
    data-class="title-description"
    data-tip={`<h3 class="tooltip-title" ${!description && 'style="margin-bottom: 0;"'}>${title}</h3>${
      description || ''
    }`}
  >
    {title}
  </span>
);

export const renderAccountId = <T extends Record<string, unknown>>(
  tab?: 'indexer-details' | 'delegator-details' | 'curator-details',
) => (value: string, row: T) => {
  const MAX_LENGTH = 15;

  const renderName = (name: string) => {
    return name.length > MAX_LENGTH ? `${name.substring(0, MAX_LENGTH - 3)}...` : name;
  };

  return (
    <Link href={`/profile?id=${value}${tab ? `#${tab}` : ''}`}>
      <a
        onMouseDown={handleTooltipLinkClick}
        data-class="monospaced-tooltip"
        data-tip={typeof row.name === 'string' ? (row.name.length > MAX_LENGTH ? row.name : null) : value}
      >
        {typeof row.name === 'string' ? renderName(row.name) : clampMiddle(value)}
      </a>
    </Link>
  );
};

const clampSubgraphId = (value: string) => `${clampMiddle(value.split('-')[0])}-${value.split('-')[1]}`;

export const renderOwnerId = <T extends { id: string }>(value: string, row: T) => (
  <Link href={`/profile?id=${value}#subgraph-owner-subgraphs`}>
    <a
      onMouseDown={handleTooltipLinkClick}
      data-class="monospaced-tooltip"
      data-tip={row.id.startsWith('0x') ? row.id : value}
    >
      {row.id.startsWith('0x') ? clampSubgraphId(row.id) : clampMiddle(value)}
    </a>
  </Link>
);

export const renderSubgraphName = <T extends SubgraphStates>(subgraphVersionKey: keyof T) => (
  value: string | null,
  row: T,
) => {
  const ref = useRef<HTMLSpanElement>(null);
  const overflow = ref.current?.parentElement && isOverflow(ref.current.parentElement);
  const { deprecated, denied, hasLinkedSubgraphs, isNew } = row;
  const isExclamation = deprecated || denied || hasLinkedSubgraphs;
  const isValidNew = !(deprecated || denied) && isNew;
  const isWarning = isExclamation || isValidNew;
  const displayValue = value && value.length > 0 ? value : row[subgraphVersionKey];

  return (
    <WarningContainer ref={ref} exclamation={isExclamation} isNew={isValidNew}>
      {isWarning && (
        <Warning>
          <SubgraphWarning
            isNew={isValidNew}
            deprecated={deprecated}
            denied={denied}
            hasLinkedSubgraphs={hasLinkedSubgraphs}
          />
        </Warning>
      )}
      <Link href={`/subgraph?version=${row[subgraphVersionKey]}#subgraph-details`}>
        <a
          data-tip={overflow ? displayValue : null}
          onMouseDown={overflow ? handleTooltipLinkClick : undefined}
          className="ant-table-cell-normal-font-value"
          data-offset={`{ 'left': ${
            overflow && ref.current?.parentElement
              ? (ref.current.parentElement.scrollWidth - ref.current.parentElement.offsetWidth) / 2
              : 0
          }}`}
        >
          {displayValue}
        </a>
      </Link>
    </WarningContainer>
  );
};

export const renderHashId = (value: string | null) =>
  value ? (
    <span className="ant-table-cell-monospaced-value" data-class="monospaced-tooltip" data-tip={value}>
      {`${value.substring(0, 12)}...`}
    </span>
  ) : (
    value
  );

export const renderDeploymentId = (clamped = false) => (value: string | null) =>
  value ? (
    <a
      data-html
      data-tip={`
        <p>&nbsp;ID:&nbsp;${bs58encode(`1220${value.substring(2)}`)}</p>
        <p>HEX:&nbsp;${value}</p>
      `}
      href={`https://ipfs.io/ipfs/${bs58encode(`1220${value.substring(2)}`)}`}
      target="_blank"
      rel="noreferrer"
      data-class="monospaced-tooltip"
    >
      {`${bs58encode(`1220${value.substring(2)}`).substring(0, clamped ? 14 : undefined)}${
        clamped ? '...' : ''
      }`}
    </a>
  ) : null;

export const renderAddress = (value: string) => (
  <span className="ant-table-cell-monospaced-value" data-class="monospaced-tooltip" data-tip={value}>
    {clampMiddle(value)}
  </span>
);

export const renderImage = (src: string | null) =>
  src && src.length > 0 ? (
    <img src={src} onError={onImageLoadError} alt="Subgraph image" width="25" height="25" />
  ) : (
    <img src="/images/no-data.svg" alt="No data image" width="25" height="25" />
  );

export const renderFormattedValue = (value: number) => (
  <span data-tip={formatTooltipNumber(value)}>{formatTableNumber(value)}</span>
);

export const renderFormattedValuePotential = (value: number) => (
  <span data-tip={formatTooltipNumber(value)}>~ {formatTableNumber(value)}</span>
);

export const renderFormattedValueWithPercentageTooltip = <T extends Record<string, unknown>>(
  rowKey: keyof T,
) => (value: number, row: T) => (
  <span data-tip={`${formatTooltipNumber(value)} (${(Number(row[rowKey]) * 100).toFixed(2)}%)`}>
    {formatTableNumber(value)}
  </span>
);

export const renderFormattedHighlightedValue = (color = '') => (value: number) => (
  <strong data-tip={formatTooltipNumber(value)} data-text-color={color} style={{ color }}>
    {formatTableNumber(value)}
  </strong>
);

export const renderFormattedToPercentValue = (mantissa = 1, average = true) => (value: number) => (
  <span data-tip={`${(value * 100).toFixed(mantissa + 1)}%`}>
    {formatNumberToPercent(value, mantissa, average)}
  </span>
);

export const renderFormattedToPercentOfYearValue = (value: number) => (
  <span data-tip={`${(value * 36500).toFixed(2)}%`}>{formatNumberToPercent(value * 365)}</span>
);

export const renderFormattedRealValue = (value: number) => (
  <span
    data-tip={formatTooltipNumber(value)}
    data-text-color={value > 0 ? '#4cd08e' : value < 0 ? '#f4466d' : ''}
    style={{ color: value > 0 ? '#4cd08e' : value < 0 ? '#f4466d' : '' }}
  >
    {formatTableNumber(value)}
  </span>
);

export const renderEffectiveRealTooltip = ({
  effectiveValue,
  realTitle,
  realValue,
}: {
  effectiveValue: number | null;
  realTitle: string;
  realValue: number;
}) => `
<div class="tooltip-grid">
  <div class="tooltip-grid_element">
    <p class="tooltip-grid_title">Effective</p>
    <p class="tooltip-grid_description">${
      typeof effectiveValue === 'number' ? `${formatNumber(effectiveValue * 100, 2)}%` : '-'
    }</p>
  </div>
  <div class="tooltip-grid_element">
    <p class="tooltip-grid_title">${realTitle}</p>
    <p class="tooltip-grid_description">${formatNumber(realValue * 100, 2)}%</p>
  </div>
</div>
`;

export const renderFormattedToPercentValueWithSeparatedValuesInTooltip = <T extends Record<string, unknown>>(
  realTitle: string,
  rowKey: keyof T,
) => (value: number | null, row: T) => (
  <EffectiveRealContainer
    data-html
    data-tip={renderEffectiveRealTooltip({
      effectiveValue: value,
      realTitle,
      realValue: Number(row[rowKey]),
    })}
    withPadding={typeof value !== 'number'}
  >
    {typeof value === 'number' ? formatNumberToPercent(value) : '-'}
  </EffectiveRealContainer>
);

export const renderLifetimeValue = <T extends { lifetimeEpochs: number }>(value: string, row: T) => (
  <Lifetime className="ant-table-cell-monospaced-value" epochs={row.lifetimeEpochs}>
    {value}
  </Lifetime>
);

export const STICKY_SCROLL_CLASSNAME = 'ant-table-sticky-scroll';

export const removeStickyScroll = () => {
  if (window) {
    const stickyScroll = document.querySelector(`.${STICKY_SCROLL_CLASSNAME}`);

    if (stickyScroll) {
      const event = new Event('resize');
      setTimeout(() => window.dispatchEvent(event), 0);
    }
  }
};

export const allocationStatus = {
  description: `
    Allocation can be in 4 statuses:
    <br><br><strong style="color: #4cd08e;">Active</strong> Opened allocation.
    <br><br><strong style="color: #ff6e3f;">Closed</strong> Closed but not finalized allocation.
    <br><br><strong style="color: #3b495e;">Finalized</strong> Opened and closed allocation, more 
    than 7 channel Dispute Epochs has passed from the moment of closing.
    <br><br><strong style="color: #3b495e;">Claimed</strong> Query fee of allocations are transferred 
    from rebate pool to Indexer delegation pool. 
    Claim can be called only on allocations which have status “Finalized”.
  `,
  render: (value: string) => (
    <span
      style={{
        color:
          value === 'Active'
            ? '#4cd08e'
            : value === 'Closed'
            ? '#ff6e3f'
            : value === ('Claimed' || 'Finalized')
            ? '#3b495e'
            : '',
        fontWeight: 700,
      }}
    >
      {value}
    </span>
  ),
};

export const poi = {
  description: `
    POIs are used in the network to verify that an indexer is indexing the subgraphs they have 
    allocated on. A POI for the first block of the current epoch must be submitted when closing 
    an allocation for that allocation to be eligible for indexing rewards. A POI for a block is 
    a digest for all entity store transactions for a specific subgraph deployment up to and 
    including that block.
  `,
  render: renderHashId,
};

export const rowsComparator = <T extends Record<string, unknown>>(sortParams: SortParams<T>) => (
  a: T,
  b: T,
) => {
  const { orderBy, orderDirection } = sortParams;
  const isAscending = orderDirection === 'asc';
  const x = a[orderBy];
  const y = b[orderBy];

  if (x === null) {
    return 1;
  }

  if (y === null) {
    return -1;
  }

  if (typeof x === 'number' && typeof y === 'number') {
    return isAscending ? x - y : y - x;
  }

  return new Intl.Collator('en', { sensitivity: 'base', ignorePunctuation: true }).compare(
    String(isAscending ? x : y),
    String(isAscending ? y : x),
  );
};

export const sortRows = <T extends Record<string, unknown>>(sortParams: SortParams<T>) =>
  sort(rowsComparator(sortParams));
