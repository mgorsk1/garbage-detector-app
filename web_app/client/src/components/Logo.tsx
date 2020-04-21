import React from "react";
import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  font-size: 18px;
  max-width: 270px;
  margin: 40px;

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
  margin-bottom: 10px;
`;

const Logo = () => (
  <Container>
    <LogoIcon />
    <div>
      Trash<br/>
      Co.
    </div>
  </Container>
);

export default Logo;
