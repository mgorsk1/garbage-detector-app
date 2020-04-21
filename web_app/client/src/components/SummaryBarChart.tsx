import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { Statistics } from '../constants/model';
import { blue, green, navy, red, yellow } from '../constants';

interface Props {
  data: Statistics;
}

const getColor = (category: string): string => {
  switch(category) {
    case 'Paper':
      return 'yellow';
    case 'Glass':
      return blue;
    case 'Plastic':
      return red;
    case 'Non recyclable':
      return green;
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
