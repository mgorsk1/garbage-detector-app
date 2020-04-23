import styled from "styled-components";

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const Section = styled.div`
  margin-right: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;

`;

export const Points = styled.div`
  font-size: 36px;
  font-weight: 300;
`;

export const Small = styled.span`
  font-size: 18px;
  line-height: 18px;
`;

export const Title = styled.h1`
  font-size: 60px;
  font-weight: 300;
  color: #222;
  text-transform: capitalize;
  margin: 0;
`;

export const Categories = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`;

export const Category = styled.span<{ color: string }>`
  display: block;
  max-width: max-content;
  background: ${(props) => props.color};
  font-size: 24px;
  border-radius: 500px;
  padding: 12px 24px;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  color: rgb(255, 255, 255);
  mix-blend-mode: difference;
`;

export const Picture = styled.div<{ url: string }>`
  background-image: url(${(props) => props.url});
  width: 500px;
  height: 500px;
  max-width: calc(50vw - 80px);
  max-height: calc(50vw - 80px);
  flex: 1 0 500px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 100px;
`;
