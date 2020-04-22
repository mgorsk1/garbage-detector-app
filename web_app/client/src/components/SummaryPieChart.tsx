import React from 'react';
import { ResponsivePie, PieDatum } from '@nivo/pie'
import { Statistics } from '../constants/model';
import { colors, nivoTheme } from '../App.styles';

interface Props {
  data: Statistics;
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


const SummaryPieChart = ({ data }: Props) => {
  const formattedData: PieDatum[] = [
    {
      id: 'rest',
      value: data.rest,
      color: colors.green,
    },
    {
      id: 'plastic',
      value: data.plastic,
      color: colors.red,
    },
    {
      id: 'glass',
      value: data.glass,
      color: colors.blue,
    },
    {
      id: 'paper',
      value: data.paper,
      color: colors.yellow,
    },
  ];

  return <ResponsivePie
    theme={nivoTheme}
    data={formattedData}
    margin={{
      top: 50,
      right: 70,
      bottom: 50,
      left: 70
    }}
    innerRadius={0.6}
    padAngle={0.5}
    cornerRadius={5}
    radialLabelsLinkColor={{ from: 'color', modifiers: [] }}
    radialLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
    radialLabelsLinkStrokeWidth={2}
    slicesLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
    colors={({ id, data }) => getColor(id as string)}
  />
};

export default SummaryPieChart;
