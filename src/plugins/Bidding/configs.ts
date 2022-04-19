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
  id: 5,
  routeOrder: 4,
  text: 'Đấu thầu',
  icon: { iconName: 'internet-explorer', prefix: 'fab' },
  link: '/bidding/dashboard',
  route: '/bidding'
}

export const menuList: MenuModel[] = [{
  text: 'Thông tin chung',
  items: [
    { text: 'Dashboard', color: 'primary', icon: 'tachometer-alt', link: '/bidding/dashboard' },
  ],
}];

export const adminMenuList: MenuModel[] = [{
  text: 'Admin',
  items: [
    { text: 'Chuyên quản', color: 'primary', icon: 'user-tag', link: '/bidding/admin/experts' },
    { text: 'Kiểm tra', color: 'secondary', icon: 'user-secret', link: '/bidding/admin/auditors' },
    { text: 'Danh sách vendor', color: 'warning', icon: 'truck', link: '/bidding/admin/vendors/list/approved' },
    { text: 'Chờ phê duyệt', color: 'info', icon: 'hourglass-half', link: '/bidding/admin/vendors/list/waiting' },
    { text: 'Material/Service master', color: 'success', icon: 'cubes', link: '/bidding/admin/materials' },
  ],
}];

export const expertMenuList: MenuModel[] = [{
  text: 'Gói thầu',
  items: [
    { text: 'Tạo gói thầu', color: 'success', icon: 'plus', link: '/bidding/expert/create-package' },
    { text: 'Gói thầu mới', color: 'danger', icon: 'star', link: '/bidding/expert/package-list/new' },
    { text: 'Gói thầu đang mở', color: 'warning', icon: 'spinner', link: '/bidding/expert/package-list/opening' },
    { text: 'Gói thầu đã đóng', color: 'primary', icon: 'check-circle', link: '/bidding/expert/package-list/closed' },
  ],
}];

export const auditorMenuList: MenuModel[] = [{
  text: 'Kiểm tra',
  items: [
    { text: 'Gói thầu mới', color: 'danger', icon: 'star', link: '/bidding/auditor/package-list/new' },
    { text: 'Gói thầu đang mở', color: 'warning', icon: 'spinner', link: '/bidding/auditor/package-list/opening' },
    { text: 'Gói thầu đã đóng', color: 'primary', icon: 'check-circle', link: '/bidding/auditor/package-list/closed' },
  ],
}];
