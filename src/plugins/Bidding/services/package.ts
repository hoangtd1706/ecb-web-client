import axios from 'axios';

const apiUrl = '/api/bidding/packages';

export type CreateItemModel = {
  id: number;
  no: string;
  quantity: string;
  optionQuantity: string;
  spec: string;
  note: string;
  begin: Date;
  end: Date;
  materialCode: string;
  materialDescription: string;
  unit: string;
  optionUnit: string;
}

export type CreatePackageVendorModel = {
  code: string;
  longTextName: string;
}

export type CreatePackageModel = {
  code: string;
  name: string;
  begin: Date;
  end: Date;
  description: string;
  isInternal: boolean;
  vendors: CreatePackageVendorModel[];
  files: File[];
  items: CreateItemModel[];
}

export type PackageModel = {
  code: string;
  name: string;
  begin: Date;
  end: Date;
  status: number;
  description: string;
  isInternal: boolean;
  items: ItemModel[];
  vendors: VendorModel[];
  attachments: AttachmentModel[];
}

export type ItemModel = {
  id: number;
  no: number;
  code: string;
  description: string;
  unit: string;
  optionUnit: string;
  quantity: number;
  optionQuantity: number;
  spec: string;
  note: string;
  begin: Date;
  end: Date;
}

export type VendorModel = {
  code: string;
  shortTextName: string;
  longTextName: string;
  submitted: boolean;
}

export type AttachmentModel = {
  id: number;
  fileName: string;
}

export type QuotationModel = {
  submitted: boolean,
  items: QuotationItemModel[],
  attachments: QuotationAttachmentModel[],
}

export type QuotationItemModel = {
  itemId: number;
  price: number;
}

export type QuotationAttachmentModel = {
  id: number;
  fileName: string;
}

function getAll(statusName: string): Promise<PackageModel[]> {
  return axios.get(`${apiUrl}/getPackages/${statusName}`);
}

function getAuditorPackages(statusName: string): Promise<PackageModel[]> {
  return axios.get(`${apiUrl}/getAuditorPackages/${statusName}`);
}

function get(packageCode: string): Promise<PackageModel> {
  return axios.get(`${apiUrl}/${packageCode}`);
}

function createPackage(model: CreatePackageModel): Promise<string> {
  const formData = new FormData();
  formData.append('Code', model.code);
  formData.append('Name', model.name);
  formData.append('Begin', model.begin.toUTCString());
  formData.append('End', model.end.toUTCString());
  formData.append('Description', model.description);
  formData.append('IsInternal', model.isInternal ? 'true' : 'false');
  model.vendors.map((v, index) => {
    formData.append(`Vendors[${index}]`, v.code);
    return true;
  });
  model.files.map((f) => {
    formData.append('Files', f, f.name);
    return true;
  });
  model.items.map((item, index) => {
    formData.append(`Items[${index}][No]`, item.no);
    formData.append(`Items[${index}][Quantity]`, item.quantity);
    formData.append(`Items[${index}][OptionQuantity]`, item.optionQuantity);
    formData.append(`Items[${index}][Spec]`, item.spec);
    formData.append(`Items[${index}][Note]`, item.note);
    formData.append(`Items[${index}][Begin]`, item.begin.toUTCString());
    formData.append(`Items[${index}][End]`, item.end.toUTCString());
    formData.append(`Items[${index}][MaterialCode]`, item.materialCode);
    return true;
  });

  return axios.post(
    apiUrl,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

function getQuotation(packageCode: string, vendorCode: string): Promise<QuotationModel> {
  return axios.get(`${apiUrl}/getQuotation/${packageCode}/${vendorCode}`);
}

const service = {
  getAll,
  getAuditorPackages,
  get,
  createPackage,
  getQuotation,
};

export default service;
