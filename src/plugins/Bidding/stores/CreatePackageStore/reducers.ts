import {
  Actions,
  CHANGE_HEADER_DATA,
  GET_INPUT_DATA_FAILURE,
  GET_INPUT_DATA_SUCCESS,
  CHANGE_VENDORS_DATA,
  ADD_ITEM,
  EDIT_ITEM,
  REMOVE_ITEM,
  CHANGE_FILES,
} from './constant';
import { CreatePackageState, initialState } from './types';

export default function reducer(state = initialState, action: Actions): CreatePackageState {
  switch (action.type) {
    case GET_INPUT_DATA_SUCCESS:
      return {
        ...state,
        materials: action.payload.materials,
        vendors: action.payload.vendors,
      };

    case GET_INPUT_DATA_FAILURE:
      return {
        ...state,
        materials: [],
        vendors: [],
      };

    case CHANGE_HEADER_DATA:
      return {
        ...state,
        model: { ...state.model, [action.payload.name]: action.payload.value }
      };

    case CHANGE_VENDORS_DATA:
      if (action.payload.checked) {
        const exist = state.model.vendors.find(x => x.code === action.payload.vendorCode);
        if (exist === undefined) {
          const vendor = state.vendors.find(x => x.code === action.payload.vendorCode);
          if (vendor !== undefined) {
            return {
              ...state,
              model: {
                ...state.model,
                vendors: [...state.model.vendors, { code: vendor.code, longTextName: vendor.longTextName }]
              }
            };
          }
          return state;
        }
        else {
          return state;
        }
      }
      else {
        return {
          ...state,
          model: {
            ...state.model,
            vendors: state.model.vendors.filter(x => x.code !== action.payload.vendorCode),
          }
        };
      }

    case ADD_ITEM:
      return {
        ...state,
        model: {
          ...state.model,
          items: [...state.model.items, action.payload.item],
        }
      }

    case EDIT_ITEM:
      return {
        ...state,
        model: {
          ...state.model,
          items: [...state.model.items.filter(x => x.id !== action.payload.item.id), action.payload.item],
        }
      }

    case REMOVE_ITEM:
      return {
        ...state,
        model: {
          ...state.model,
          items: state.model.items.filter(x => x.id !== action.payload.id),
        }
      }

    case CHANGE_FILES:
      return {
        ...state,
        model: {
          ...state.model,
          files: action.payload.files,
        }
      }

    default:
      return state;
  }
}
