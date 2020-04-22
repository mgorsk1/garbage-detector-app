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
  padding: 20px 20px 20px 30px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.7);
`;

const Title = styled.h1`
  font-size: 16px;
  text-align: center;
`;

const Charts = styled.div`
  height: 600px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 35%;
`;

const ChartContainer = styled.div`
  height: 50%;
  width: 100%;
`;

const RightPane = styled.div`
  width: 65%;
  height: 100%
`;

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
        <Title>Last week's environmental progress</Title>
        <Charts>
          <LeftPane>
            <ChartContainer>
              <ProgressLineChart data={progressStats}/>
            </ChartContainer>
            <ChartContainer>
              <SummaryPieChart data={stats} />
            </ChartContainer>
          </LeftPane>
          <RightPane>
            <WeekBarChart data={timeStats} />
          </RightPane>
        </Charts>
      </Content>
      <HomeButton to="/" text="Home" icon={<Home />} />
    </Page>
  );
};

export default AnalyticsPage;
