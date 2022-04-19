import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
} from '@material-ui/core';
import {
  DownloadButton,
} from '@nvdunginest/emis-mui';

import {
  AppDispatch,
  alertActions,
  alertMessage,
  loadingActions,
} from '../../../core';

import format from '../../../configs/format';

import efmService from '../services/efm';
import { ReportItem } from '../services/types';

import dataProvider, { CategoryConfig } from '../common/efm05Helpers';

import SCurveChart from '../components/SCurveChart';
import PieChart, { PieChartData } from '../components/PieChart';
import GapBar2Chart from '../components/GapBar2Chart';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    height: 'calc(100% - 32px)',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(-1),
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      height: 'calc(100% - 48px)',
    },
  },
  menu: {
    display: 'flex',
    width: '100%',
  },
  title: {
    flexGrow: 1,
    textTransform: 'uppercase',
  },
  link: {
    textDecoration: 'none',
  },
}));

const generateReportType = (start: number, end: number): string[] => {
  const result: string[] = [];

  for (let i = start; i <= end; i++) {
    result.push(`${i}`);
  }

  return result;
}

const salaryCategories: CategoryConfig[] = [
  {
    name: 'Văn phòng',
    reportTypes: ['1'],
  },
  {
    name: 'Dự bị',
    reportTypes: ['2'],
  },
  {
    name: 'Chi phí lương khác',
    reportTypes: ['3'],
  },
];

const categories: CategoryConfig[] = [
  {
    name: 'Chi phí lương',
    reportTypes: ['1', '2', '3'],
  },
  {
    name: 'Chi phí phúc lợi',
    reportTypes: generateReportType(4, 18),
  },
  {
    name: 'Chi phí hành chính',
    reportTypes: generateReportType(19, 45),
  },
];

export default function Efm05(): JSX.Element {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [report, setReport] = React.useState<ReportItem[]>([]);
  const [salaryPieData, setSalaryPieData] = React.useState<PieChartData[]>([]);
  const [pieData, setPieData] = React.useState<PieChartData[]>([]);

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      setReport(await efmService.getEfm05Report());
    }
    catch {
      dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
      setReport([]);
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  const salaryTooltipFormatter = (value: number) => {
    const total = salaryPieData.map(x => x.value).reduce((acc, val) => acc + val, 0);
    return `${format.formatMoney(value / 1000000000)} tỷ VND (${format.formatMoney(value / total * 100, 0)}%)`;
  }

  const tooltipFormatter = (value: number) => {
    const total = pieData.map(x => x.value).reduce((acc, val) => acc + val, 0);
    return `${format.formatMoney(value / 1000000000)} tỷ VND (${format.formatMoney(value / total * 100, 0)}%)`;
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setSalaryPieData(dataProvider.getPieChartData(report, salaryCategories));
    setPieData(dataProvider.getPieChartData(report, categories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report]);

  return (
    <div className={classes.content}>
      <Grid container spacing={1} style={{ padding: '8px' }}>
        <Grid container alignItems="center" item spacing={1} xs={12} className={classes.menu}>
          <Grid item className={classes.title}>
            <Typography variant="h6">Báo cáo Chi phí Quản lý doanh nghiệp</Typography>
          </Grid>
          <Grid item>
            <DownloadButton
              filename="Efm05.xlsx"
              url="/api/ebi/efm/get-excel?report=efm05"
              label="Tải báo cáo"
            />
          </Grid>
        </Grid>
        {report.length > 0 && (
          <>
            <Grid item xs={12} md={6}>
              <SCurveChart
                title="Chi phí Quản lý doanh nghiệp"
                data={dataProvider.getSCurveChartData(report)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <GapBar2Chart
                title="GAP lũy kế chi phí QLDN"
                data={dataProvider.getGap2ChartData(report, categories)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PieChart
                title="Cơ cấu chi phí lương thực tế lũy kế đến kỳ báo cáo"
                tooltipFormatter={salaryTooltipFormatter}
                data={salaryPieData}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <PieChart
                title="Cơ cấu chi phí quản lý thực tế lũy kế đến kỳ báo cáo"
                tooltipFormatter={tooltipFormatter}
                data={pieData}
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  )
}