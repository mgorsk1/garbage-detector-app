import React, { useEffect, useState } from "react";
import { Page } from "../App.styles";
import { emptyProgressStats, emptyStats, emptyTimeStats } from "../constants/model";
import styled from "styled-components";
import WeekBarChart from "../components/WeekBarChart";
import HomeButton from "../components/HomeButton";
import Home from "../icons/Home";
import SummaryPieChart from '../components/SummaryPieChart';
import ProgressLineChart from '../components/ProgressLineChart';

const Content = styled.div`
  position: relative;
  margin: 50px 0;
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 16px;
  height: 46px;
  text-align: center;
`;

const Charts = styled.div`
  height: 480px;
  display: grid;
  grid-template:
    [row1-start] "top-left right" 50% [row1-end]
    [row2-start] "bottom-left right" 50% [row2-end]
    / 35% 65%;
  align-items: center;
  gap: 10px;
`;

const ChartContainer = styled.div<{area: string}>`
  position: relative;
  grid-area: ${props => props.area};
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.7);
`;

const ChartInnerContainer = styled.div`
  position: absolute;
  top: 46px;
  left: 20px;
  right: 20px;
  bottom: 20px;
`;

interface ChartProps {
  area: string;
  title: string;
  children: React.ReactNode;
}

const Chart = ({area, title, children }: ChartProps) => {
  return (
    <ChartContainer area={area}>
      <Title>{title}</Title>
      <ChartInnerContainer>
        {children}
      </ChartInnerContainer>
    </ChartContainer>
  );
}

const AnalyticsPage = () => {
  const [stats, setStats] = useState(emptyStats);
  const [timeStats, setTimeStats] = useState(emptyTimeStats);
  const [progressStats, setProgressStats] = useState(emptyProgressStats);

  useEffect(() => {
    fetch("http://localhost:9000/statistics")
      .then((res) => res.json())
      .then((stats) => setStats(stats));
    fetch("http://localhost:9000/time-statistics")
      .then((res) => res.json())
      .then((stats) => setTimeStats(stats));
    fetch("http://localhost:9000/progress")
      .then((res) => res.json())
      .then((stats) => setProgressStats(stats));
  }, []);

  return (
    <Page>
      <Content>
        <Charts>
            <Chart area="top-left" title="Last week summary">
              <SummaryPieChart data={stats} />
            </Chart>
            <Chart area="bottom-left" title="Progress last week">
              <ProgressLineChart data={progressStats}/>
            </Chart>
            <Chart area="right" title="Environment points collected last week">
              <WeekBarChart data={timeStats} />
            </Chart>
        </Charts>
      </Content>
      <HomeButton to="/" text="Home" icon={<Home />} />
    </Page>
  );
};

export default AnalyticsPage;
