import axios from 'axios';

const apiUrl = '/api/library/posts';

export type PostModel = AddPostModel & {
  id: number;
  createdBy: string;
  createdTime: Date;
  changedBy: string;
  changedTime: Date;
  order: number;
}

export type AddPostModel = {
  title: string;
  content: string;
  parentId: number;
}

function getAll(): Promise<PostModel[]> {
  return axios.get(apiUrl);
}

function getById(postId: number): Promise<PostModel> {
  return axios.get(`${apiUrl}/${postId}`);
}

function create(model: AddPostModel): Promise<number> {
  return axios.post(apiUrl, model);
}

function edit(postId: number, model: PostModel): Promise<unknown> {
  return axios.put(`${apiUrl}/${postId}`, model);
}

function remove (postId: number): Promise < unknown > {
  return axios.delete(`${apiUrl}/${postId}`);
}

function changeOrder(postId: number, changeType: number): Promise<unknown> {
  return axios.put(`${apiUrl}/changeOrder/${postId}/${changeType}`);
}

const service = {
  getAll,
  getById,
  create,
  edit,
  remove,
  changeOrder,
};

export default service;
