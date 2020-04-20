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
import Idea from "./icons/Idea";

const Trivia = styled.div`
  background: #fffef6;
  padding: 30px;
  color: #cacaa1;
  font-size: 14px;
  color: #222;
  line-height: 1.5;
  margin-top: 50px;
  display: flex;

  h2 {
    font-size: 16px;
    margin: 0;
  }

  p {
    margin: 0;
  }
`;

const Side = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const Content = styled.div`
  flex: 4;
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
  const ws = new WebSocket("ws://localhost:9000/subscribe");

  ws.onopen = () => {
    setTimeout(() => {
      setConnect(true);
    }, 1000);
  };

  ws.onclose = () => {
    setConnect(false);
  };

  ws.onmessage = (e) => console.log(`Received message from api: ${e.data}`);

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
              <Side>
                <Idea width={40} height={40} />
              </Side>
              <Content>
                <h2>Did you know?</h2>
                <p>
                  Normally, plastic items take up to 1000 years to decompose in
                  landfills. But plastic bags we use in our everyday life take
                  10-20 years to decompose, while plastic bottles take 450
                  years.
                </p>
              </Content>
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
