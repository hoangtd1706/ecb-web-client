import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Typography,
} from '@material-ui/core';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import format from '../../../configs/format';
import { chartColorPalettes } from '../constants/colors';
import { renderSplitLine } from './common';

export type SCurveChartData = {
  period: string;
  accBaseline: number;
  accRebaseline: number;
  accForecast: number;
  baseline: number;
  rebaseline: number;
  forecast: number;
}

type SCurveChartProps = {
  title: string;
  data: SCurveChartData[];
  tickFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number) => string;
}

export default function SCurveChart({
  title,
  data,
  tickFormatter = (value: number) => format.formatMoney(value / 1000000000),
  tooltipFormatter = (value: number) => `${format.formatMoney(value / 1000000000)} tỷ VND`,
}: SCurveChartProps): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    baselineColor,
    rebaselineColor,
    forecastColor,
  ] = chartColorPalettes;

  return (
    <div style={{ width: '100%' }}>
      <Typography align="center" variant="h6">{title}</Typography>
      <div style={{ width: '100%', height: 280, padding: '8px' }}>
        <ResponsiveContainer>
          <ComposedChart
            barCategoryGap={5}
            barGap={0}
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
            <YAxis
              type="number"
              mirror={matches}
              yAxisId={1}
              orientation="right"
              tickFormatter={tickFormatter}
            />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Bar
              isAnimationActive={false}
              name="KH Phân kỳ"
              yAxisId={1}
              dataKey="rebaseline"
              fill={rebaselineColor}
            />
            <Bar
              isAnimationActive={false}
              name="TT/DB Phân kỳ"
              yAxisId={1}
              dataKey="forecast"
              fill={forecastColor}
            />
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
        </ResponsiveContainer>
      </div>
    </div>
  );
}