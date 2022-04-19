import { MaterialModel } from '../../services/material';
import { VendorModel } from '../../services/vendor';
import { CreateItemModel } from '../../services/package';

export const GET_INPUT_DATA_SUCCESS = 'GET_INPUT_DATA_SUCCESS';
export const GET_INPUT_DATA_FAILURE = 'GET_INPUT_DATA_FAILURE';

export const CHANGE_HEADER_DATA = 'CHANGE_HEADER_DATA';
export const CHANGE_VENDORS_DATA = 'CHANGE_VENDORS_DATA';

export const ADD_ITEM = 'ADD_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';

export const CHANGE_FILES = 'CHANGE_FILES';

interface GetInputDataSuccessAction {
  type: typeof GET_INPUT_DATA_SUCCESS,
  payload: {
    materials: MaterialModel[],
    vendors: VendorModel[],
  }
}

interface GetInputDataFailureAction {
  type: typeof GET_INPUT_DATA_FAILURE,
}

interface ChangeHeaderData {
  type: typeof CHANGE_HEADER_DATA,
  payload: {
    name: string,
    value: string | Date | boolean,
  },
}

interface ChangeVendorsData {
  type: typeof CHANGE_VENDORS_DATA,
  payload: {
    vendorCode: string,
    checked: boolean,
  }
}

interface AddItem {
  type: typeof ADD_ITEM,
  payload: {
    item: CreateItemModel,
  },
}

interface EditItem {
  type: typeof EDIT_ITEM,
  payload: {
    item: CreateItemModel,
  },
}

interface RemoveItem {
  type: typeof REMOVE_ITEM,
  payload: {
    id: number,
  },
}

interface ChangeFiles {
  type: typeof CHANGE_FILES,
  payload: {
    files: File[],
  },
}

export type Actions =
  GetInputDataSuccessAction |
  GetInputDataFailureAction |
  ChangeHeaderData |
  ChangeVendorsData |
  AddItem |
  EditItem |
  RemoveItem |
  ChangeFiles;
