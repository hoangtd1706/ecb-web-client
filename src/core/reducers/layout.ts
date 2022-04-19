import {
  LayoutActions,
  SET_ACTIVE_PLUGIN_ID,
  SET_CONTENT_LIST,
  SET_PLUGIN_LIST,
  SET_MENU_LIST,
} from '../constants/layout';

import { LayoutState } from '../types';

export const initialState: LayoutState = {
  activePluginId: 0,
  menuList: [],
  pluginList: [],
  contentList: [],
}

export default function reducer(state = initialState, action: LayoutActions): LayoutState {
  switch (action.type) {
    case SET_MENU_LIST:
      return {
        ...state,
        menuList: action.payload.list,
      };

    case SET_PLUGIN_LIST:
      return {
        ...state,
        pluginList: action.payload.list.sort((x, y) => {
          if (x.id > y.id) {
            return 1;
          }
          return -1;
        }),
      }

    case SET_CONTENT_LIST:
      return {
        ...state,
        contentList: action.payload.list.sort((x, y) => {
          if (x.routeOrder > y.routeOrder) {
            return 1;
          }
          return -1;
        }),
      }

    case SET_ACTIVE_PLUGIN_ID:
      return {
        ...state,
        activePluginId: action.payload.pluginId,
      }

    default:
      return state;
  }
}
