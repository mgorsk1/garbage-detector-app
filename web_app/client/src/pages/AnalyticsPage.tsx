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
  margin: 50px 0;
  padding: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 600px;
  z-index: 1;
  border-radius: 12px;
  &&&& {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const LeftPane = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 30%;
`;

const ChartContainer = styled.div`
  height: 50%;
  width: 100%;
`;

const RightPane = styled.div`
  width: 70%;
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
      </Content>
      <HomeButton to="/" text="Home" icon={<Home />} />
    </Page>
  );
};

export default AnalyticsPage;
