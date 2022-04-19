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

import efmService, { BankReport } from '../services/efm';

import dataProvider from '../common/efm06Helpers';

import Efm06BarChart from '../components/efm06/Efm06BarChart';
import Efm06PieChart from '../components/efm06/Efm06PieChart';
import Efm06SCurveChart from '../components/efm06/Efm06SCurveChart';

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

export default function Efm06(): JSX.Element {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [report, setReport] = React.useState<BankReport[]>([]);

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      setReport(await efmService.getEfm06Report());
    }
    catch {
      dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
      setReport([]);
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.content}>
      <Grid container spacing={1} style={{ padding: '8px' }}>
        <Grid container alignItems="center" item spacing={1} xs={12} className={classes.menu}>
          <Grid item className={classes.title}>
            <Typography variant="h6">Báo cáo Tiền gửi</Typography>
          </Grid>
          <Grid item>
            <DownloadButton
              filename="Efm06.xlsx"
              url="/api/ebi/efm/get-excel?report=efm06"
              label="Tải báo cáo"
            />
          </Grid>
        </Grid>
        {report.length > 0 && (
          <>
            <Grid item xs={12} md={6}>
              <Efm06BarChart
                title="Hạn mức tín dụng tại tháng báo cáo"
                data={dataProvider.getBarChartData(report)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Efm06PieChart
                title="Cơ cấu tiền gửi tại tháng báo cáo"
                data={dataProvider.getPieChartData(report)}
              />
            </Grid>
            <Grid item xs={12}>
              <Efm06SCurveChart
                title="Tiền gửi - Tiền vay - Vay ròng tại tháng báo cáo"
                data={dataProvider.getSCurveChartData(report)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  )
}