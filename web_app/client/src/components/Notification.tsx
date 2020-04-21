import React, { useEffect, useState } from "react";
import { Page } from "../App.styles";
import {
  Content,
  Title,
  Categories,
  Category,
  Picture,
  Points,
  PointsAnimated,
  Section,
  EP,
  Small,
} from "./Notification.styles";
import Trivia from "./Trivia";
import { Category as CategoryEnum, Categories as CategoriesTable } from "../constants";

interface Props {
  category?: CategoryEnum;
  state: any;
}

const Notification = ({ category, state }: Props) => {
  const { name, phrase, points, image, color } = CategoriesTable[category] || CategoriesTable.default;
  return (
    <Page>
      <Content>
        <Section>
          <Categories>
            <Category color={color}>{name}</Category>
          </Categories>
          <Title>{phrase}</Title>
          <Trivia />
          <EP>
            <Points>
              +{points}<Small> EP</Small>
            </Points>
            {/* <PointsAnimated state={state}>{points}</PointsAnimated> */}
          </EP>
        </Section>
        <Picture url={image} />
      </Content>
    </Page>
  );
};

export default Notification;
