import {
  PluginModel,
  MenuModel,
} from '../../core';

export const checkPermission = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    resolve(true);
  });
}

export const checkAdmin = (): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    resolve(false);
  });
}

//------------------------------------------------------------------------------------------//

export const plugin: PluginModel = {
  id: 1,
  routeOrder: 9999,
  text: 'Trang chủ',
  icon: 'home',
  link: '/',
  route: '/',
}

export const menuList: MenuModel[] = [
  {
    text: 'Thông tin chung',
    items: [
      {
        text: 'Giới thiệu',
        color: 'primary',
        icon: { iconName: 'lightbulb', prefix: 'far' },
        link: '/',
      }
    ]
  },
  {
    text: 'Thông tin tài khoản',
    items: [
      {
        text: 'Đổi mật khẩu',
        color: 'info',
        icon: 'key',
        link: '/change-password',
      }
    ]
  }
];

export const adminMenuList: MenuModel[] = [];

