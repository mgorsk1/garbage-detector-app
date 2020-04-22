import React from 'react';
import { ResponsiveLine, Serie } from '@nivo/line'
import { ProgressStatistics } from '../constants/model';
import { colors, nivoTheme } from '../App.styles';
import styled from 'styled-components';

const Tooltip = styled.div`
  background-color: #333333;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  padding: 5px 9px;
`;

interface Props {
  data: ProgressStatistics;
}

const ProgressLineChart = ({ data }: Props) => {
  const formattedData: Serie[] = [
    {
      id: 'points',
      color: colors.yellow,
      data: data.map(day => ({
        x: day.day,
        y: day.points,
      })),
    }
  ];

  return <ResponsiveLine
    theme={nivoTheme}
    data={formattedData}
    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
    margin={{
      top: 20,
      right: 20,
      bottom: 30,
      left: 30
    }}
    pointColor="white"
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    animate={false}
    enableSlices="x"
    axisBottom={{
      tickSize: 0,
      tickPadding: 10
    }}
    axisLeft={{
      tickSize: 0,
      tickPadding: 10,
      tickValues: 5,
    }}
    sliceTooltip={({ slice: { points } }) => (
      <Tooltip>
        <strong style={{color: points[0].serieColor}}>
          {points[0].data.y} points
        </strong>
      </Tooltip>
    )}></ResponsiveLine>
};

export default ProgressLineChart;
