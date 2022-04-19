import { AppUser } from "./accountService";
import {
  AuthenticationResult,
  IPublicClientApplication,
} from "@azure/msal-browser";
import axios from "axios";
import { loginRequest } from "../configs/auzre";
const baseUrl = process.env.EBC_API_URI
  ? process.env.EBC_API_URI
  : "localhost:5001";
const API_CLIENT_AUTHENTICATION = "o/azure";
export const API_PRODUCT = "p/product";

const axiosClient = axios.create({
  baseURL: `${baseUrl}/api/v1`,
});

async function Login(
  instance: IPublicClientApplication
): Promise<AuthenticationResult> {
  return await instance.loginPopup(loginRequest);
}

const Verify = async (
  accessToken: string,
  mail: string,
  homeAccountId: string
): Promise<AppUser> => {
  if (
    CheckToken(`${homeAccountId}-emis.ecobavietnam.com.vn-accesstoken`)
      .length == 0
  ) {
    return axiosClient
      .post(`${API_CLIENT_AUTHENTICATION}/login`, {
        AccessToken: accessToken,
        Email: mail,
      })
      .then((res) => {
        sessionStorage.setItem(
          `${homeAccountId}-emis.ecobavietnam.com.vn-accesstoken-${res.data.responseId}`,
          res.data.token
        );
        const user: AppUser = {
          displayName: res.data.displayName,
          employeeId: res.data.employeeId,
          mail: res.data.mail,
          jobTitle: res.data.jobTitle,
          preferredLanguage: res.data.preferredLanguage,
          userPrincipalName: res.data.userPrincipalName,
        };
        sessionStorage.setItem(
          `${homeAccountId}-emis.ecobavietnam.com.vn-userprofile-${res.data.responseId}`,
          JSON.stringify(user)
        );
        return res.data;
      })
      .catch((err) => console.log(err));
  } else {
    return GetUserProfile(
      `${homeAccountId}-emis.ecobavietnam.com.vn-userprofile`
    );
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function Logout(instance: IPublicClientApplication) {
  const allAccount = instance.getAllAccounts();
  FilteredLS(allAccount[0].homeAccountId);
}

function CheckToken(term: string) {
  return Object.keys(sessionStorage).filter((key) => {
    return key.indexOf(term) >= 0;
  });
}

function GetUserProfile(term: string) {
  let user: AppUser = {
    displayName: "",
    employeeId: "",
    mail: "",
    jobTitle: "",
    preferredLanguage: "",
    userPrincipalName: "",
  };
  Object.keys(sessionStorage)
    .filter((key) => {
      return key.indexOf(term) >= 0;
    })
    .map((key) => {
      user = JSON.parse(sessionStorage.getItem(key) || "{}") as AppUser;
    });
  return user;
}

function FilteredLS(term: string) {
  Object.keys(sessionStorage)
    .filter((key) => {
      return key.indexOf(term) >= 0;
    })
    .map((key) => {
      sessionStorage.removeItem(key);
    });
  return true;
}
export const AzureAuthentication = {
  Login,
  Verify,
  Logout,
};
