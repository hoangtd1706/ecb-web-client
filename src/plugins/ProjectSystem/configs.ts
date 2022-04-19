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
  id: 9,
  routeOrder: 8,
  text: 'iQS',
  icon: 'calculator',
  link: '/project-system/dashboard',
  route: '/project-system'
}

export const menuList: MenuModel[] = [{
  text: 'Thông tin chung',
  items: [
    {
      text: 'Dashboard',
      color: 'primary',
      icon: 'tachometer-alt',
      link: '/project-system/dashboard',
    },
    {
      text: 'Tra mã công tác',
      color: 'success',
      icon: 'search',
      link: '/project-system/service-masters',
    },
    {
      text: 'Tra mã vật tư',
      color: 'info',
      icon: 'search',
      link: '/project-system/materials',
    }
  ]
}];

export const adminMenuList: MenuModel[] = [{
  text: 'Admin',
  items: [
    {
      text: 'Kế hoạch',
      color: 'info',
      icon: 'chart-line',
      link: '/project-system/admin/planners',
    },
    {
      text: 'Khối lượng',
      color: 'warning',
      icon: 'pencil-ruler',
      link: '/project-system/admin/designers',
    },
    {
      text: 'Dự toán',
      color: 'success',
      icon: 'balance-scale',
      link: '/project-system/admin/estimators',
    },
    {
      text: 'Giám sát',
      color: 'danger',
      icon: 'user-check',
      link: '/project-system/admin/supervisors',
    },
    {
      text: 'Biểu mẫu',
      color: 'primary',
      icon: 'file-excel',
      link: '/project-system/admin/forms',
    },
  ]
}];

export const plannerMenuList: MenuModel[] = [{
  text: 'Kế hoạch',
  items: [
    {
      text: 'WBS',
      color: 'primary',
      icon: 'sitemap',
      link: '/project-system/planner/elements',
    },
    {
      text: 'Quản lý thay đổi',
      color: 'danger',
      icon: 'file-signature',
      link: '/project-system/planner/commits',
    },
    {
      text: 'Quản lý phiên bản',
      color: 'primary',
      icon: 'code-branch',
      link: '/project-system/planner/versions',
    },
  ]
}];

export const designerMenuList: MenuModel[] = [{
  text: 'Khối lượng',
  items: [
    {
      text: 'Cấu kiện điển hình',
      color: 'primary',
      icon: 'cubes',
      link: '/project-system/designer/clusters',
    },
    {
      text: 'Mapping WBS - Cấu kiện',
      color: 'success',
      icon: 'link',
      link: '/project-system/designer/element-clusters',
    },
    {
      text: 'Công tác',
      color: 'info',
      icon: 'tasks',
      link: '/project-system/designer/items',
    },
    {
      text: 'Quản lý thay đổi',
      color: 'danger',
      icon: 'file-signature',
      link: '/project-system/designer/commits',
    },
    {
      text: 'Quản lý phiên bản',
      color: 'primary',
      icon: 'code-branch',
      link: '/project-system/designer/versions',
    },
  ]
}];

export const estimatorMenuList: MenuModel[] = [{
  text: 'Dự toán',
  items: [
    {
      text: 'Định mức',
      color: 'primary',
      icon: 'divide',
      link: '/project-system/estimator/resources',
    },
    {
      text: 'Tổng hợp RBS',
      color: 'success',
      icon: 'file-excel',
      link: '/project-system/estimator/cbs-report',
    },
    {
      text: 'Quản lý thay đổi',
      color: 'danger',
      icon: 'file-signature',
      link: '/project-system/estimator/commits',
    },
    // {
    //   text: 'Quản lý phiên bản',
    //   color: 'primary',
    //   icon: 'code-branch',
    //   link: '/project-system/estimator/versions',
    // },
  ]
}];

export const supervisorMenuList: MenuModel[] = [{
  text: 'Giám sát',
  items: [
    {
      text: 'Xác nhận hoàn thành',
      color: 'primary',
      icon: 'clipboard-check',
      link: '/project-system/supervisor/confirmations',
    },
    {
      text: 'Quản lý thay đổi',
      color: 'danger',
      icon: 'file-signature',
      link: '/project-system/supervisor/commits',
    },
    // {
    //   text: 'Quản lý phiên bản',
    //   color: 'primary',
    //   icon: 'code-branch',
    //   link: '/project-system/estimator/versions',
    // },
  ]
}];

export const formMenuList: MenuModel[] = [{
  text: 'Biểu mẫu',
  items: [
    {
      text: 'Biểu mẫu BOQ',
      color: 'primary',
      icon: 'file-excel',
      link: '/project-system/form/boq',
    },
    // {
    //   text: 'Quản lý phiên bản',
    //   color: 'primary',
    //   icon: 'code-branch',
    //   link: '/project-system/estimator/versions',
    // },
  ]
}];
