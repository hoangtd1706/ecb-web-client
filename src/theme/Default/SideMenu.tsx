import React from 'react';
import clsx from 'clsx';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  makeStyles,
} from '@material-ui/core/styles';
import {
  Drawer,
  Hidden,
  Divider,
} from '@material-ui/core';

import { useTypedSelector, MenuModel } from '../../core';

import { drawerWidth } from './types';
import {
  LayoutContext,
} from './LayoutProvider';

import UserInfo from './UserInfo';
import MenuHeader from './MenuHeader';
import MenuItem from './MenuItem';

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    whiteSpace: 'nowrap',
    display: 'flex',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    overflowY: 'hidden',
    width: theme.spacing(7) + 1,
  },
  drawerPaper: {
    width: drawerWidth,
    display: 'flex',
  },
  toolbar: {
    height: '48px',
  },
  listHeader: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
}));

const renderMenuList = (menuList: MenuModel[]): JSX.Element => {
  return (
    <>
      {menuList.map((menu, index) => (
        <React.Fragment key={`menu_${index}`}>
          <MenuHeader text={menu.text} />
          {menu.items.map((item, i) => (
            <MenuItem
              key={`sub_menu_${i}`}
              color={item.color}
              icon={item.icon}
              link={item.link}
              text={item.text}
            />
          ))}
          <Divider />
        </React.Fragment>
      ))}
    </>
  )
}

export default function SideMenu(): JSX.Element {
  const classes = useStyles();
  const {
    mobileOpen,
    drawerOpen,
    onMobileToggle,
    onDrawerClose,
    onDrawerOpen,
  } = React.useContext(LayoutContext);

  const menuList = useTypedSelector(state => state.layout.menuList);

  return (
    <nav className={classes.drawer} aria-label="side bar">

      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      {/* Lg */}
      <Hidden mdDown implementation="css">
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <div style={{ flex: 1, overflow: 'hidden', paddingTop: '48px', display: 'flex' }}>
            <Scrollbars style={{ flex: 1 }}>
              {renderMenuList(menuList)}
            </Scrollbars>
          </div>
          <UserInfo />
        </Drawer>
      </Hidden>
      {/* Lg */}

      {/* Sm --> Md */}
      <Hidden lgUp xsDown implementation="css">
        <Drawer
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: drawerOpen,
            [classes.drawerClose]: !drawerOpen,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: drawerOpen,
              [classes.drawerClose]: !drawerOpen,
            }),
          }}
          variant="permanent"
          open
          onMouseMove={onDrawerOpen}
          onMouseLeave={onDrawerClose}
        >
          <div style={{ flex: 1, overflow: 'hidden', paddingTop: '48px', display: 'flex' }}>
            <Scrollbars style={{ flex: 1 }}>
              {renderMenuList(menuList)}
            </Scrollbars>
          </div>
          <UserInfo />
        </Drawer>
      </Hidden>
      {/* Sm --> Md */}

      {/* Xs */}
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
            <Scrollbars style={{ flex: 1 }}>
              {renderMenuList(menuList)}
            </Scrollbars>
          </div>
          <UserInfo />
        </Drawer>
      </Hidden>
      {/* Xs */}

    </nav>
  );
}
