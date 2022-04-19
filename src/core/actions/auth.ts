import { useMsal } from "@azure/msal-react";
import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { AzureAuthentication } from "./../authenService";
import history from "../../configs/history";
import { AppUser } from "../accountService";
import { AppThunk } from "../store";
import {
  Actions,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGOUT,
  VERIFY_REQUEST,
  VERIFY_FAILURE,
  VERIFY_SUCCESS,
  authErrors,
} from "../constants/auth";

const verify =
  (accessToken: string, mail: string, homeAccountId: string): AppThunk =>
  async (dispatch) => {
    function request(): Actions {
      return { type: VERIFY_REQUEST };
    }
    function success(user: AppUser): Actions {
      return {
        type: VERIFY_SUCCESS,
        payload: user,
      };
    }
    function fail(): Actions {
      return { type: VERIFY_FAILURE };
    }

    dispatch(request());
    const data = await AzureAuthentication.Verify(
      accessToken,
      mail,
      homeAccountId
    );
    try {
      dispatch(success(data));
      const returnUrl = localStorage.getItem("returnUrl");
      if (returnUrl === null) {
        history.push("/");
      } else {
        history.push(returnUrl);
      }
    } catch (err) {
      console.log(err);
      dispatch(fail());
    }
  };

const login =
  (intance: IPublicClientApplication): AppThunk =>
  async (dispatch) => {
    function request(): Actions {
      return { type: LOGIN_REQUEST };
    }
    function fail(error: string): Actions {
      return { type: LOGIN_FAILURE, error };
    }

    dispatch(request());
    try {
      const userAzure = await AzureAuthentication.Login(intance);
      console.log("click");
      if (userAzure.account?.username != null) {
        dispatch(
          verify(
            userAzure.accessToken,
            userAzure.account?.username,
            userAzure.account?.homeAccountId
          )
        );
      }
    } catch {
      dispatch(fail(authErrors.LOGIN_FAIL));
    }
  };

function logout(instance: IPublicClientApplication): Actions {
  AzureAuthentication.Logout(instance);
  window.location.reload();
  return { type: LOGOUT };
}

function clear(): Actions {
  return { type: LOGOUT };
}

const actions = {
  login,
  logout,
  verify,
  clear,
};

export default actions;
