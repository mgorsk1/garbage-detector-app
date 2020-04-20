import React from "react";
import styled from "styled-components";

const Svg = styled.svg`
  .a {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5px;
  }
`;

const Idea = (props: any) => (
  <Svg
    width={32}
    height={32}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    {...props}
  >
    <line className="a" x1="12" y1="2.251" x2="12" y2="0.751" />
    <line className="a" x1="18.364" y1="4.888" x2="19.425" y2="3.827" />
    <line className="a" x1="21" y1="11.251" x2="22.5" y2="11.251" />
    <line className="a" x1="18.364" y1="17.615" x2="19.425" y2="18.676" />
    <line className="a" x1="5.636" y1="4.888" x2="4.575" y2="3.827" />
    <line className="a" x1="3" y1="11.251" x2="1.5" y2="11.251" />
    <line className="a" x1="5.636" y1="17.615" x2="4.575" y2="18.676" />
    <path className="a" d="M9,16.449v2.3a3,3,0,0,0,6,0v-2.3" />
    <circle className="a" cx="12" cy="11.251" r="6" />
    <line className="a" x1="12" y1="21.751" x2="12" y2="23.251" />
  </Svg>
);

export default Idea;
