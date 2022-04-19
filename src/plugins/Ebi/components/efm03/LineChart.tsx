import React from "react";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Typography,
} from '@material-ui/core';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import format from '../../../../configs/format';
import { chartColorPalettes } from '../../constants/colors';
import { renderSplitLine } from '../common';

export type LineChartData = {
  period: string;
  accBaseline: number;
  accRebaseline: number;
  accForecast: number;
}

type SCurveChartProps = {
  title: string;
  data: LineChartData[];
}

export default function SCurveChart({
  title,
  data,
}: SCurveChartProps): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));
  const [mounted, setMounted] = React.useState<boolean>(false);

  const [
    baselineColor,
    rebaselineColor,
    forecastColor,
  ] = chartColorPalettes;

  React.useEffect(() => {
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tickFormatter = (value: number) => format.formatMoney(value / 1000);
  const tooltipFormatter = (value: number) => `${format.formatMoney(value / 1000)} tỷ VND`;

  return (
    <div style={{ width: '100%' }}>
      <Typography align="center" variant="h6">{title}</Typography>
      <div style={{ width: '100%', height: 280, padding: '8px' }}>
        {mounted && <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{
              top: 0, right: 0, bottom: 0, left: 0,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="period" type="category" scale="band" />
            <YAxis
              type="number"
              mirror={matches}
              yAxisId={0}
              tickFormatter={tickFormatter}
            />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Line
              isAnimationActive={false}
              name="KHBĐ Lũy kế"
              yAxisId={0}
              type="linear"
              dataKey="accBaseline"
              dot={{ r: 4, stroke: baselineColor, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: baselineColor }}
              stroke={baselineColor}
              strokeWidth={3}
            />
            <Line
              isAnimationActive={false}
              name="KH Lũy kế"
              yAxisId={0}
              type="linear"
              dataKey="accRebaseline"
              dot={{ r: 4, stroke: rebaselineColor, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: rebaselineColor }}
              stroke={rebaselineColor}
              strokeWidth={3}
            />
            <Line
              isAnimationActive={false}
              name="TT/DB Lũy kế"
              yAxisId={0}
              type="linear"
              dataKey="accForecast"
              dot={{ r: 4, stroke: forecastColor, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: forecastColor }}
              stroke={forecastColor}
              strokeWidth={3}
            />
            {renderSplitLine()}
          </ComposedChart>
        </ResponsiveContainer>}
      </div>
    </div>
  );
}