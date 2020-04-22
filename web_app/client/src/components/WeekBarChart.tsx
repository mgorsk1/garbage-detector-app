import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { TimeStatistics } from '../constants/model';
import { colors, nivoTheme } from '../App.styles';

interface Props {
  data: TimeStatistics;
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


const WeekBarChart = ({ data }: Props) => {
  return <ResponsiveBar
    theme={nivoTheme}
    data={data}
    keys={['paper', 'glass', 'plastic', 'rest']}
    indexBy="day"
    groupMode="stacked"
    margin={{
      top: 20,
      right: 30,
      bottom: 50,
      left: 50
    }}
    innerPadding={3}
    borderRadius={5}
    labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
    axisLeft={null}
    layout="vertical"
    padding={0.5}
    colors={({ id, data }) => getColor(id)}
    animate={false}
  />
};

export default WeekBarChart;
