import React, { useEffect, useState } from "react";
import { Page } from "../App.styles";
import { emptyStats, emptyTimeStats } from '../constants/model';
import styled from 'styled-components';
import SummaryBarChart from '../components/SummaryBarChart';
import WeekBarChart from '../components/WeekBarChart';

const Content = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  height: calc(100% - 160px)
`;

const LeftPane = styled.div`
  width: 30%;
  height: 50%;
  padding: 20px;
`;

const RightPane = styled.div`
  width: 70%;
  height: 100%;
`;


const AnalyticsPage = () => {
  const [stats, setStats] = useState(emptyStats);
  const [timeStats, setTimeStats] = useState(emptyTimeStats);

  useEffect(() => {
    fetch('http://localhost:9000/statistics').then(res => res.json()).then(stats => setStats(stats));
    fetch('http://localhost:9000/time-statistics').then(res => res.json()).then(stats => setTimeStats(stats));
  }, []);

  return (
    <Page>
      <Content>
        <LeftPane>
          <SummaryBarChart data={stats} />
        </LeftPane>
        <RightPane>
          <WeekBarChart data={timeStats} />
        </RightPane>
      </Content>
    </Page>
  );
};

export default AnalyticsPage;
