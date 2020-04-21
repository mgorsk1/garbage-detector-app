import React from "react";
import styled from "styled-components";
import { WsStatus } from "../constants";
import { colors } from '../App.styles';

const Container = styled.div`
  position: absolute;
  display block;
  left: 50px;
  bottom: 50px;
  font-family: Source Code Pro, monospace;
  display: flex;
  font-size: 12px;
  align-items: center;
`;

const Icon = styled.div<{ status: WsStatus }>`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: ${(props) => StatusColor[props.status]};
`;

const Text = styled.span`
  margin-left: 12px;
`;

type Props = {
  status: WsStatus;
};

const StatusColor = {
  [WsStatus.Connecting]: colors.yellow,
  [WsStatus.Connected]: colors.green,
  [WsStatus.Error]: colors.red,
  [WsStatus.Closed]: colors.red,
};

const StatusText = {
  [WsStatus.Connecting]: "connecting",
  [WsStatus.Connected]: "connected",
  [WsStatus.Error]: "error",
  [WsStatus.Closed]: "closed",
};

const WsSignal = ({ status }: Props) => (
  <Container>
    <Icon status={status}></Icon>
    <Text>{StatusText[status]}</Text>
  </Container>
);

export default WsSignal;
