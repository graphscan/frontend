import { memo, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Data, PlotRelayoutEvent } from 'plotly.js';
import { Container, TitleContainer, TitleText } from './chart.styled';
import { dateStringToUnixTime } from '../../../../../../utils/date.utils';

const INT32_MAX = 2 ** 31 - 1;
const INT32_MIN = -(2 ** 31);

export type Props = {
  data: Array<Data>;
  title: string | React.ReactElement;
  yPercent?: boolean;
  range?: [from: string, to: string];
  onRelayout?: (period: [string, string]) => void;
};

export const Chart = memo<Props>(({ data, title, range, onRelayout, yPercent = false }) => {
  const handleRelayout = useCallback(
    (e: PlotRelayoutEvent) => {
      if (
        typeof onRelayout === 'function' &&
        typeof e['xaxis.range[0]'] !== 'undefined' &&
        typeof e['xaxis.range[1]'] !== 'undefined'
      ) {
        const from = String(e['xaxis.range[0]']);
        const to = String(e['xaxis.range[1]']);
        if (
          Math.ceil(dateStringToUnixTime(to)) <= INT32_MAX &&
          Math.floor(dateStringToUnixTime(from)) >= INT32_MIN &&
          dateStringToUnixTime(to) > dateStringToUnixTime(from)
        ) {
          onRelayout([from, to]);
        }
      }
    },
    [onRelayout],
  );

  return (
    <Container>
      <Plot
        onRelayout={handleRelayout}
        data={data}
        layout={{
          dragmode: 'pan',
          hovermode: 'closest',
          font: {
            family: 'Montserrat, Arial, sans-serif',
            color: '#88A8D7',
          },
          margin: {
            l: 80,
            r: 80,
            t: 80,
            b: 50,
            pad: 10,
          },
          autosize: true,
          xaxis: {
            type: 'date',
            tickformat: '%d %b %Y',
            showgrid: false,
            range: range,
          },
          yaxis: yPercent
            ? {
                title: {
                  text: '%',
                  standoff: 12,
                },
                tickformat: 'p',
                overlaying: 'y',
                range: [-1, 1],
                gridcolor: '#2A4063',
                zerolinecolor: '#304971',
                zerolinewidth: 2,
              }
            : {
                title: {
                  text: 'GRT',
                  standoff: 12,
                },
                gridcolor: '#2A4063',
                zerolinecolor: '#304971',
                zerolinewidth: 2,
              },
          paper_bgcolor: 'transparent',
          plot_bgcolor: '#192434',
          legend: {
            orientation: 'h',
            borderwidth: 0,
            bordercolor: '#192434',
          },
        }}
        config={{ responsive: true }}
        style={{ width: '100%', height: 460 }}
      />
      <TitleContainer>{typeof title === 'string' ? <TitleText>{title}</TitleText> : title}</TitleContainer>
    </Container>
  );
});
