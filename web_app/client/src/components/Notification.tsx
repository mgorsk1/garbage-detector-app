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
  category?: Category;
  state: any;
}

const Notification = ({ category }: Props) => {
  const { name, points, image, color } =
    Categories[category] || Categories.default;
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
