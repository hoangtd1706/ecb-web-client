export const drawerWidth = 240;

export type LayoutStore = {
  drawerOpen: boolean,
  mobileOpen: boolean,
  onDrawerOpen: () => void,
  onDrawerClose: () => void,
  onMobileToggle: () => void,
}

export const defaultStore: LayoutStore = {
  drawerOpen: false,
  mobileOpen: false,
  onDrawerOpen: () => { return; },
  onDrawerClose: () => { return; },
  onMobileToggle: () => { return; },
};
