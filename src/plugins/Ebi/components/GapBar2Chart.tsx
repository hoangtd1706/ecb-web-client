import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Typography,
} from '@material-ui/core';
import {
  ResponsiveContainer,
  BarChart as BarChartRC,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

import format from '../../../configs/format';
import { chartColorPalettes } from '../constants/colors';

export type GapBar2ChartData = {
  category: string;
  name: string;
  rebaseline: number;
  forecast: number;
  gap: number;
}

type Props = {
  title: string;
  data: GapBar2ChartData[];
}

const tickValueFormatter = (value: number) => format.formatMoney(value / 1000000000);

const tooltipFormatter = (value: number, name: string) => {
  if (name === '%Gap') {
    return `${format.formatMoney(value, 1)}%`;
  }
  return `${format.formatMoney(value / 1000000000)} tỷ VND`;
}

export default function GapBar2Chart({
  title,
  data,
}: Props): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    planColor,
    actualColor,
    gapColor,
  ] = chartColorPalettes;

  return (
    <div style={{ width: '100%' }}>
      <Typography align="center" variant="h6">{title}</Typography>
      <div style={{ width: '100%', height: 280, padding: '8px' }}>
        <ResponsiveContainer>
          <BarChartRC
            barCategoryGap={5}
            barGap={0}
            data={data}
            stackOffset="sign"
            margin={{
              top: 0, right: 0, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" type="category" scale="band" />
            <YAxis
              type="number"
              mirror={matches} 
              tickFormatter={tickValueFormatter}
            />
            <Tooltip formatter={tooltipFormatter} />
            <Bar
              isAnimationActive={false}
              name="Kế hoạch"
              stackId={0}
              dataKey="rebaseline"
              fill={planColor}
            />
            <Bar
              isAnimationActive={false}
              name="Gap"
              stackId={0}
              dataKey="gap"
              fill={gapColor}
            />
            <Bar
              isAnimationActive={false}
              name="Thực tế"
              stackId={1}
              yAxisId={0}
              dataKey="forecast"
              fill={actualColor}
            />
          </BarChartRC>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
