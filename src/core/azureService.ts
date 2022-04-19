import axios from "axios";

const baseURL = "https://graph.microsoft.com";

export const API_AZURE_USER = "/v1.0/me";
export const API_AZURE_USER_FULL_PROFILE =
  "/v1.0/me?&$select=displayName,givenName,jobTitle,mail,mobilePhone,officeLocation,preferredLanguage,surname,userPrincipalName,id,employeeID";
export const API_AZURE_USERS = "/v1.0/users";
export const API_AZURE_USERS_FILTER_DISPLAY_NAME = (displayName: string) =>
  `/v1.0/users?$filter=startswith(displayName,'${displayName}')&$orderby=displayName&$count=true&$top=10&$select=displayName,userPrincipalName,id,employeeID,jobTitle&ConsistencyLevel=eventual`;
export const API_AZURE_PHOTO = "/v1.0/me/photo/$value";

export const azureClient = axios.create({
  baseURL: baseURL,
});

export type IUser = {
  displayName: string;
  givenName?: string;
  jobTitle?: string;
  mail: string;
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  surname?: string;
  userPrincipalName: string;
  id: string;
  employeeId: number;
};

export type IUserPhoto = {
  data: string;
};

async function callMsGraph(accessToken: string): Promise<IUser> {
  return await azureClient
    .get(API_AZURE_USER_FULL_PROFILE, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

async function getUserByDisplayName(displayName: string, accessToken: string) {
  return await azureClient
    .get(API_AZURE_USERS_FILTER_DISPLAY_NAME(displayName), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

export const UserAzureService = {
  callMsGraph,
  getUserByDisplayName,
};
