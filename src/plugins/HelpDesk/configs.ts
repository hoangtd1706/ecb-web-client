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
  id: 2,
  routeOrder: 1,
  text: 'Help Desk',
  icon: 'hands-helping',
  link: '/help-desk/list/my-issues',
  route: '/help-desk'
}

export const menuList: MenuModel[] = [
  {
    text: 'Issue',
    items: [
      {
        text: 'Tạo issue',
        color: 'danger',
        icon: 'plus',
        link: '/help-desk/create-issue',
      },
      {
        text: 'Issue của bạn',
        color: 'success',
        icon: 'bug',
        link: '/help-desk/list/my-issues',
      },
      {
        text: 'Tất cả issue',
        color: 'primary',
        icon: 'list-ul',
        link: '/help-desk/list/all',
      },
    ]
  },
  {
    text: 'Hỗ trợ',
    items: [
      {
        text: 'Issue hỗ trợ',
        color: 'info',
        icon: 'user-astronaut',
        link: '/help-desk/list/supported',
      },
      {
        text: 'Issue chờ phản hồi',
        color: 'warning',
        icon: 'hourglass-half',
        link: '/help-desk/list/waiting',
      },
    ]
  },
];

export const adminMenuList: MenuModel[] = [{
  text: 'Admin',
  items: [
    { text: 'Modules', color: 'primary', icon: 'cubes', link: '/help-desk/admin/modules' },
    { text: 'Người dùng', color: 'secondary', icon: 'user', link: '/help-desk/admin/users' },
    { text: 'Cài đặt module', color: 'success', icon: 'cogs', link: '/help-desk/admin/settings' },
  ]
}];