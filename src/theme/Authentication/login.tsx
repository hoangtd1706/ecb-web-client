import React from "react";
import { useIsAuthenticated } from "@azure/msal-react";
import SignInButton from "./loginButton";
import Logo from "../../assets/icons/logo.png";
import { MainStyle } from "./loginType";

export default function Login(): JSX.Element {
  const isAuthenticated = useIsAuthenticated();
  return (
    <div>
      {isAuthenticated ? (
        <div></div>
      ) : (
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
