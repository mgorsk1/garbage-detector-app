import React from "react";
import Menu from "./components/Menu";
import { Container, Styles, Logo, LogoIcon, Wrapper, Notification, Picture, Info, Category, CategoryName, Percentage } from "./Styles";

const App = () => {
  const ws = new WebSocket("ws://localhost:8080/subscribe");

  ws.onopen = () => {
    ws.send("asdfsdflkj");
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
          </Info>
        </section>
      </Wrapper>
    </Container>
  );
};

export default App;
