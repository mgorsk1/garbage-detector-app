import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { TimeStatistics } from '../constants/model';
import { colors } from '../App.styles';

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
    data={data}
    keys={['paper', 'glass', 'plastic', 'rest']}
    indexBy={'day'}
    groupMode={'stacked'}
    margin={{
      top: 36,
      right: 0,
      bottom: 36,
      left: 100
    }}
    axisLeft={null}
    layout={'vertical'}
    padding={0.5}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    colors={({ id, data }) => getColor(id)}
  />
};

export default WeekBarChart;
