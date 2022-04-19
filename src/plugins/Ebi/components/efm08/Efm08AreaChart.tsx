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

import { Efm08AreaChartData } from '../../common/efm08Helpers';

type Props = {
  title: string;
  data: Efm08AreaChartData[];
}

export default function Efm08AreaChart({
  title,
  data,
}: Props): JSX.Element {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('xs'));

  const [
    inDueColor,
    outDue1Color,
    outDue31Color,
    outDue91Color,
    outDue181Color,
  ] = chartColorPalettes;

  const tickFormatter = (value: number) => format.formatMoney(value / 1000000000);
  const tooltipFormatter = (value: number) => `${format.formatMoney(value / 1000000000)} tỷ VND`;

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
            <XAxis dataKey="period" type="category" scale="band" />
            <YAxis type="number" mirror={matches} tickFormatter={tickFormatter} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Area
              isAnimationActive={false}
              name="Trong hạn"
              type="monotone"
              dataKey="inDue"
              stackId={1}
              stroke={inDueColor}
              fill={inDueColor}
            />
            <Area
              isAnimationActive={false}
              name="Quá hạn 1-30 ngày"
              type="monotone"
              dataKey="outDue1"
              stackId={1}
              stroke={outDue1Color}
              fill={outDue1Color}
            />
            <Area
              isAnimationActive={false}
              name="Quá hạn 31-90 ngày"
              type="monotone"
              dataKey="outDue31"
              stackId={1}
              stroke={outDue31Color}
              fill={outDue31Color}
            />
            <Area
              isAnimationActive={false}
              name="Quá hạn 91-180 ngày"
              type="monotone"
              dataKey="outDue91"
              stackId={1}
              stroke={outDue91Color}
              fill={outDue91Color}
            />
            <Area
              isAnimationActive={false}
              name="Quá hạn trên 181 ngày"
              type="monotone"
              dataKey="outDue181"
              stackId={1}
              stroke={outDue181Color}
              fill={outDue181Color}
            />
            {renderSplitLine()}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}