import axios from 'axios';

const apiUrl = '/api/bidding/vendors';

export type VendorModel = {
  code: string;
  longTextName: string;
}

export type VendorDetailModel = {
  code: string;
  longTextName: string;
  shortTextName: string;
  isActive: boolean;
  addresses: AddressModel[];
}

export type AddressModel = {
  addressType: number;
  data: string;
}

function getVendors(): Promise<VendorModel[]> {
  return axios.get(`${apiUrl}/getVendors`);
}

function getRegisterList(): Promise<VendorModel[]> {
  return axios.get(`${apiUrl}/getRegisterList`);
}

function getDetail(code: string): Promise<VendorDetailModel> {
  return axios.get(`${apiUrl}/getDetail/${code}`);
}

function approve(code: string): Promise<unknown> {
  return axios.post(`${apiUrl}/approve/${code}`)
}

function reject(code: string): Promise<unknown> {
  return axios.post(`${apiUrl}/reject/${code}`)
}

const service = {
  getVendors,
  getRegisterList,
  getDetail,
  approve,
  reject,
};

export default service;
