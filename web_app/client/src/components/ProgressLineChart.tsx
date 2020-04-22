import React from 'react';
import { ResponsiveLine, Serie } from '@nivo/line'
import { ProgressStatistics } from '../constants/model';
import { colors } from '../App.styles';

interface Props {
  data: ProgressStatistics;
}

const getColor = (category: string): string => {
  switch(category) {
    case 'paper':
      return colors.yellow;
    case 'glass':
      return colors.blue;
    case 'plastic':
      return colors.red;
    case 'rest':
      return colors.green;
  }
  return '';
};


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
    data={formattedData}
    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
    margin={{
      top: 50,
      right: 20,
      bottom: 50,
      left: 40
    }}
    pointColor="white"
    pointBorderWidth={2}
    pointBorderColor={{ from: 'serieColor' }}
    pointLabel="y"
    pointLabelYOffset={-12}
  />
};

export default ProgressLineChart;
