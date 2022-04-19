import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  makeStyles,
} from '@material-ui/core/styles';
import {
  Hidden,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import { LayoutContext } from './LayoutProvider';

const useStyles = makeStyles(() => ({
  listHeader: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
}));

type MenuHeaderProps = {
  text: string;
}

export default function MenuHeader({
  text,
}: MenuHeaderProps): JSX.Element {
  const classes = useStyles();
  const { drawerOpen } = React.useContext(LayoutContext);

  return (
    <>
      <Hidden mdDown implementation="css">
        <ListItem>
          <ListItemText className={classes.listHeader} secondary={text} />
        </ListItem>
      </Hidden>
      {/* Lg */}

      {/* Sm --> Md */}
      <Hidden lgUp xsDown implementation="css">
        <ListItem>
          {drawerOpen ? <ListItemText className={classes.listHeader} secondary={text} />
            : (
              <>
                <ListItemIcon>
                  <FontAwesomeIcon icon="ellipsis-h" style={{ fontSize: '1.25rem' }} />
                </ListItemIcon>
                <ListItemText primary="" />
              </>
            )}
        </ListItem>
      </Hidden>
      {/* Sm --> Md */}

      {/* Xs */}
      <Hidden smUp implementation="css">
        <ListItem>
          <ListItemText className={classes.listHeader} secondary={text} />
        </ListItem>
      </Hidden>
      {/* Xs */}
    </>
  );
}
