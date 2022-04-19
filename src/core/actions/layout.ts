import {
  LayoutActions,
  SET_ACTIVE_PLUGIN_ID,
  SET_CONTENT_LIST,
  SET_PLUGIN_LIST,
  SET_MENU_LIST,
} from '../constants/layout';

import {
  MenuModel,
  ContentModel,
  PluginModel,
} from '../types';

const setMenuList = (list: MenuModel[]): LayoutActions => ({
  type: SET_MENU_LIST,
  payload: {
    list,
  }
});

const setPluginList = (list: PluginModel[]): LayoutActions => ({
  type: SET_PLUGIN_LIST,
  payload: {
    list,
  }
});

const setContentList = (list: ContentModel[]): LayoutActions => ({
  type: SET_CONTENT_LIST,
  payload: {
    list,
  }
})

const setActivePluginId = (pluginId: number): LayoutActions => ({
  type: SET_ACTIVE_PLUGIN_ID,
  payload: {
    pluginId,
  }
})

const actions = {
  setMenuList,
  setPluginList,
  setContentList,
  setActivePluginId,
};

export default actions;
