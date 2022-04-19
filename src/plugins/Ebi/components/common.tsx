import React from "react";
import * as colors from '@material-ui/core/colors';
import {
  ReferenceLine,
  Label,
} from 'recharts';

import {
  getCurrentPeriod,
  getPeriodLabel,
} from '../common/helpers';

export const renderSplitLine = (): JSX.Element => (
  <ReferenceLine
    x={getPeriodLabel(getCurrentPeriod())}
    values="Actual"
    strokeWidth={2}
    stroke={colors.red[700]}
    strokeDasharray="3 3"
  >
    <Label value="Thực tế" position="insideTopRight" />
    <Label value="Dự báo" position="insideTopLeft" />
  </ReferenceLine>
);