import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  AppBar as AppBarMui,
  Hidden,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuProps,
  Grid,
} from '@material-ui/core';
import AppsIcon from '@material-ui/icons/Apps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useTypedSelector, PluginModel } from '../../core';
import { LayoutContext } from './LayoutProvider';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    color: 'white',
    textDecoration: 'none',
  },
  pluginBar: {
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'row',
  },
  plugin: {
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(0.75),
    height: '48px',
    minWidth: '68px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#08915f',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '48px',
    },
  },
  pluginActive: {
    paddingLeft: theme.spacing(0.75),
    paddingRight: theme.spacing(0.75),
    height: '48px',
    minWidth: '68px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderBottom: '3px solid red',
    [theme.breakpoints.down('xs')]: {
      minWidth: '48px',
    },
  },
  button: {
    height: '32px',
    width: '32px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: '#08915f',
    },
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  logo: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
    height: '30px',
  },
  title: {
    display: 'block',
    flexGrow: 1,
    textAlign: 'center',
  },
  sectionDesktop: {
    display: 'flex',
  },
}));

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

const StyledMenu = withStyles({
  paper: {
    width: '100%',
    backgroundColor: 'transparent',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

export default function AppBar(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const { onMobileToggle } = React.useContext(LayoutContext);
  const { activePluginId, pluginList } = useTypedSelector(state => state.layout);
  const [home, ...rest] = pluginList;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    window.location.reload();
  }

  const handleBack = () => {
    history.goBack();
  }

  const handleForward = () => {
    history.goForward();
  }

  const handleChangePlugin = (plugin: PluginModel) => {
    if (plugin.id !== activePluginId) {
      history.push(plugin.link);
    }
  };

  return (
    <>
      <AppBarMui position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMobileToggle}
            className={classes.menuButton}
          >
            <FontAwesomeIcon style={{ fontSize: '1.25rem' }} icon="bars" />
          </IconButton>
          <Hidden xsDown implementation="css">
            <div className={classes.pluginBar}>
              {pluginList.map((plugin) => (
                <div
                  className={plugin.id === activePluginId ? classes.pluginActive : classes.plugin}
                  key={plugin.id}
                  onClick={() => { handleChangePlugin(plugin); }}
                >
                  <FontAwesomeIcon style={{ fontSize: '1.25rem' }} icon={plugin.icon} />
                  <Typography variant="caption" style={{ fontSize: '0.65rem' }}>{plugin.text}</Typography>
                </div>
              ))}
            </div>
          </Hidden>
          <Hidden smUp implementation="css">
            <div className={classes.pluginBar}>
              {home !== undefined && (
                <div
                  className={home.id === activePluginId ? classes.pluginActive : classes.plugin}
                  onClick={() => { handleChangePlugin(home); }}
                >
                  <FontAwesomeIcon style={{ fontSize: '1.25rem' }} icon={home.icon} />
                </div>
              )}
              <div
                className={classes.plugin}
                onClick={handleClick}
                aria-controls="app-menu"
                aria-haspopup="true"
              >
                <AppsIcon style={{ width: '30px', height: '30px' }} />
              </div>
            </div>
            <StyledMenu
              id="app-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Grid container spacing={2} style={{
                padding: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              }}>
                {rest.map((plugin, index) => (
                  <Grid
                    key={plugin.id}
                    item xs={3}
                    className={classes.menuItem}
                    onClick={() => {
                      handleChangePlugin(plugin);
                      handleClose();
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      backgroundColor: colorPalettes[index],
                      height: '40px',
                      width: '40px',
                      borderRadius: '10px'
                    }}>
                      <FontAwesomeIcon style={{ fontSize: '1.5rem' }} icon={plugin.icon} />
                    </div>
                    <Typography noWrap variant="caption" style={{ fontSize: '0.7rem', color: 'white' }}>{plugin.text}</Typography>
                  </Grid>
                ))}
              </Grid>
            </StyledMenu>
          </Hidden>
          <Typography className={classes.title} variant="h6" noWrap />
          <div className={classes.pluginBar}>
            <div className={classes.button} onClick={() => { handleBack() }}>
              <FontAwesomeIcon style={{ fontSize: '1.25rem' }} icon="chevron-left" />
            </div>
            <div className={classes.button} onClick={() => { handleForward() }}>
              <FontAwesomeIcon style={{ fontSize: '1.25rem' }} icon="chevron-right" />
            </div>
            <div className={classes.button} onClick={() => { handleRefresh() }}>
              <FontAwesomeIcon style={{ fontSize: '1.25rem' }} icon="sync-alt" />
            </div>
          </div>
        </Toolbar>
      </AppBarMui>
    </>
  );
}
