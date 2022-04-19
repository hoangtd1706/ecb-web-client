import React, { createContext } from 'react';
import { CreateItemModel } from '../../services/package';
import reducer from './reducers';
import { CreatePackageStore, initialState, defaultStore } from './types';
import action from './actions';

type CreatePackageProviderProps = {
  children: JSX.Element | JSX.Element[];
}

export const CreatePackageContext = createContext(defaultStore);

export default function CreatePackageProvider({ children }: CreatePackageProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const getInputData = () => {
    action.getInputData(dispatch);
  };

  const changeHeader = (name: string, value: string | Date | boolean) => {
    action.changeHeader(name, value, dispatch);
  }

  const changeVendors = (vendorCode: string, checked: boolean) => {
    action.changeVendors(vendorCode, checked, dispatch);
  }

  const addItem = (item: CreateItemModel) => {
    action.addItem(item, dispatch);
  }

  const editItem = (item: CreateItemModel) => {
    action.editItem(item, dispatch);
  }

  const removeItem = (id: number) => {
    action.removeItem(id, dispatch);
  }

  const changeFiles = (files: File[]) => {
    action.changeFiles(files, dispatch);
  }

  const store: CreatePackageStore = {
    state,
    getInputData,
    changeHeader,
    changeVendors,
    addItem,
    editItem,
    removeItem,
    changeFiles,
  };

  return (
    <CreatePackageContext.Provider value={store}>
      {children}
    </CreatePackageContext.Provider>
  );
}
