import React from "react";
import styled from "styled-components";

const Container = styled.div`
  color: #cacaa1;
  font-size: 14px;
  color: #222;
  line-height: 1.5;
  margin: 30px 0;

  h2 {
    font-size: 16px;
    margin: 0;
    margin-bottom: 12px;
  }

  p {
    margin: 0;
  }
`;

const Text = styled.div`
  max-width: calc(100% - 50px);
`;

const Trivia = () => {
  return (
    <Container>
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
