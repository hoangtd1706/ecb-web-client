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

import efmService, { ProjectReport } from '../services/efm';

import dataProvider from '../common/efm08Helpers';

import Efm08AreaChart from '../components/efm08/Efm08AreaChart';
import Efm08MixedChart from '../components/efm08/Efm08MixedChart';

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

export default function Efm08(): JSX.Element {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [report, setReport] = React.useState<ProjectReport[]>([]);

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      setReport(await efmService.getEfm08Report());
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
            <Typography variant="h6">Báo cáo Tuổi nợ</Typography>
          </Grid>
          <Grid item>
            <DownloadButton
              filename="Efm08.xlsx"
              url="/api/ebi/efm/get-excel?report=efm08"
              label="Tải báo cáo"
            />
          </Grid>
        </Grid>
        {report.length > 0 && (
          <>
            <Grid item xs={12}>
              <Efm08AreaChart
                title="Tình trạng quá hạn Phải thu trong ngắn hạn"
                data={dataProvider.getAreaChartData('1', report)}
              />
            </Grid>
            <Grid item xs={12}>
              <Efm08AreaChart
                title="Tình trạng quá hạn Phải thu retention"
                data={dataProvider.getAreaChartData('2', report)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Efm08MixedChart
                title="Top 5 dự án quá hạn Phải thu trong ngắn hạn lớn"
                data={dataProvider.getMixedChartData('1', report)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Efm08MixedChart
                title="Top 5 dự án quá hạn Phải thu retention lớn"
                data={dataProvider.getMixedChartData('2', report)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  )
}