import React from "react";
import { useMsal } from "@azure/msal-react";

import MicrosoftLogo from "../assets/icons/microsoft_logo.png";
import EcobaLogo from "../assets/icons/ecoba_logo.png";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { AppDispatch, authActions } from "../core";

const ButtonLogin = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  outline: transparent;
  position: relative;
  font-family: "Segoe UI", "Segoe UI Web (West European)", "Segoe UI",
    -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  font-size: 14px;
  font-weight: 600;
  box-sizing: border-box;
  border: 1px solid rgb(138, 136, 134);
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  padding: 0px 16px;
  border-radius: 2px;
  min-width: 80px;
  height: 32px;
  background-color: rgb(255, 255, 255);
  color: rgb(50, 49, 48);
  user-select: none;
  &:hover {
    background-color: rgb(243, 242, 241);
    color: rgb(32, 31, 30);
  }
`;

const ButtonIcon = styled.img`
  height: 20px;
  padding: 0 3px;
`;

const ButtonTypo = styled.span`
  padding: 0 4px;
`;

const SignInButton = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { instance } = useMsal();
  return (
    <ButtonLogin
      onClick={() => {
        dispatch(authActions.login(instance));
      }}
    >
      <ButtonIcon src={MicrosoftLogo} alt="" />
      <ButtonTypo>+</ButtonTypo>
      <ButtonIcon src={EcobaLogo} alt="" />
      <ButtonTypo>Sign in with Microsoft</ButtonTypo>
    </ButtonLogin>
  );
};

export default SignInButton;
