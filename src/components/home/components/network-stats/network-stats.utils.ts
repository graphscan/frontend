import { tooltipNumberContent } from "../../../../utils/tooltip.utils";

export const renderDailyIssuanceTooltip = ({
  dailyIssuance,
  maxDailyIssuance,
}: {
  dailyIssuance: number;
  maxDailyIssuance: number;
}) => `
<div class="tooltip-grid tooltip-grid_with-note">
  <div>
    <p class="tooltip-grid__title">Max possible</p>
    <p>${tooltipNumberContent(maxDailyIssuance)}</p>
  </div>
  <div>
    <p class="tooltip-grid__title">Realistic*</p>
    <p>${tooltipNumberContent(dailyIssuance)}</p>
  </div>
</div>
<em class="tooltip-note">* - because of signals in the denied subgraphs</em>
`;
