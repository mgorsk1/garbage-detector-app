import React, { useEffect, useState } from "react";
import { Page, colors } from "../App.styles";
import {
  emptyProgressStats,
  emptyStats,
  emptyTimeStats,
} from "../constants/model";
import styled from "styled-components";
import WeekBarChart from "../components/WeekBarChart";
import HomeButton from "../components/HomeButton";
import Home from "../icons/Home";
import SummaryPieChart from "../components/SummaryPieChart";
import ProgressLineChart from "../components/ProgressLineChart";

const Content = styled.div`
  margin-top: -20px;
  position: relative;
  z-index: 1;
`;

const Heading = styled.h1`
  padding-bottom: 20px;
  font-size: 36px;
  font-weight: 300;
  margin: 0;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 14px;
  font-weight: 900;
  margin: 20px;
  color: #222;
  text-align: center;
  position: absolute;
  top: 5px;
  left: 5px;
`;

const Charts = styled.div`
  height: 450px;
  display: grid;
  grid-template:
    [row1-start] "top-left right" 50% [row1-end]
    [row2-start] "bottom-left right" 50% [row2-end]
    / 35% 65%;
  align-items: center;
  gap: 18px;
`;

const ChartContainer = styled.div<{ area: string }>`
  position: relative;
  grid-area: ${(props) => props.area};
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background-color: rgba(255, 255, 255, 0.7);
`;

const ChartInnerContainer = styled.div`
  padding: 30px;
  height: 100%;
`;

interface ChartProps {
  area: string;
  title: string;
  children: React.ReactNode;
}

const Chart = ({ area, title, children }: ChartProps) => {
  return (
    <ChartContainer area={area}>
      <Title>{title}</Title>
      <ChartInnerContainer>{children}</ChartInnerContainer>
    </ChartContainer>
  );
};

const Legend = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  font-size: 14px;
  color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: flex-end;
`;

const Item = styled.li`
  margin: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row-reverse;
`;

const Icon = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background: ${(props) => props.color};
  margin-left: 8px;
`;

const AnalyticsPage = () => {
  const [stats, setStats] = useState(emptyStats);
  const [timeStats, setTimeStats] = useState(emptyTimeStats);
  const [progressStats, setProgressStats] = useState(emptyProgressStats);

  useEffect(() => {
    fetch(`http://${location.hostname}:9000/statistics`)
      .then((res) => res.json())
      .then((stats) => setStats(stats));
    fetch(`http://${location.hostname}:9000/time-statistics`)
      .then((res) => res.json())
      .then((stats) => setTimeStats(stats));
    fetch(`http://${location.hostname}:9000/progress`)
      .then((res) => res.json())
      .then((stats) => setProgressStats(stats));
  }, []);

  return (
    <Page>
      <Content>
        <Heading>Last week</Heading>
        <Legend>
          <Item>
            <Icon color={colors.green} />
            Paper
          </Item>
          <Item>
            <Icon color={colors.water} />
            Plastic
          </Item>
          <Item>
            <Icon color={colors.brown} />
            Glass
          </Item>
          <Item>
            <Icon color={colors.grey} />
            Rest
          </Item>
        </Legend>
        <Charts>
          <Chart area="top-left" title="Summary">
            <SummaryPieChart data={stats} />
          </Chart>
          <Chart area="bottom-left" title="Progress">
            <ProgressLineChart data={progressStats} />
          </Chart>
          <Chart area="right" title="Environment points per day">
            <WeekBarChart data={timeStats} />
          </Chart>
        </Charts>
      </Content>
      <HomeButton to="/" text="Home" icon={<Home />} />
    </Page>
  );
};

export default AnalyticsPage;
