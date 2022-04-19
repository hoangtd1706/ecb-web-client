import moderatorService from './services/moderator';
import userService, { RoleType } from './services/user';

import {
  PluginModel,
  MenuModel,
} from '../../core';

export const checkPermission = (): Promise<boolean> => {
  return userService.checkPermission();
}

export const checkAdmin = (): Promise<boolean> => {
  return moderatorService.checkPermission();
}

export const checkRolePermission = (role: RoleType): Promise<boolean> => {
  return userService.checkRolePermission(role);
}

//------------------------------------------------------------------------------------------//

export const plugin: PluginModel = {
  id: 6,
  routeOrder: 5,
  text: 'Chấm công',
  icon: 'fingerprint',
  link: '/timekeeper/dashboard',
  route: '/timekeeper'
}

export const menuList: MenuModel[] = [{
  text: 'Thông tin chung',
  items: [
    { text: 'Dashboard', color: 'primary', icon: 'calendar-alt', link: '/timekeeper/dashboard' },
  ]
}];

export const adminMenuList: MenuModel[] = [{
  text: 'Admin',
  items: [
    { text: 'Người dùng', color: 'primary', icon: 'user', link: '/timekeeper/admin/users' },
    { text: 'Cài đặt module', color: 'success', icon: 'cogs', link: '/timekeeper/admin/settings' },
  ]
}];
