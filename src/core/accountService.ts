import axios from "axios";

export type AppUser = {
  employeeId: string;
  displayName: string;
  mail: string;
  jobTitle?: string;
  preferredLanguage?: string;
  userPrincipalName?: string;
  token?: string;
  avatar?: string;
};

export type LoginModel = {
  number: string;
  password: string;
  remember: boolean;
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type ChangePasswordModel = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordModel = {
  token: string;
  newPassword: string;
};

function login(model: LoginModel): Promise<unknown> {
  return axios.post("/api/account/login", model);
}

function changePassword(model: ChangePasswordModel): Promise<unknown> {
  return axios.post("api/account/changePassword", model);
}

function verify(): Promise<AppUser> {
  return axios.get("/api/account/me");
}

function logout(): Promise<unknown> {
  return axios.post("/api/account/logout");
}

function createResetPassword(number: string): Promise<unknown> {
  return axios.post(`/api/account/createResetPassword/${number}`);
}

function resetPassword(model: ResetPasswordModel): Promise<unknown> {
  return axios.post("/api/account/resetPassword", model);
}

const service = {
  login,
  changePassword,
  logout,
  verify,
  createResetPassword,
  resetPassword,
};

export default service;
