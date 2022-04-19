import { ContractDetailModel, UpdateNetPriceModel } from '../../services/contract';
import { CreateRequestModel, ActionRequestModel } from '../../services/request';

export type ContractDetailState = {
  contract: ContractDetailModel,
};

export const initialState: ContractDetailState = {
  contract: {
    contractNumber: '',
    createdBy: '',
    createdByFullName: '',
    createdDate: new Date(),
    projectCode: '',
    projectName: '',
    status: '',
    vendorCode: '',
    vendorName: '',
    contractType: 'D',
    contractValue: 0,
    paymentTerm: '',
    items: [],
    requests: [],
    attachments: [],
  },
};

export type ContractDetailStore = {
  state: ContractDetailState;
  getContractDetail: (contractNumber: string) => void;
  create: (contractNumber: string, model: CreateRequestModel) => void;
  cancel: (contractNumber: string, model: ActionRequestModel) => void;
  check: (contractNumber: string, model: ActionRequestModel) => void;
  reject: (contractNumber: string, model: ActionRequestModel) => void;
  approve: (contractNumber: string, model: ActionRequestModel) => void;
  updateNetPrice: (contractNumber: string, model: UpdateNetPriceModel) => void;
  createAttachment: (contractNumber: string, files: File[], privateFiles: File[]) => void;
  removeAttachment: (contractNumber: string, id: number) => void;
}

export const defaultStore: ContractDetailStore = {
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getContractDetail: (contractNumber: string) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create: (contractNumber: string, model: CreateRequestModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cancel: (contractNumber: string, model: ActionRequestModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check: (contractNumber: string, model: ActionRequestModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reject: (contractNumber: string, model: ActionRequestModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  approve: (contractNumber: string, model: ActionRequestModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateNetPrice: (contractNumber: string, model: UpdateNetPriceModel) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createAttachment: (contractNumber: string, files: File[], privateFiles: File[]) => { return; },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeAttachment: (contractNumber: string, id: number) => { return; },
};
