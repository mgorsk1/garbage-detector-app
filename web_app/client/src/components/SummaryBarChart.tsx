import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { Statistics } from '../constants/model';
import { colors } from '../App.styles';

interface Props {
  data: Statistics;
}

const getColor = (category: string): string => {
  switch(category) {
    case 'Paper':
      return colors.yellow;
    case 'Glass':
      return colors.blue;
    case 'Plastic':
      return colors.red;
    case 'Non recyclable':
      return colors.green;
  }
  return '';
};


const SummaryBarChart = ({ data }: Props) => {
  const formattedData = [
    {
      category: 'Non recyclable',
      points: data.rest,
    },
    {
      category: 'Plastic',
      points: data.plastic,
    },
    {
      category: 'Glass',
      points: data.glass,
    },
    {
      category: 'Paper',
      points: data.paper,
    },
  ];

  return <ResponsiveBar
    data={formattedData}
    keys={['points']}
    indexBy={'category'}
    margin={{
      top: 36,
      right: 0,
      bottom: 36,
      left: 100
    }}
    axisBottom={null}
    layout={'horizontal'}
    padding={0.5}
    animate={true}
    motionStiffness={90}
    motionDamping={15}
    colors={({ id, data }) => getColor(data.category)}
  />
};

export default SummaryBarChart;
