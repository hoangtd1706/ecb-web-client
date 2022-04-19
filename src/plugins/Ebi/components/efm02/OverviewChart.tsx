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
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import format from '../../../../configs/format';
import { chartColorPalettes } from '../../constants/colors';
import { renderSplitLine } from '../common';

export type OverviewChartData = {
  period: string;
  outcome: number;
  income: number;
  total: number;
  baselineRatio: number;
  rebaselineRatio: number;
  forecastRatio: number;
}

type OverviewChartProps = {
  title: string;
  data: OverviewChartData[];
}

export default function OverviewChart({
  title,
  data,
}: OverviewChartProps): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    outcomeColor,
    incomeColor,
    totalColor,
  ] = chartColorPalettes;

  const [
    baselineColor,
    rebaselineColor,
    forecastColor,
  ] = chartColorPalettes;

  const barSize = 8;

  const tickFormatter = (value: number) => format.formatMoney(value / 1000000);
  const tooltipFormatter = (value: number, name: string) => {
    if (name === 'CPTC ròng/DT KHBĐ' || name === 'CPTC ròng/DT kế hoạch' || name === 'CPTC ròng/DT dự báo') {
      return `${format.formatMoney(value, 1)}%`;
    }
    else {
      return `${format.formatMoney(value / 1000000)} tr VND`;
    }
  };

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
              tickFormatter={(value: number) => `${format.formatMoney(value)}%`}
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
              name="Tổng chi phí tài chính"
              yAxisId={1}
              dataKey="outcome"
              barSize={barSize}
              fill={outcomeColor}
            />
            <Bar
              isAnimationActive={false}
              name="Tổng thu nhập tài chính"
              yAxisId={1}
              dataKey="income"
              barSize={barSize}
              fill={incomeColor}
            />
            <Bar
              isAnimationActive={false}
              name="Thu nhập/(Chi phí) tài chính ròng"
              yAxisId={1}
              dataKey="total"
              barSize={barSize}
              fill={totalColor}
            />
            <Line
              isAnimationActive={false}
              name="CPTC ròng/DT KHBĐ"
              yAxisId={0}
              type="linear"
              dataKey="baselineRatio"
              dot={{ r: 4, stroke: baselineColor, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: baselineColor }}
              stroke={baselineColor}
              strokeWidth={3}
            />
            <Line
              isAnimationActive={false}
              name="CPTC ròng/DT kế hoạch"
              yAxisId={0}
              type="linear"
              dataKey="rebaselineRatio"
              dot={{ r: 4, stroke: rebaselineColor, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: rebaselineColor }}
              stroke={rebaselineColor}
              strokeWidth={3}
            />
            <Line
              isAnimationActive={false}
              name="CPTC ròng/DT dự báo"
              yAxisId={0}
              type="linear"
              dataKey="forecastRatio"
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