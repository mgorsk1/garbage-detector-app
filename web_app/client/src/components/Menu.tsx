import React from "react";
import styled from "styled-components";
import Detect from "../icons/Detect";
import { NavLink } from "react-router-dom";

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
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  margin: 0 20px;
  transition: all 200ms ease;

  &:hover {
    background: #f9f9f9;
  }

  span {
    margin-top: 5px;
  }
`;

const Link = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  font-weight: ${props => props.isActive ? 'bold' : 'normal'};

  &.active {
    color: blue;
  }
`

const Menu = () => (
  <Aside>
    <MenuItems>
      <Link to="/detect">
        <MenuItem>
          <Detect />
          <span>Detect</span>
        </MenuItem>
      </Link>
      <Link to="/analyse">
        <MenuItem>
          <Detect />
          <span>Analyse</span>
        </MenuItem>
      </Link>
      <Link to="/learn">
        <MenuItem>
          <Detect />
          <span>Learn</span>
        </MenuItem>
      </Link>
    </MenuItems>
  </Aside>
);

export default Menu;
