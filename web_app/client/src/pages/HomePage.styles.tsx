import styled from "styled-components";

export const Clock = styled.div<{ hidden: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: 300;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: #fff;
  pointer-events: none;
  transition: all 500ms ease-in-out;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  filter: blur(${(props) => (props.hidden ? "5px" : 0)});
`;

export const Time = styled.span`
  display: flex;
  font-size: 150px;
  text-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  line-height: 0.65;
`;

export const Meridiem = styled.span`
  font-size: 70px;
  margin-left: 20px;
  text-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
  `
  
  export const Day = styled.span`
  font-size: 30px;
  margin-top: 50px;
  text-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
`;

export const Modal = styled.div<{ state: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  transition: all 500ms ease-in-out;
  transform: translateY(
    ${(props) =>
      props.state === "entering" || props.state === "entered" ? 0 : "20px"}
  );
  opacity: ${(props) =>
    props.state === "entering" || props.state === "entered" ? 1 : 0};
`;
