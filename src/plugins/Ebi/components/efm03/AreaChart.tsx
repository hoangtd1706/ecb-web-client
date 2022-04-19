import React from "react";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Typography,
} from '@material-ui/core';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

import format from '../../../../configs/format';
import { chartColorPalettes } from '../../constants/colors';
import { renderSplitLine } from '../common';

export type AreaChartData = {
  period: string;
  workDone: number;
  revenue: number;
  cashIn: number;
}

type AreaChartProps = {
  title: string;
  data: AreaChartData[];
}

export default function AreaChart({
  title,
  data,
}: AreaChartProps): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    workDoneColor,
    revenueColor,
    cashInColor,
  ] = chartColorPalettes;

  const tickFormatter = (value: number) => format.formatMoney(value / 1000);
  const tooltipFormatter = (value: number) => `${format.formatMoney(value / 1000)} tỷ VND`;

  return (
    <div style={{ width: '100%' }}>
      <Typography align="center" variant="h6">{title}</Typography>
      <div style={{ width: '100%', height: 280, padding: '8px' }}>
        <ResponsiveContainer>
          <ComposedChart
            data={data}
            margin={{
              top: 0, right: 0, bottom: 0, left: 0,
            }}
          >
            <defs>
              <linearGradient id="colorWorkDone" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={workDoneColor} stopOpacity={1} />
                <stop offset="100%" stopColor={workDoneColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={revenueColor} stopOpacity={1} />
                <stop offset="100%" stopColor={revenueColor} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCashIn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cashInColor} stopOpacity={1} />
                <stop offset="100%" stopColor={cashInColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="period" type="category" scale="band" />
            <YAxis type="number" mirror={matches} tickFormatter={tickFormatter} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Area
              isAnimationActive={false}
              name="Sản lượng"
              type="monotone"
              dataKey="workDone"
              stroke={workDoneColor}
              fillOpacity={0.5}
              fill="url(#colorWorkDone)"
            />
            <Area
              isAnimationActive={false}
              name="Doanh thu"
              type="monotone"
              dataKey="revenue"
              stroke={revenueColor}
              fillOpacity={0.5}
              fill="url(#colorRevenue)"
            />
            <Area
              isAnimationActive={false}
              name="Tiền về"
              type="monotone"
              dataKey="cashIn"
              stroke={cashInColor}
              fillOpacity={0.5}
              fill="url(#colorCashIn)"
            />
            {renderSplitLine()}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}