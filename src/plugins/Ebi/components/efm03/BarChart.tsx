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

import format from '../../../../configs/format';
import { chartColorPalettes } from '../../constants/colors';

export type BarChartData = {
  category: string;
  name: string;
  value: number;
  gap: number;
}

type BarChartProps = {
  title: string;
  name: string;
  data: BarChartData[];
}

const tickValueFormatter = (value: number) => format.formatMoney(value / 1000);
const tickGapFormatter = (value: number) => `${format.formatMoney(value)}%`;

const tooltipFormatter = (value: number, name: string) => {
  if (name === '%Gap') {
    return `${format.formatMoney(value, 1)}%`;
  }
  return `${format.formatMoney(value / 1000)} tỷ VND`;
}

export default function BarChart({
  title,
  name,
  data,
}: BarChartProps): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    valueColor,
    gapColor,
  ] = chartColorPalettes;

  const labelFormatter = (label: string) => {
    const project = data.find(x => x.category === label);
    if (project !== undefined) {
      return project.name;
    }
    return label;
  }

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
            <YAxis
              type="number"
              mirror={matches}
              yAxisId={1}
              orientation="right"
              tickFormatter={tickGapFormatter}
              max={100}
              min={-100}
            />
            <Tooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} />
            <Bar
              isAnimationActive={false}
              name={name}
              yAxisId={0}
              dataKey="value"
              fill={valueColor}
            />
            <Bar
              isAnimationActive={false}
              name="%Gap"
              yAxisId={1}
              dataKey="gap"
              fill={gapColor}
            />
          </BarChartRC>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
