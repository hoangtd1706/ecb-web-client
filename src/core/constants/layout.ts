import {
  MenuModel,
  PluginModel,
  ContentModel,
} from '../types';

export const SET_MENU_LIST = 'SET_MENU_LIST';
export const SET_PLUGIN_LIST = 'SET_PLUGIN_LIST';
export const SET_CONTENT_LIST = 'SET_CONTENT_LIST';
export const SET_ACTIVE_PLUGIN_ID = 'SET_ACTIVE_PLUGIN_ID';

type SetMenuListAction = {
  type: typeof SET_MENU_LIST,
  payload: {
    list: MenuModel[],
  },
}

type SetPluginListAction = {
  type: typeof SET_PLUGIN_LIST,
  payload: {
    list: PluginModel[],
  },
}

type SetContentListAction = {
  type: typeof SET_CONTENT_LIST,
  payload: {
    list: ContentModel[],
  },
}

type SetActivePluginIdAction = {
  type: typeof SET_ACTIVE_PLUGIN_ID,
  payload: {
    pluginId: number,
  },
}

export type LayoutActions = SetMenuListAction
  | SetPluginListAction
  | SetContentListAction
  | SetActivePluginIdAction;

