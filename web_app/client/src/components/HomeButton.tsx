import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Nav = styled.div<{invert: boolean}>`
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  color: ${props => props.invert ? '#222' : '#fff'};
`;

const NavItem = styled.div`
  width: 120px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 12px;
  margin: 0 20px;
  transition: all 200ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  span {
    margin-top: 12px;
  }
`;

const Link = styled(NavLink)`
  text-decoration: none;
  color: inherit;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
`;

const HomeButton = ({ to, icon, text, invert }: any) => (
  <Nav invert={invert}>
    <Link to={to}>
      <NavItem>
        {icon}
        <span>{text}</span>
      </NavItem>
    </Link>
  </Nav>
);

export default HomeButton;
