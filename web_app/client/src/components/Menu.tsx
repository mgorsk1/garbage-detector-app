import React from "react";
import styled from 'styled-components';
import Detect from "../icons/Detect";

const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MenuItems = styled.div`
  height: 380px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MenuItem = styled.div`
  padding: 30px 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  span {
    margin-top: 5px;
  }
`;

const Menu = () => (
  <Aside>
    <MenuItems>
      <MenuItem>
        <Detect />
        <span>Detect</span>
      </MenuItem>
      <MenuItem>
        <Detect />
        <span>Analyse</span>
      </MenuItem>
      <MenuItem>
        <Detect />
        <span>Learn</span>
      </MenuItem>
      <MenuItem>
        <Detect />
        <span>How</span>
      </MenuItem>
    </MenuItems>
  </Aside>
);

export default Menu;
