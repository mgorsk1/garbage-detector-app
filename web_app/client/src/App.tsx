import React, { useState } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Styles, Container } from "./App.styles";
import { WsStatus } from "./constants";
import NotifyPage from "./pages/NotifyPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Menu from "./components/Menu";
import Logo from "./components/Logo";
import WsSignal from "./components/WsSignal";

const App = () => {
  const [status, setStatus] = useState(WsStatus.Connecting);
  const ws = new WebSocket("ws://localhost:9000/subscribe");

  ws.onopen = () => {
    setTimeout(() => {
      setStatus(WsStatus.Connected);
    }, 1000);
  };

  ws.onclose = () => setStatus(WsStatus.Closed);
  ws.onerror = () => setStatus(WsStatus.Error);
  ws.onmessage = (e) => console.log(`Received message from api: ${e.data}`);

  return (
    <Container>
      <Styles />
      <Logo />
      <WsSignal status={status} />
      <Router>
        <Menu />
        <Switch>
          <Route path="/detect">
            <NotifyPage />
          </Route>
          <Route path="/analyse">
            <AnalyticsPage />
          </Route>
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
