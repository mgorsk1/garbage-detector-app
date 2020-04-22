import styled, { createGlobalStyle } from "styled-components";
import { Theme } from '@nivo/core';

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

export const Container = styled.div<{ on: string }>`
  width: 100vw;
  min-height: 100vh;
  transition: background 500ms ease-in-out;

  &:before {
    display: block;
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    background-image: url("https://images.unsplash.com/photo-1566636571155-8c44187a0ccb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2010&q=80");
    background-size: cover;
    transition: all 500ms ease-in-out;
    opacity: ${props => props.on ? 0 : 1 };
    filter: blur(${props => props.on ? '80px' : 0});
  }
`;

export const Page = styled.div`
  max-width: 1280px;
  margin: auto;
  padding: 80px;
  width: 100%;
`;

export const colors = {
  yellow: "#F9DEC9",
  brown: "#cda96f",
  red: "#E9AFA3",
  blue: "#AEC5EB",
  water: "#53C3DA",
  navy: "#0e4275",
  green: "#20a51d",
  grey: "#999",
  pink: "#f4e7d7",
  purple: "#7c5681",
};

export const nivoTheme: Theme = {
  fontSize: 13,
  tooltip: {
    container: {
      background: '#333333',
    },
  },
  sliceTooltip: {
    container: {
      background: '#333333',
      color: 'inherit',
      fontSize: 'inherit',
      borderRadius: '2px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
      padding: '5px 9px'
    },
  },
} as Theme;
