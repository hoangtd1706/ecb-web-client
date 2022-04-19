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
  id: 8,
  routeOrder: 7,
  text: 'Thư viện',
  icon: 'book',
  link: '/library/dashboard',
  route: '/library'
}

export const menuList: MenuModel[] = [{
  text: 'Thư viện',
  items: [
    { text: 'Tìm kiếm', color: 'success', icon: 'search', link: '/library/dashboard' },
  ]
}];

export const adminMenuList: MenuModel[] = [{
  text: 'Admin',
  items: [
    { text: 'Người xem', color: 'primary', icon: 'user', link: '/library/admin/viewers' },
    { text: 'Người viết', color: 'warning', icon: 'user-edit', link: '/library/admin/creators' },
    { text: 'Cài đặt module', color: 'success', icon: 'cogs', link: '/library/admin/settings' },
  ]
}];

export const creatorMenuList: MenuModel[] = [{
  text: 'Người viết',
  items: [
    { text: 'Tạo bài viết', color: 'danger', icon: 'plus', link: '/library/creator/create-post' },
  ]
}];
