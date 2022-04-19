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
  id: 3,
  routeOrder: 2,
  text: 'Hợp đồng B',
  icon: 'file-contract',
  link: '/b-contract/dashboard',
  route: '/b-contract'
}

export const menuList: MenuModel[] = [{
  text: 'Thông tin chung',
  items: [
    { text: 'Dashboard', color: 'primary', icon: 'tachometer-alt', link: '/b-contract/dashboard' }
  ]
}];

export const adminMenuList: MenuModel[] = [{
  text: 'Admin',
  items: [
    { text: 'Tạo hợp đồng', color: 'primary', icon: 'user-plus', link: '/b-contract/admin/creators' },
    { text: 'Phê duyệt', color: 'secondary', icon: 'user-edit', link: '/b-contract/admin/approvers' },
  ]
}];

export const creatorMenuList: MenuModel[] = [{
  text: 'Hợp đồng B',
  items: [
    { text: 'Đang xử lý', color: 'primary', icon: 'sync-alt', link: '/b-contract/creator/list/processing' },
    { text: 'Chờ phê duyệt', color: 'warning', icon: 'hourglass-half', link: '/b-contract/creator/list/submitted' },
    { text: 'Đã phê duyệt', color: 'success', icon: 'check-circle', link: '/b-contract/creator/list/approved' },
    { text: 'Chờ mở lại', color: 'danger', icon: 'history', link: '/b-contract/creator/list/waiting' },
  ]
}];

export const approverMenuList: MenuModel[] = [{
  text: 'Phê duyệt hợp đồng B',
  items: [
    { text: 'Chờ phê duyệt', color: 'warning', icon: 'hourglass-half', link: '/b-contract/approver/list/submitted' },
    { text: 'Đã phê duyệt', color: 'success', icon: 'check-circle', link: '/b-contract/approver/list/approved' },
    { text: 'Chờ mở lại', color: 'danger', icon: 'history', link: '/b-contract/approver/list/waiting' },
  ]
}];
