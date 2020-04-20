import React, { useState } from "react";
import { green, red } from "./constants";
import Menu from "./components/Menu";
import {
  Container,
  Styles,
  Logo,
  LogoIcon,
  Wrapper,
  Notification,
  Picture,
  Info,
  Category,
  CategoryName,
  Percentage,
} from "./Styles";
import styled from "styled-components";

const Trivia = styled.div`
  background: yellow;
  padding: 20px;
`;

const WsSignal = styled.div`
  position: absolute;
  display block;
  right: 30px;
  top: 30px;
  font-family: Source Code Pro, monospace;
  display: flex;
  font-size: 12px;
  line-height: 12px;
  align-items: center;
`;

const WsIcon = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: ${(props) => (props.connect ? green : red)};
`;

const WsText = styled.span`
  margin-right: 12px;
`;

const App = () => {
  const [connect, setConnect] = useState(false);
  const ws = new WebSocket("ws://localhost:8080/subscribe");

  ws.onopen = () => {
    setTimeout(() => {
      setConnect(true);
    }, 1000);
  };

  ws.onclose = () => {
    setConnect(false);
  };

  ws.onmessage = (e) => console.log(e);

  return (
    <Container>
      <Styles />
      <Menu />
      <Logo>
        <LogoIcon />
        <div>
          <div>Bin</div>
          <div>Telligence</div>
        </div>
      </Logo>
      <Wrapper>
        <Picture></Picture>
        <section>
          <Notification>You've got trash!</Notification>
          <Info>
            Our A.I. categorises this as:
            <Category>
              <CategoryName type={0}>
                Plastic
                <Percentage>99%</Percentage>
              </CategoryName>
              <CategoryName type={1}>
                Metal
                <Percentage>60%</Percentage>
              </CategoryName>
            </Category>
            <Trivia>
              Did you know your plastic trash will get a new life by being
              recycled into many products such as shampoo bottles, traffic cones
              and trash bags?
            </Trivia>
          </Info>
        </section>
      </Wrapper>
      <WsSignal>
        <WsText>{connect ? "connected" : "connecting"}</WsText>
        <WsIcon connect={connect}></WsIcon>
      </WsSignal>
    </Container>
  );
};

export default App;
