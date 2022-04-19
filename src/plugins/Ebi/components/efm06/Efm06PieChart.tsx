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
import format from '../../../../configs/format';
import { chartColorPalettes } from '../../constants/colors';

import { Efm06PieChartData } from '../../common/efm06Helpers';

type Props = {
  title: string;
  data: Efm06PieChartData[];
}

export default function Efm06PieChart({
  title,
  data,
}: Props): JSX.Element {

  const tooltipFormatter = (value: number) => {
    const total = data.map(x => x.value).reduce((acc, val) => acc + val, 0);
    return `${format.formatMoney(value / 1000000000)} tỷ VND (${format.formatMoney(value / total * 100, 0)}%)`;
  }

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