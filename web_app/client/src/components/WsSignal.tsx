import React from "react";
import styled from "styled-components";
import { green, red, navy, WsStatus } from "../constants";

const Container = styled.div`
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

const Icon = styled.div<{ status: WsStatus }>`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: ${(props) => StatusColor[props.status]};
`;

const Text = styled.span`
  margin-right: 12px;
`;

type Props = {
  status: WsStatus;
};

const StatusColor = {
  [WsStatus.Connecting]: "connecting",
  [WsStatus.Connected]: green,
  [WsStatus.Error]: red,
  [WsStatus.Closed]: navy,
};

const StatusText = {
  [WsStatus.Connecting]: "connecting to api",
  [WsStatus.Connected]: "connected to api",
  [WsStatus.Error]: "error",
  [WsStatus.Closed]: "closed connection",
};

const WsSignal = ({ status }: Props) => (
  <Container>
    <Text>{StatusText[status]}</Text>
    <Icon status={status}></Icon>
  </Container>
);

export default WsSignal;
