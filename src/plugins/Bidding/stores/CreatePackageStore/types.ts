import { CreatePackageModel, CreateItemModel } from '../../services/package';
import { MaterialModel } from '../../services/material';
import { VendorModel } from '../../services/vendor';

export type CreatePackageState = {
  model: CreatePackageModel,
  materials: MaterialModel[],
  vendors: VendorModel[],
};

export const initialState: CreatePackageState = {
  model: {
    begin: new Date(),
    code: '',
    description: '',
    isInternal: false,
    end: new Date(),
    files: [],
    items: [],
    name: '',
    vendors: [],
  },
  materials: [],
  vendors: [],
};

export type CreatePackageStore = {
  state: CreatePackageState;
  getInputData: () => void;
  changeHeader: (name: string, value: string | Date | boolean) => void;
  changeVendors: (vendorCode: string, checked: boolean) => void;
  addItem: (item: CreateItemModel) => void;
  editItem: (item: CreateItemModel) => void;
  removeItem: (id: number) => void;
  changeFiles: (files: File[]) => void;
}

export const defaultStore: CreatePackageStore = {
  state: initialState,
  getInputData: () => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeHeader: (name: string, value: string | Date | boolean) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeVendors: (vendorCode: string, checked: boolean) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addItem: (item: CreateItemModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  editItem: (item: CreateItemModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem: (id: number) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  changeFiles: (files: File[]) => { return; },
};
