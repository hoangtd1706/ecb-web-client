import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  Typography,
} from '@material-ui/core';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Legend,
  Line,
} from 'recharts';

import format from '../../../../configs/format';
import { chartColorPalettes } from '../../constants/colors';

import { renderSplitLine } from '../common';
import { Efm06SCurveChartData } from '../../common/efm06Helpers';

type Props = {
  title: string;
  data: Efm06SCurveChartData[];
}

const tickFormatter = (value: number) => format.formatMoney(value / 1000000000);

const tooltipFormatter = (value: number) => {
  return `${format.formatMoney(value / 1000000000)} tỷ VND`;
}

export default function Efm06SCurveChart({
  title,
  data,
}: Props): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    depositColor,
    creditColor,
    balanceColor,
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
              name="Tổng tiền gửi"
              yAxisId={0}
              dataKey="deposit"
              fill={depositColor}
            />
            <Bar
              isAnimationActive={false}
              name="Tổng tiền vay"
              yAxisId={0}
              dataKey="credit"
              fill={creditColor}
            />
            <Line
              isAnimationActive={false}
              name="Vay ròng"
              yAxisId={1}
              type="linear"
              dataKey="balance"
              dot={{ r: 4, stroke: balanceColor, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: balanceColor }}
              stroke={balanceColor}
              strokeWidth={3}
            />
            {renderSplitLine()}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
