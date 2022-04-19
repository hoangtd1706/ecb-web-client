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
  id: 7,
  routeOrder: 6,
  text: 'Báo cáo',
  icon: 'chart-pie',
  link: '/ebi/dashboard',
  route: '/ebi'
}

export const menuList: MenuModel[] = [
  {
    text: 'Thông tin chung',
    items: [
      { text: 'Dashboard', color: 'success', icon: 'chart-pie', link: '/ebi/dashboard' },
    ]
  },
  {
    text: 'Công ty',
    items: [
      { text: 'Tài chính công ty', color: 'primary', icon: 'chart-line', link: '/ebi/enterprise' },
      { text: 'Tài chính dự án', color: 'success', icon: 'chart-line', link: '/ebi/pfm' },
    ]
  },
];

export const adminMenuList: MenuModel[] = [
  {
    text: 'Admin',
    items: [
      { text: 'Cài đặt module', color: 'success', icon: 'cogs', link: '/ebi/admin/settings' },
    ]
  },
  {
    text: 'Phân quyền',
    items: [
      { text: 'BCTC Công ty', color: 'primary', icon: 'user', link: '/ebi/admin/enterprise-users' },
      { text: 'BCTC Dự án', color: 'success', icon: 'user', link: '/ebi/admin/pfm-users' },
    ]
  }
];
