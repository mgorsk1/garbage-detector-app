import React from "react";
import { Page } from "../App.styles";
import { Content, Title, Description, Categories, Category, Confidence, Picture } from './NotifyPage.styles';
import Trivia from "../components/Trivia";

const NotifyPage = () => {
  return (
    <Page>
      <Content>
        <section>
          <Title>You've got trash!</Title>
          <Description>Our A.I. categorises this as:</Description>
          <Categories>
            <Category type={0}>
              Plastic
              <Confidence>99%</Confidence>
            </Category>
            <Category type={1}>
              Metal
              <Confidence>60%</Confidence>
            </Category>
          </Categories>
          <Trivia />
        </section>
        <Picture></Picture>
      </Content>
    </Page>
  );
};

export default NotifyPage;
