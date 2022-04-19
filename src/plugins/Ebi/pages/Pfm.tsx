import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
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

import viewerService, {
  ViewerModel,
} from '../services/reportViewer';

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

export default function Pfm(): JSX.Element {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [projects, setProjects] = React.useState<ViewerModel[]>([]);

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      setProjects(await viewerService.getPermission('pfm'));
    }
    catch {
      dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
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
        <Grid container alignItems="center" item spacing={1} className={classes.menu} xs={12}>
          <Grid item className={classes.title}>
            <Typography variant="h6">Báo cáo Tài chính Dự án</Typography>
          </Grid>
        </Grid>
        <Grid item spacing={1} xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Dự án</TableCell>
                <TableCell>Tên dự án</TableCell>
                <TableCell>Pfm01</TableCell>
                <TableCell>Pfm02</TableCell>
                <TableCell>Pfm03</TableCell>
                <TableCell>Pfm04</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map(p => (
                <TableRow key={p.projectCode}>
                  <TableCell>{p.projectCode}</TableCell>
                  <TableCell>{p.projectName}</TableCell>
                  <TableCell>
                    <DownloadButton
                      filename={`Pfm01_${p.projectCode}.xlsx`}
                      url={`/api/ebi/pfm01/getExcel?projectCode=${p.projectCode}`}
                      label="Tải báo cáo"
                    />
                  </TableCell>
                  <TableCell>
                    <DownloadButton
                      filename={`Pfm02_${p.projectCode}.xlsx`}
                      url={`/api/ebi/pfm02/getExcel?projectCode=${p.projectCode}`}
                      label="Tải báo cáo"
                    />
                  </TableCell>
                  <TableCell>
                    <DownloadButton
                      filename={`Pfm03_${p.projectCode}.xlsx`}
                      url={`/api/ebi/pfm03/getExcel?projectCode=${p.projectCode}`}
                      label="Tải báo cáo"
                    />
                  </TableCell>
                  <TableCell>
                    <DownloadButton
                      filename={`Pfm04_${p.projectCode}.xlsx`}
                      url={`/api/ebi/pfm04/getExcel?projectCode=${p.projectCode}`}
                      label="Tải báo cáo"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </div>
  )
}