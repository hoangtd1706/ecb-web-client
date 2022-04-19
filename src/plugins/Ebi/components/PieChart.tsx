import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import {
  ResponsiveContainer,
  PieChart as REPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import format from '../../../configs/format';
import { chartColorPalettes } from '../constants/colors';

export type PieChartData = {
  name: string;
  value: number;
}

type Props = {
  title: string;
  data: PieChartData[];
  tooltipFormatter?: (value: number) => string;
}

export default function PieChart({
  title,
  data,
  tooltipFormatter = (value: number) => `${format.formatMoney(value / 1000)} tỷ VND`,
}: Props): JSX.Element {

  return (
    <div style={{ width: '100%' }}>
      <Typography align="center" variant="h6">{title}</Typography>
      <div style={{ width: '100%', height: 280, padding: '8px' }}>
        <ResponsiveContainer>
          <REPieChart>
            <Legend />
            <Tooltip formatter={tooltipFormatter} />
            <Pie isAnimationActive={false} data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {
                data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColorPalettes[index]} />
                ))
              }
            </Pie>
          </REPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}