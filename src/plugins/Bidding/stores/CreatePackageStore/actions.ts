import { Dispatch } from 'react';

import {
  alertActions,
  loadingActions,
  alertMessage,
  store,
} from '../../../../core';

import materialService, { MaterialModel } from '../../services/material';
import vendorService, { VendorModel } from '../../services/vendor';
import { CreateItemModel } from '../../services/package';

import {
  Actions,
  GET_INPUT_DATA_FAILURE,
  GET_INPUT_DATA_SUCCESS,
  CHANGE_HEADER_DATA,
  CHANGE_VENDORS_DATA,
  ADD_ITEM,
  EDIT_ITEM,
  REMOVE_ITEM,
  CHANGE_FILES,
} from './constant';

const getInputData = async (
  dispatch: Dispatch<Actions>
): Promise<void> => {
  function success(
    materials: MaterialModel[],
    vendors: VendorModel[],
  ): Actions {
    return {
      type: GET_INPUT_DATA_SUCCESS,
      payload: {
        materials: materials,
        vendors: vendors,
      }
    };
  }
  function fail(): Actions { return { type: GET_INPUT_DATA_FAILURE }; }

  store.dispatch(loadingActions.show());
  try {
    const data = await Promise.all([materialService.getAll(), vendorService.getVendors()]);
    dispatch(success(data[0], data[1]));
  }
  catch {
    dispatch(fail());
    store.dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
  }
  finally {
    store.dispatch(loadingActions.hide());
  }
};

const changeHeader = (
  name: string,
  value: string | Date | boolean,
  dispatch: Dispatch<Actions>,
): void => {
  function action(): Actions { return { type: CHANGE_HEADER_DATA, payload: { name: name, value: value } } }
  dispatch(action());
}

const changeVendors = (
  vendorCode: string,
  checked: boolean,
  dispatch: Dispatch<Actions>,
): void => {
  function action(): Actions { return { type: CHANGE_VENDORS_DATA, payload: { vendorCode: vendorCode, checked: checked } } }
  dispatch(action());
}

const addItem = (
  item: CreateItemModel,
  dispatch: Dispatch<Actions>,
): void => {
  function action(): Actions { return { type: ADD_ITEM, payload: { item: item } } }
  dispatch(action());
}

const editItem = (
  item: CreateItemModel,
  dispatch: Dispatch<Actions>,
): void => {
  function action(): Actions { return { type: EDIT_ITEM, payload: { item: item } } }
  dispatch(action());
}

const removeItem = (
  id: number,
  dispatch: Dispatch<Actions>,
): void => {
  function action(): Actions { return { type: REMOVE_ITEM, payload: { id: id } } }
  dispatch(action());
}

const changeFiles = (
  files: File[],
  dispatch: Dispatch<Actions>,
): void => {
  function action(): Actions { return { type: CHANGE_FILES, payload: { files: files } } }
  dispatch(action());
}

const actions = {
  getInputData,
  changeHeader,
  changeVendors,
  addItem,
  editItem,
  removeItem,
  changeFiles,
};

export default actions;
