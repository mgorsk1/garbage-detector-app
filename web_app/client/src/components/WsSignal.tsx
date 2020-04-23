import React from "react";
import styled from "styled-components";
import { WsStatus } from "../constants";
import { colors } from '../App.styles';

const Container = styled.div`
  position: absolute;
  display block;
  left: 30px;
  bottom: 30px;
  font-family: courier new, monospace;
  display: flex;
  font-size: 9px;
  align-items: center;
  color: #fff;
`;

const Icon = styled.div<{ status: WsStatus }>`
  width: 5px;
  height: 5px;
  border-radius: 100%;
  background: ${(props) => StatusColor[props.status]};
`;

const Text = styled.span`
  margin-left: 8px;
`;

type Props = {
  status: WsStatus;
};

const StatusColor = {
  [WsStatus.Connecting]: colors.yellow,
  [WsStatus.Connected]: colors.green,
  [WsStatus.Error]: colors.red,
  [WsStatus.Closed]: colors.grey,
};

const StatusText = {
  [WsStatus.Connecting]: "connecting to api",
  [WsStatus.Connected]: "connected to api",
  [WsStatus.Error]: "error",
  [WsStatus.Closed]: "closed connection",
};

const WsSignal = ({ status }: Props) => (
  <Container>
    <Icon status={status}></Icon>
    <Text>{StatusText[status]}</Text>
  </Container>
);

export default WsSignal;
