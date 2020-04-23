import React, { useRef, useState, useEffect } from "react";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { Styles, Container } from "./App.styles";
import { Category, Categories, WsStatus } from "./constants";
import AnalyticsPage from "./pages/AnalyticsPage";
import HomePage from "./pages/HomePage";
import _ from "lodash";
import WsSignal from "./components/WsSignal";

const App = () => {
  const ws = useRef<WebSocket>(null);
  const timer = useRef<NodeJS.Timeout>(null);
  const [on, setOn] = useState(false);
  const [status, setStatus] = useState(WsStatus.Connecting);
  const [category, setCategory] = useState<Category>(null);

  useEffect(() => {
    const socket = new WebSocket(`ws://${location.hostname}:9000/subscribe`);

    socket.onopen = () => setStatus(WsStatus.Connected);
    socket.onclose = () => setStatus(WsStatus.Closed);
    socket.onerror = () => setStatus(WsStatus.Error);

    socket.onmessage = (e) => {
      clearTimeout(timer.current as NodeJS.Timeout);
      const data = _.attempt(() => JSON.parse(e.data), {});
      if (_.isEmpty(data)) return;
      if (data.category) {
        setOn(true);
        setCategory(Categories[data.category](data.points) || Categories[data.default]());

        timer.current = setTimeout(() => {
          setOn(false);
        }, 5000);
      }
    };

    ws.current = socket;

    return () => socket.close();
  }, []);

  return (
    <Container hide={on}>
      <Styles />
      <WsSignal status={status}/>
      <Router>
        <Switch>
          <Route path="/home">
            <HomePage category={category} showNotification={on} />
          </Route>
          <Route path="/analyse">
            <AnalyticsPage />
          </Route>
          <Redirect from="/" to="/home" />
        </Switch>
      </Router>
    </Container>
  );
};

export default App;
