
import styled, { createGlobalStyle } from "styled-components";
import { CATEGORIES } from "./constants";

export const Styles = createGlobalStyle`
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  html {
    font-family: 'Open Sans', sans-serif;
    background: #fff;
    color: #222;
  }

  body {
    margin: 0;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  padding: 50px;
  width: 100%;

  > * {
    width: 50% !important;
  }
`;

export const Picture = styled.div`
  background: url("https://images.unsplash.com/photo-1557245444-1395260c9612?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
  max-width: 600px;
  width: 100%;
  height: 500px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 100px;
  margin: 100px;
  box-shadow: 0 0 100px 0 rgba(0, 0, 0, 0.2), 0 0 20px 0 rgba(0, 0, 0, 0.2);
`;

export const Info = styled.div`
  font-size: 20px;
`;

export const Category = styled.h1`
  display: flex;
`;

export const CategoryName = styled.span`
  display: inline-block;
  max-width: max-content;
  background: ${(props) => CATEGORIES[props.type].color};
  font-size: 30px;
  border-radius: 500px;
  padding: 14px 30px;
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

export const Logo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  font-size: 18px;
  max-width: 270px;
  margin: 30px;

  span {
    font-size: 28px;
  }
`;

export const LogoIcon = styled.div`
  background: url("./logo.png");
  width: 50px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 16px;
  background: #222;
  margin-right: 12px;
`;

export const Notification = styled.h1`
  font-size: 60px;
`;

export const Percentage = styled.span`
  color: rgba(0, 0, 0, 0.1);
  margin-left: 22px;
`;

export const Container = styled.div`
  display: flex;
  justify-content: stretch;
  width: 100vw;
  min-height: 100vh;
`;
