import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
} from '@material-ui/core';
import {
  DownloadButton,
} from '@nvdunginest/emis-mui';

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

export default function Efm03(): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <Grid container spacing={1} style={{ padding: '8px' }}>
        <Grid container alignItems="center" item spacing={1} className={classes.menu}>
          <Grid item className={classes.title}>
            <Typography variant="h6">Báo cáo SL-DT-TV Công ty</Typography>
          </Grid>
          <Grid item>
            <DownloadButton
              filename="Efm03.xlsx"
              url="/api/ebi/efm03/getExcel"
              label="Tải báo cáo"
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}