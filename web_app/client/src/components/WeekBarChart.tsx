import React from 'react';
import { ResponsiveBar } from '@nivo/bar'
import { TimeStatistics } from '../constants/model';
import { colors, nivoTheme } from '../App.styles';

interface Props {
  data: TimeStatistics;
}

const getColor = (category: string): string => {
  switch(category) {
    case 'Paper':
      return colors.green;
    case 'Glass':
      return colors.brown;
    case 'Plastic':
      return colors.water;
    case 'Non recyclable':
      return colors.grey;
  }
  return '';
};

const WeekBarChart = ({ data }: Props) => {
  const formattedData = data.map(row => ({
    date: row.date,
    day: row.day,
    'Paper': row.paper,
    'Glass': row.glass,
    'Plastic': row.plastic,
    'Non recyclable': row.rest,
  }));

  return <ResponsiveBar
    theme={nivoTheme}
    data={formattedData}
    keys={['Paper', 'Glass', 'Plastic', 'Non recyclable']}
    indexBy="day"
    groupMode="stacked"
    margin={{
      top: 20,
      right: 30,
      bottom: 50,
      left: 30
    }}
    innerPadding={3}
    borderRadius={5}
    labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
    axisLeft={null}
    layout="vertical"
    padding={0.5}
    colors={({ id, data }) => getColor(id)}
    animate={false}
    tooltip={({ id, value, color }) => (
      <strong style={{ color }}>
        {id}: {value} points
      </strong>
    )}
  />
};

export default WeekBarChart;
