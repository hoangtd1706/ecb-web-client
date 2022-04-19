import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  PaletteType,
  AlertType,
} from '@nvdunginest/emis-mui';
import {
  AppUser,
} from './accountService';

export type PluginModel = {
  id: number,
  routeOrder: number;
  icon: IconProp,
  text: string,
  link: string,
  route: string,
}

export type ContentModel = {
  routeOrder: number;
  element: JSX.Element;
}

export type SubMenuModel = {
  icon: IconProp;
  text: string;
  link: string;
  color: PaletteType;
}

export type MenuModel = {
  text: string;
  items: SubMenuModel[];
}

export type AuthState = {
  isLoading: boolean,
  isError: boolean,
  errorMessage: string,
  isVerifying: boolean,
  user: AppUser | null,
}

export type AlertState = {
  show: boolean;
  text: string;
  severity: AlertType;
}

export type LoadingState = boolean;

export type LayoutState = {
  activePluginId: number,
  menuList: MenuModel[],
  pluginList: PluginModel[],
  contentList: ContentModel[],
}