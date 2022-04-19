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

import { Efm06BarChartData } from '../../common/efm06Helpers';

type Props = {
  title: string;
  data: Efm06BarChartData[];
}

const tickValueFormatter = (value: number) => format.formatMoney(value / 1000000000);

const tooltipFormatter = (value: number) => {
  return `${format.formatMoney(value / 1000000000)} tỷ VND`;
}

export default function Efm06BarChart({
  title,
  data,
}: Props): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    totalColor,
    balanceColor,
    remainingColor,
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
            stackOffset="expand"
            margin={{
              top: 0, right: 0, left: 0, bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" scale="band" />
            <YAxis
              type="number"
              mirror={matches}
              tickFormatter={tickValueFormatter}
            />
            <Tooltip formatter={tooltipFormatter} />
            <Bar
              isAnimationActive={false}
              dataKey="total"
              name="Hạn mức tín dụng cập nhật"
              fill={totalColor}
            />
            <Bar
              isAnimationActive={false}
              dataKey="balance"
              name="Số dư tín dụng"
              fill={balanceColor}
            />
            <Bar
              isAnimationActive={false}
              dataKey="remaining"
              name="Hạn mức tín dụng còn lại"
              fill={remainingColor}
            />
          </BarChartRC>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
