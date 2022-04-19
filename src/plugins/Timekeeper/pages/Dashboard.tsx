import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { blue, grey, amber } from '@material-ui/core/colors';
import {
  Typography,
  Grid,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Frame,
  IconButton,
} from '@nvdunginest/emis-mui';

import {
  alertActions,
  loadingActions,
  alertMessage,
  AppDispatch,
} from '../../../core';

import format from '../../../configs/format';
import timeLogService, { TimeLogModel } from '../services/timeLog';

const useStyles = makeStyles((theme) => ({
  cell: {
    padding: theme.spacing(1),
    height: theme.spacing(8),
    width: 'calc(100%/7)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5),
    },
  },
  head: {
    padding: theme.spacing(1),
    width: 'calc(100%/7)',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cellContent: {
    display: 'flex',
    flexDirection: 'column',
  }
}));

export default function Dashboard(): JSX.Element {
  const classes = useStyles();
  const [timeLogs, setTimeLogs] = React.useState<TimeLogModel[]>([]);
  const dispatch: AppDispatch = useDispatch();

  const [month, setMonth] = React.useState<number>((new Date()).getMonth() + 1);
  const [year, setYear] = React.useState<number>((new Date()).getFullYear());

  const refresh = async () => {
    dispatch(loadingActions.show());
    try {
      setTimeLogs(await timeLogService.get(month, year));
    }
    catch {
      dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
    }
    finally {
      dispatch(loadingActions.hide());
    }
  }

  const handlePlus = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    }
    else {
      setMonth(month + 1);
    }
  }

  const handleMinus = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    }
    else {
      setMonth(month - 1);
    }
  }

  const getStartDate = (): Date => {
    const current = new Date(year, month - 1, 1);
    const day = current.getDay();
    current.setDate(current.getDate() - day);

    return current;
  }

  const getEndDate = (): Date => {
    const current = new Date(year, month, 0);
    const day = current.getDay();
    current.setDate(current.getDate() - day + 6);

    return current;
  }

  const addDate = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
  }

  const getDateArray = (): Date[][] => {
    const result: Date[][] = [];
    const start = getStartDate();
    const end = getEndDate();

    let row: Date[] = [];
    for (let date = start; date <= end; date = addDate(date, 1)) {
      if (date.getDay() === 0) {
        row = [];
        row.push(date);
      }
      else {
        if (date.getDay() === 6) {
          row.push(date);
          result.push(row);
        }
        else {
          row.push(date);
        }
      }
    }

    return result;
  }

  const validateDate = (a: Date, b: Date): boolean => {
    if (a.getFullYear() !== b.getFullYear()) return false;
    if (a.getMonth() !== b.getMonth()) return false;
    if (a.getDate() !== b.getDate()) return false;

    return true;
  }

  const getInText = (date: Date): string => {
    const data = timeLogs.find(x => validateDate(new Date(x.date), date));
    if (data === undefined) {
      return '';
    }

    if (data.hasTimeIn) {
      return format.formatDate(new Date(data.timeIn), 'hh:mm');
    }

    return '';
  }

  const getOutText = (date: Date): string => {
    const data = timeLogs.find(x => validateDate(new Date(x.date), date));
    if (data === undefined) {
      return '';
    }

    if (data.hasTimeOut) {
      return format.formatDate(new Date(data.timeOut), 'hh:mm');
    }

    return '';
  }

  React.useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  return (
    <Frame title="Time Event" noPadding>
      <Grid style={{ width: '100%' }} container>
        <Grid
          item xs={12}
          style={{ padding: '16px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <IconButton
            icon="chevron-left"
            onClick={handleMinus}
          />
          <Typography variant="subtitle2">
            {`${month}/${year}`}
          </Typography>
          <IconButton
            icon="chevron-right"
            onClick={handlePlus}
          />
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', flexDirection: 'row' }}>
          <div className={classes.head}>CN</div>
          <div className={classes.head}>T2</div>
          <div className={classes.head}>T3</div>
          <div className={classes.head}>T4</div>
          <div className={classes.head}>T5</div>
          <div className={classes.head}>T6</div>
          <div className={classes.head}>T7</div>
        </Grid>
        {getDateArray().map((row, rowIndex) => (
          <Grid item xs={12} key={rowIndex} style={{ display: 'flex', flexDirection: 'row' }}>
            {row.map((cell, cellIndex) => (
              <div
                style={{
                  backgroundColor: cell.getMonth() === month - 1 ? 'inherit' : grey[100]
                }}
                className={classes.cell}
                key={cellIndex}
              >
                {cell.getMonth() === (month - 1) && (
                  <div className={classes.cellContent}>
                    <Typography style={{ width: '100%' }} variant="subtitle2" align="center">
                      {format.formatDate(cell, 'dd')}
                    </Typography>
                    <Typography style={{ fontSize: '0.65rem', color: blue[800], fontWeight: 'bold' }} variant="caption" align="left">
                      <FontAwesomeIcon style={{ fontSize: '0.5rem' }} icon="chevron-right" />
                      {` ${getInText(cell)}`}
                    </Typography>
                    <Typography style={{ fontSize: '0.65rem', color: amber[800], fontWeight: 'bold' }} variant="caption" align="left">
                      <FontAwesomeIcon style={{ fontSize: '0.5rem' }} icon="chevron-left" />
                      {` ${getOutText(cell)}`}
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </Grid>
        ))}
      </Grid>
    </Frame>
  )
}