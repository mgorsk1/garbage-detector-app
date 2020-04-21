import React from "react";
import styled from 'styled-components';

export const Icon = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 70px;
  background-image: url('./logo.png');
  background-size: contain;
  background-repeat: no-repeat;
`;

const Logo = () => (
  <Icon />
);

export default Logo;
