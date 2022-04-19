import permissionService from './services/permission';

import {
  PluginModel,
  MenuModel,
} from '../../core';

export const checkPermission = (): Promise<boolean> => {
  return permissionService.check();
}

export const checkAdmin = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    resolve(false);
  });
}

//------------------------------------------------------------------------------------------//

export const plugin: PluginModel = {
  id: 9999,
  routeOrder: 4,
  text: 'Admin',
  icon: 'cogs',
  link: '/admin/dashboard',
  route: '/admin'
}

export const menuList: MenuModel[] = [
  {
    text: 'Phân quyền module',
    items: [
      {
        text: 'Help Desk',
        color: 'primary',
        icon: 'hands-helping',
        link: '/admin/moderators/help-desk',
      },
      {
        text: 'Hcm',
        color: 'success',
        icon: 'users',
        link: '/admin/moderators/hcm',
      },
      {
        text: 'Hợp đồng B',
        color: 'warning',
        icon: 'file-contract',
        link: '/admin/moderators/contract',
      },
      {
        text: 'E Bidding',
        color: 'danger',
        icon: { iconName: 'internet-explorer', prefix: 'fab' },
        link: '/admin/moderators/bidding',
      },
      {
        text: 'Chấm công',
        color: 'info',
        icon: 'fingerprint',
        link: '/admin/moderators/timekeeper',
      },
      {
        text: 'E-BI',
        color: 'primary',
        icon: 'chart-pie',
        link: '/admin/moderators/ebi',
      },
      {
        text: 'Thư viện',
        color: 'secondary',
        icon: 'book',
        link: '/admin/moderators/library',
      },
      {
        text: 'Project System',
        color: 'success',
        icon: 'sitemap',
        link: '/admin/moderators/project-system',
      },
    ]
  },
  {
    text: 'Cấu hình hệ thống',
    items: [
      {
        text: 'Email',
        color: 'primary',
        icon: 'at',
        link: '/admin/email',
      },
      {
        text: 'Reset Password Email',
        color: 'secondary',
        icon: 'paper-plane',
        link: '/admin/reset-password-email',
      },
      {
        text: 'Sap Connection',
        color: 'success',
        icon: 'plug',
        link: '/admin/sap-connection',
      },
    ]
  },
  {
    text: 'Đấu thầu trực tuyến',
    items: [
      {
        text: 'Email',
        color: 'primary',
        icon: 'at',
        link: '/admin/bidding-email',
      },
      {
        text: 'Reset Password Email',
        color: 'secondary',
        icon: 'paper-plane',
        link: '/admin/bidding-reset-password-email',
      },
    ]
  },
];

export const adminMenuList: MenuModel[] = [];