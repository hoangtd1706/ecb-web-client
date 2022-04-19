import React from 'react';
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

import { Efm08MixedChartData } from '../../common/efm08Helpers';

type Props = {
  title: string;
  data: Efm08MixedChartData[];
}

export default function Efm08MixedChart({
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
    outDueRatioColor,
  ] = chartColorPalettes;

  const tickFormatter = (value: number) => format.formatMoney(value / 1000000000);
  const tickRatioFormatter = (value: number) => format.formatMoney(value, 1);
  const tooltipFormatter = (value: number, name: string) => {
    if (name === 'Tỷ lệ quá hạn') {
      return `${format.formatMoney(value, 1)}%`;
    }
    return `${format.formatMoney(value / 1000000000)} tỷ VND`;
  }
  const tooltipLabelFormatter = (label: string) => {
    const project = data.find(x => x.projectCode === label);
    if (project !== undefined) {
      return `${project.projectCode} - ${project.projectName}`
    }

    return label;
  }

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
            <XAxis dataKey="projectCode" type="category" scale="band" />
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
              tickFormatter={tickRatioFormatter}
            />
            <Tooltip
              labelFormatter={tooltipLabelFormatter}
              formatter={tooltipFormatter} />
            <Legend />
            <Bar
              isAnimationActive={false}
              name="Trong hạn"
              dataKey="inDue"
              yAxisId={0}
              stackId={1}
              fill={inDueColor}
            />
            <Bar
              isAnimationActive={false}
              name="Quá hạn 1-30 ngày"
              dataKey="outDue1"
              yAxisId={0}
              stackId={1}
              fill={outDue1Color}
            />
            <Bar
              isAnimationActive={false}
              name="Quá hạn 31-90 ngày"
              dataKey="outDue31"
              yAxisId={0}
              stackId={1}
              fill={outDue31Color}
            />
            <Bar
              isAnimationActive={false}
              name="Quá hạn 91-180 ngày"
              dataKey="outDue91"
              yAxisId={0}
              stackId={1}
              fill={outDue91Color}
            />
            <Bar
              isAnimationActive={false}
              name="Quá hạn trên 181 ngày"
              dataKey="outDue181"
              yAxisId={0}
              stackId={1}
              fill={outDue181Color}
            />

            <Line
              isAnimationActive={false}
              name="Tỷ lệ quá hạn"
              yAxisId={1}
              type="linear"
              dataKey="outDueRatio"
              dot={{ r: 4, stroke: outDueRatioColor, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: outDueRatioColor }}
              stroke={outDueRatioColor}
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}