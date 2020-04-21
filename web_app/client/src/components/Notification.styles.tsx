import styled from "styled-components";
import { colors } from "../App.styles";

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const Section = styled.div`
  margin-right: 20px;
`

export const EP = styled.div`
  position: relative;
  color: ${colors.greenDark};
  height: 80px;
  font-size: 80px;
  font-weight: 300;
`

export const Points = styled.span`
  position: absolute;
  top: 0;
  left: 0;
`

export const Small = styled.span`
  font-size: 18px;
  line-height: 18px;
`
  
export const PointsAnimated = styled.span<{state: any}>`
  // display: none;
  position: absolute;
  top: 0;
  left: 0;
  // transition: all 2000ms ease;
  // transition-delay: 1000ms;
  // opacity: ${props => props.state === 'entering' || props.state === 'entered' ? 0 : 1};
  // transform: translateY(${props => props.state === 'entering' || props.state === 'entered' ? '-100%' : 0});

  &:before {
    content: "+";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-100%);
  }
`

export const Title = styled.h1`
  font-size: 38px;
  margin-top: 30px;
  margin-bottom: 0;
`;

export const Categories = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`;

export const Category = styled.span<{ color: string }>`
  display: block;
  max-width: max-content;
  background: ${(props) => props.color};
  font-size: 24px;
  border-radius: 500px;
  padding: 12px 24px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  color: rgb(255, 255, 255);
  mix-blend-mode: difference;
`;

export const Picture = styled.div<{url: string}>`
  background-image: url(${props => props.url});
  width: 500px;
  height: 500px;
  max-width: calc(50vw - 80px);
  max-height: calc(50vw - 80px);
  flex: 1 0 500px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 100px;
`;
