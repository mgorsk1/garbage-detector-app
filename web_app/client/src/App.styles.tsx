
import styled, { createGlobalStyle } from "styled-components";

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

export const Container = styled.div`
  display: flex;
  justify-content: stretch;
  width: 100vw;
  min-height: 100vh;
`;

export const Page = styled.div`
  padding: 80px;
  width: 100%;
`;
