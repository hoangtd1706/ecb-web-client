import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import SignInButton from "./loginButton";
import Logo from "../assets/icons/logo.png";
import { useEffect } from "react";
import { MainStyle } from "./loginType";
import history from "../configs/history";

export default function Login() {
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    function RequestProfileData() {
      if (isAuthenticated) {
        history.push("/");
      }
    }
    RequestProfileData();
  }, [isAuthenticated]);
  return (
    <div>
      {!isAuthenticated && (
        <MainStyle.LayoutStyle>
          <MainStyle.Branding>
            <img src={Logo} width={300} />
            <MainStyle.BlockTypo>
              <MainStyle.Typo>Management Information System</MainStyle.Typo>
            </MainStyle.BlockTypo>
          </MainStyle.Branding>
          <MainStyle.WrapLogin>
            <SignInButton />
          </MainStyle.WrapLogin>
          <MainStyle.CopyRight>
            <span>Copyright © Ecoba Management Information System 2022</span>
          </MainStyle.CopyRight>
        </MainStyle.LayoutStyle>
      )}
    </div>
  );
}
