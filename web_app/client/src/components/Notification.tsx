import React from "react";
import { Page } from "../App.styles";
import { Categories, Category } from "../constants";
import {
  Content,
  Picture,
  Points,
  Section,
  Small,
  Title,
} from "./Notification.styles";
import Trivia from "./Trivia";

interface Props {
  category?: any;
  state: any;
}

const Notification = ({ category }: Props) => {
  if (!category) return "";
  const { name, points, image, color } = category;
  return (
    <Page>
      <Content>
        <Section>
          <Title color={color}>{name}</Title>
          <Trivia />
          <Points>
            +{points}
            <Small> EP</Small>
          </Points>
        </Section>
        <Picture url={image} />
      </Content>
    </Page>
  );
};

export default Notification;
