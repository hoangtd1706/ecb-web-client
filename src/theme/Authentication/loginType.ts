import styled from "styled-components";

const LayoutStyle = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const Branding = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: 50px;
  justify-content: center;
  align-items: center;
`;

const BlockTypo = styled.div`
  margin: 12px 0 0px 0;
  text-align: center;
`;

const Typo = styled.h5`
  color: #056341;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  font-size: 1.5rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  line-height: 1.334;
  letter-spacing: 0em;
  margin: 0 auto;
`;

const CopyRight = styled.div`
  margin-top: 50px;
  color: rgba(0, 0, 0, 0.54);
  text-align: center;
  font-size: 0.875rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: 0.01071em;
`;

const WrapLogin = styled.div`
  display: flex;
  justify-content: center;
`;

export const MainStyle = {
  LayoutStyle,
  Branding,
  BlockTypo,
  Typo,
  WrapLogin,
  CopyRight,
};
