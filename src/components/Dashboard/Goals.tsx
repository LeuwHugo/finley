
import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell } from 'recharts';
import { HiPencilSquare } from "react-icons/hi2";

const GoalsContainer = styled.div`
  grid-column: 6 / 11;
  grid-row: 1 / 5;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const ValuesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const GoalsValue = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  font-family: Roboto;
`;

const AllAccountsText = styled.p`
  font-size: 1.2rem;
  font-weight: normal;
  color: #979898;
  font-family: Roboto;
`;

const Separator = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  width: 100%;
  margin-top: 10px;
`;

const GaugeChartContainer = styled.div`
  margin-top: 20px;
  position: relative;
  left: 76%;
  bottom : 5%;
  transform: translateX(-50%);
`;

const ValueDiv = styled.div`
  position: absolute;
  color: #000;
  transform: translate(-50%, -50%);
`;

const GoalsValueContainer = styled.div`
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  background-color: #e7e7e7;
  padding: 5px;
  border-radius: 5px;
  margin-left: 15px;
  
`;

const RADIAN = Math.PI / 180;

interface DataEntry {
  name: string;
  value: number;
  color: string;
}

interface NeedleProps {
  value: number;
  chartData: DataEntry[];
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
}

const renderCustomizedNeedle = ({ value, chartData, cx, cy, innerRadius, outerRadius }: NeedleProps) => {
  const total = chartData.reduce((acc, entry) => acc + entry.value, 0);
  const angle = 180 - (value / total) * 180;
  const cos = Math.cos(-RADIAN * angle);
  const sin = Math.sin(-RADIAN * angle);

  const x = cx + (outerRadius * 0.6) * cos;
  const y = cy + (outerRadius * 0.6) * sin;

  const baseOuterX = cx - (innerRadius * 0.05) * sin;
  const baseOuterY = cy + (innerRadius * 0.05) * cos;
  const baseInnerX = cx + (innerRadius * 0.05) * sin;
  const baseInnerY = cy - (innerRadius * 0.05) * cos;

  return (
    <>
      <circle cx={cx} cy={cy} r={innerRadius * 0.1} fill="#2d9c90" />
      <polygon
        points={`${baseOuterX},${baseOuterY} ${x},${y} ${baseInnerX},${baseInnerY}`}
        fill="#2d9c90"
      />
    </>
  );
};

interface PieChartWithNeedleProps {
  achievedValue: number;
  remainingValue: number;
}

const PieChartWithNeedle = ({ achievedValue, remainingValue }: PieChartWithNeedleProps) => {
  const data: DataEntry[] = [
    { name: 'Realisé', value: achievedValue, color: '#2d9c90' },
    { name: 'Restant', value: remainingValue, color: '#e7e7e7' },
  ];

  return (
    <GaugeChartContainer>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx={200}
          cy={150}
          startAngle={180}
          endAngle={0}
          innerRadius={100}
          outerRadius={120}
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        {renderCustomizedNeedle({ value: achievedValue, chartData: data, cx: 200, cy: 150, innerRadius: 100, outerRadius: 120 })}
      </PieChart>
    </GaugeChartContainer>
);
};

const Goals = () => {
  const achievedValue = 5.25; // Valeur réalisée
  const goalEnd = 10.5; // Objectif final
  const remainingValue = goalEnd - achievedValue; // Calcul de la valeur restante

  return (
    <GoalsContainer>
      <ValuesContainer>
        <GoalsValueContainer>
          <GoalsValue>{goalEnd} €</GoalsValue>
          <IconContainer>
            <HiPencilSquare />
          </IconContainer>
        </GoalsValueContainer>
        <AllAccountsText>Tous les comptes</AllAccountsText>
      </ValuesContainer>
      <Separator />
      <PieChartWithNeedle achievedValue={achievedValue} remainingValue={remainingValue} />
      <ValueDiv style={{ left: '68%', bottom: '6%' }}>
        <GoalsValue>{`${achievedValue} €`}</GoalsValue>
      </ValueDiv>
      <ValueDiv style={{ left: '47%', bottom: '8%' }}>
        <AllAccountsText>{`${0} €`}</AllAccountsText>
      </ValueDiv>
      <ValueDiv style={{ left: '89%', bottom: '8%' }}>
        <AllAccountsText>{`${goalEnd} €`}</AllAccountsText>
      </ValueDiv>
    </GoalsContainer>
  );
};
export default Goals;
