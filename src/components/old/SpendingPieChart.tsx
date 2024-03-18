// SpendingChartContainer.tsx
import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Courses', value: 15.5 },
  { name: 'Facture', value: 12.9 },
  { name: 'Apprentisage', value: 14.1 },
  { name: 'Transport', value: 18.0 },
  { name: 'Santé', value: 13.2 },
  { name: 'Abonnements', value: 11.8 },

];

const COLORS = ['#FF8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#00C49F', '#FFBB28'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}: {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  percent: number,
  index: number,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const SpendingChartContainer = () => (
  <ChartWrapper>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
        >
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </ChartWrapper>
);

export default SpendingChartContainer;

const ChartWrapper = styled.div`
  background: #F8F8F8;
  border-radius: 10px;
  padding: 20px;
  color: #333;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  /* Explicitly define a height or min-height if the ResponsiveContainer doesn't show */
  height: 290px; // or min-height: 290px;
  /* If width is 100%, make sure the parent's width is defined */
  width: 100%;
  /* Remove margin auto to test if it's causing the issue */
  /* margin: auto; */
  /* If the chart still doesn't render, try commenting out the box-shadow and border-radius */
  /* box-shadow: none; */
  /* border-radius: 0; */
`;
