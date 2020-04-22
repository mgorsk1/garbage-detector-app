import React from 'react';
import { ResponsivePie, PieDatum } from '@nivo/pie'
import { Statistics } from '../constants/model';
import { colors, nivoTheme } from '../App.styles';
import styled from 'styled-components';

const Root = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Points = styled.span`
  font-size: 24px;
  font-weight: 800;
`;

interface Props {
  data: Statistics;
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

const SummaryPieChart = ({ data }: Props) => {
  const formattedData: PieDatum[] = [
    {
      id: 'Plastic',
      value: data.plastic,
      color: colors.water,
    },
    {
      id: 'Glass',
      value: data.glass,
      color: colors.brown,
    },
    {
      id: 'Non recyclable',
      value: data.rest,
      color: colors.grey,
    },
    {
      id: 'Paper',
      value: data.paper,
      color: colors.green,
    },
  ];

  return <Root>
    <Overlay>
      <Points>{data.plastic + data.glass + data.paper + data.rest}</Points>
      <span>points</span>
    </Overlay>
    <ResponsivePie
      theme={nivoTheme}
      data={formattedData}
      innerRadius={0.6}
      padAngle={0.5}
      cornerRadius={5}
      enableRadialLabels={false}
      slicesLabelsTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
      colors={({ id, data }) => getColor(id as string)}
      tooltip={({ id, value, color }) => (
        <strong style={{ color }}>
          {id}: {value} points
        </strong>
      )}
    />
  </Root>
};

export default SummaryPieChart;
