import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
} from '@material-ui/core';

import {
  AppDispatch,
  alertActions,
  alertMessage,
  loadingActions,
} from '../../../core';

import userService from '../services/user';
import { reportList } from '../constants/report';

const colors = [
  '#0D6EFD',
  '#198754',
  '#FFC107',
  '#DC3545',
  '#0DCAF0',
  '#6C757D',
]
const colorPalettes = [
  ...colors,
  ...colors,
  ...colors,
  ...colors,
  ...colors,
];

const useStyles = makeStyles(() => ({
  box: {
    padding: 8,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#bcc3cf',
    },
  },
  link: {
    display: 'flex',
    flexDirection: 'row',
    textDecoration: 'none',
    color: 'black',
  },
}));

export default function Enterprise(): JSX.Element {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const [permissions, setPermissions] = React.useState<boolean[]>([]);

  React.useEffect(() => {
    dispatch(loadingActions.show());
    Promise.all([
      userService.checkRolePermission('EFM01_ROLE'),
      userService.checkRolePermission('EFM02_ROLE'),
      userService.checkRolePermission('EFM03_ROLE'),
      userService.checkRolePermission('EFM04_ROLE'),
      userService.checkRolePermission('EFM05_ROLE'),
      userService.checkRolePermission('EFM06_ROLE'),
      userService.checkRolePermission('EFM07_ROLE'),
      userService.checkRolePermission('EFM08_ROLE'),
      userService.checkRolePermission('EFM09_ROLE'),
      userService.checkRolePermission('PFM03_ROLE'),
    ])
      .then((data) => {
        setPermissions(data);
      })
      .catch(() => {
        setPermissions([]);
        dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
      })
      .finally(() => {
        dispatch(loadingActions.hide());
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Grid container spacing={2} style={{ padding: 8 }}>
      {permissions.map((p, index) => p && (
        <Grid
          key={index}
          item xs={12}
          sm={6}
          md={3}
          className={classes.box}
        >
          <Link to={reportList[index].link} className={classes.link}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              backgroundColor: colorPalettes[index],
              height: '50px',
              width: '50px',
              borderRadius: '10px',
              marginRight: 8,
            }}>
              <FontAwesomeIcon style={{ fontSize: '1.8rem' }} icon={reportList[index].icon} />
            </div>
            <div style={{
              flexGrow: 1,
            }}>
              <Typography noWrap variant="body1" style={{ fontWeight: 'bold' }}>{reportList[index].name}</Typography>
              <Typography noWrap variant="subtitle2">{reportList[index].text}</Typography>
            </div>
          </Link>
        </Grid>
      ))
      }
    </Grid >
  )
}
