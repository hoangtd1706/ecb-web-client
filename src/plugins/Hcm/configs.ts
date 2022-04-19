// import moderatorService from './services/moderator';
import userService from './services/user';

import {
  PluginModel,
  MenuModel,
} from '../../core';

export const checkPermission = (): Promise<boolean> => {
  return userService.checkPermission();
}

export const checkAdmin = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    resolve(false);
  });
}

//------------------------------------------------------------------------------------------//

export const plugin: PluginModel = {
  id: 4,
  routeOrder: 3,
  text: 'Nhân sự',
  icon: 'users',
  link: '/hcm/employees',
  route: '/hcm'
}

export const menuList: MenuModel[] = [
  {
    text: 'Nhân sự',
    items: [
      {
        text: 'Nhân viên',
        color: 'primary',
        icon: 'users-cog',
        link: '/hcm/employees',
      }
    ]
  },
];

export const adminMenuList: MenuModel[] = [
];