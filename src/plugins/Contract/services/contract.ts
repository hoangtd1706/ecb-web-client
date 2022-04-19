import axios from 'axios';

const apiUrl = '/api/contract/contracts';

export type ContractModel = {
  contractNumber: string;
  projectCode: string;
  projectName: string;
  vendorCode: string;
  vendorName: string;
  createdBy: string;
  createdByFullName: string;
  createdDate: Date;
  status: string;
}

export type ContractDetailModel = ContractModel & {
  contractType: string,
  contractValue: number,
  paymentTerm: string,
  items: ItemModel[],
  requests: RequestModel[],
  attachments: AttachmentModel[],
}

export type ItemModel = {
  code: string,
  text: string,
  isService: boolean,
  quantity: number,
  unit: string,
  per: number,
  price: number,
  planPrice: number,
  netPrice: number,
  subItems: SubItemModel[],
  ebeln: string,
  ebelp: string,
}

export type SubItemModel = {
  code: string,
  text: string,
  quantity: number,
  unit: string,
  per: number,
  price: number,
  planPrice: number,
  netPrice: number,
  packno: string,
  introw: string,
}

export type RequestModel = {
  id: number,
  isReopen: boolean,
  isActive: boolean,
  content: string,
  cancelReason: string,
  createdTime: Date,
  closedTime: Date,
  steps: StepModel[],
}

export type StepModel = {
  userNumber: string,
  fullName: string,
  isFinish: boolean,
  isReceived: boolean,
  receivedTime: Date,
  isSeen: boolean,
  seenTime: Date,
  isApproved: boolean,
  approvedTime: Date,
  isRejected: boolean,
  rejectedTime: Date,
  content: string,
}

export type AttachmentModel = {
  id: number;
  fileName: string;
  isPrivate: boolean;
  createdTime: Date;
}

export type NetPriceItem = {
  ebeln: string;
  ebelp: string;
  packno: string;
  introw: string;
  netpr: number;
  isService: boolean;
}

export type UpdateNetPriceModel = {
  items: NetPriceItem[];
}

export type ContractCounterModel = {
  contractStatus: number;
  total: number;
}

function getMyContractList(status: string): Promise<ContractModel[]> {
  return axios.get(`${apiUrl}/getMyContractList/${status}`);
}

function getContractList(status: string): Promise<ContractModel[]> {
  return axios.get(`${apiUrl}/getContractList/${status}`);
}

function getContract(contractNumber: string): Promise<ContractDetailModel> {
  return axios.get(`${apiUrl}/${contractNumber}`);
}

function updateNetPrice(contractNumber: string, model: UpdateNetPriceModel): Promise<unknown> {
  return axios.put(`${apiUrl}/updateNetPrice/${contractNumber}`, model);
}

function countByCreator(): Promise<ContractCounterModel[]> {
  return axios.get(`${apiUrl}/countByCreator`);
}

function countByApprover(): Promise<ContractCounterModel[]> {
  return axios.get(`${apiUrl}/countByApprover`);
}

const service = {
  getMyContractList,
  getContractList,
  getContract,
  updateNetPrice,
  countByCreator,
  countByApprover,
};

export default service;
