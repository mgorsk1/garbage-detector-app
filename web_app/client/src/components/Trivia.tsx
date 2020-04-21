import React from "react";
import styled from "styled-components";
import Idea from "../icons/Idea";

const Container = styled.div`
  background: #fffef6;
  padding: 30px;
  color: #cacaa1;
  font-size: 14px;
  color: #222;
  line-height: 1.5;
  margin-top: 50px;
  display: flex;

  h2 {
    font-size: 16px;
    margin: 0;
  }

  p {
    margin: 0;
  }
`;

const Icon = styled.div`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
`;

const Text = styled.div`
  flex: 4;
`;

const Trivia = () => {
  return (
    <Container>
      <Icon>
        <Idea width={40} height={40} />
      </Icon>
      <Text>
        <h2>Did you know?</h2>
        <p>
          Normally, plastic items take up to 1000 years to decompose in
          landfills. But plastic bags we use in our everyday life take 10-20
          years to decompose, while plastic bottles take 450 years.
        </p>
      </Text>
    </Container>
  );
};

export default Trivia;
