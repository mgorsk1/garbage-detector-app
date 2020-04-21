import styled from "styled-components";
import { CATEGORIES } from "../constants";

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  width: 100%;

  > * {
    width: 50% !important;
  }
`;

export const Title = styled.h1`
  font-size: 60px;
`;

export const Description = styled.h2`
  font-size: 20px;
`;

export const Categories = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`;

export const Category = styled.span<{ type: number }>`
  display: block;
  max-width: max-content;
  background: ${(props) => CATEGORIES[props.type].color};
  font-size: 30px;
  border-radius: 500px;
  padding: 14px 30px;
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

export const Confidence = styled.span`
  color: rgba(0, 0, 0, 0.1);
  margin-left: 22px;
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
