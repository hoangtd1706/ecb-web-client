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

export type GapBarChartData = {
  category: string;
  name: string;
  value: number;
}

type Props = {
  title: string;
  data: GapBarChartData[];
}

const tickValueFormatter = (value: number) => format.formatMoney(value / 1000);

const tooltipFormatter = (value: number, name: string) => {
  if (name === '%Gap') {
    return `${format.formatMoney(value, 1)}%`;
  }
  return `${format.formatMoney(value / 1000)} tỷ VND`;
}

export default function GapBarChart({
  title,
  data,
}: Props): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    valueColor,
  ] = chartColorPalettes;

  console.log(data);

  return (
    <div style={{ width: '100%' }}>
      <Typography align="center" variant="h6">{title}</Typography>
      <div style={{ width: '100%', height: 280, padding: '8px' }}>
        <ResponsiveContainer>
          <BarChartRC
            barCategoryGap={5}
            barGap={0}
            data={data}
            stackOffset="expand"
            margin={{
              top: 0, right: 0, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" type="category" scale="band" />
            <YAxis
              type="number"
              mirror={matches}
              yAxisId={0}
              tickFormatter={tickValueFormatter}
            />
            <Tooltip formatter={tooltipFormatter} />
            <Bar
              isAnimationActive={false}
              name="GAP"
              yAxisId={0}
              dataKey="value"
              fill={valueColor}
            />
          </BarChartRC>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
