import React from 'react';
import { ResponsivePie, PieDatum } from '@nivo/pie'
import { Statistics } from '../constants/model';
import { colors, nivoTheme } from '../App.styles';

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


const SummaryPieChart = ({ data }: Props) => {
  const formattedData: PieDatum[] = [
    {
      id: 'Plastic',
      value: data.plastic,
      color: colors.red,
    },
    {
      id: 'Glass',
      value: data.glass,
      color: colors.blue,
    },
    {
      id: 'Non recyclable',
      value: data.rest,
      color: colors.green,
    },
    {
      id: 'Paper',
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
    radialLabel={({ id }) => id === 'Non recyclable' ? 'NR' : id as string}
    radialLabelsLinkColor={{ from: 'color', modifiers: [] }}
    radialLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
    radialLabelsLinkStrokeWidth={2}
    slicesLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
    colors={({ id, data }) => getColor(id as string)}
    tooltip={({ id, value, color }) => (
      <strong style={{ color }}>
        {id}: {value} points
      </strong>
    )}
  />
};

export default SummaryPieChart;
