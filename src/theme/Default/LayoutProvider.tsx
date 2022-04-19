import React from 'react';
import {
  LayoutStore,
  defaultStore,
} from './types';

export const LayoutContext = React.createContext(defaultStore);

type LayoutProviderProps = {
  children: JSX.Element | JSX.Element[];
}

const LayoutProvider = ({ children }: LayoutProviderProps): JSX.Element => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const onDrawerClose = () => {
    setDrawerOpen(false);
  };

  const onDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const onMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const store: LayoutStore = {
    drawerOpen,
    mobileOpen,
    onDrawerOpen,
    onDrawerClose,
    onMobileToggle,
  };

  return (
    <LayoutContext.Provider value={store}>
      { children}
    </LayoutContext.Provider>
  );
};

export default LayoutProvider;
