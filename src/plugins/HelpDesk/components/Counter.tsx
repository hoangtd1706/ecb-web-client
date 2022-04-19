import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Hidden,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';

const useStyles = makeStyles((theme) => ({
  counter: {
    display: 'flex',
    marginRight: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      marginRight: theme.spacing(2),
    },
    alignItems: 'center',
    fontSize: theme.spacing(2),
    opacity: '0.8',
  },
}));

type CounterProps = {
  icon: IconName;
  value: number;
  text: string;
  color: string;
}

export default function Counter({
  icon,
  value,
  text,
  color,
}: CounterProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.counter}>
      <FontAwesomeIcon icon={icon} style={{ fontSize: 'inherit', color: color }} />
      {` ${value} `}
      <Hidden smDown>
        {text}
      </Hidden>
    </div>
  );
}