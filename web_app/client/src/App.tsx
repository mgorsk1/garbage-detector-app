import React, { useRef, useState, useEffect } from "react";
import {
  Switch,
  Route,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import { Styles, Container } from "./App.styles";
import { Category, Categories } from "./constants";
import AnalyticsPage from "./pages/AnalyticsPage";
import HomePage from "./pages/HomePage";
import Logo from "./components/Logo";
import WsSignal from "./components/WsSignal";
import _ from "lodash";

const App = () => {
  const ws = useRef<WebSocket>(null);
  const timer = useRef<NodeJS.Timeout>(null);
  const [on, setOn] = useState(false);
  const [category, setCategory] = useState<Category>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:9000/subscribe");
    ws.current.onmessage = (e) => {
      clearTimeout(timer.current as NodeJS.Timeout);
      const data = _.attempt(() => JSON.parse(e.data), {});

      if (_.isEmpty(data)) return;

      const cat = _.get(data, "collections");
      if (cat && Category[Number(cat)]) {
        setOn(true);
        setCategory(Number(cat));

        timer.current = setTimeout(() => {
          setOn(false);
        }, 8000);
      }
    };

    return () => ws.current.close();
  }, []);

  return (
    <Container on={on} color={Categories[category] ? Categories[category].color : 'transparent'}>
      <Styles />
      <Logo />
      <WsSignal status={status} />
      <Router>
        <Switch>
          <Route path="/home">
            <HomePage category={category} on={on}/>
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
