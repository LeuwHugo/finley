import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';

// Données de votre diagramme
const data = [
  { name: 'Nourriture', value: 15.5 },
  { name: 'Logement', value: 12.9 },
  { name: 'Divertissement', value: 14.1 },
  { name: 'Transport', value: 18.0 },
  { name: 'Santé', value: 13.2 },
  { name: 'Abonnements', value: 11.8 },
  { name: 'Divers', value: 14.6 },
];

// Couleurs adaptées au thème de la page
const COLORS = ['#306998', '#f76c5e', '#ffd166', '#355070', '#6d597a', '#b56576', '#72bda3'];

// Style pour les légendes adapté au thème
const StyledLegend = styled(Legend)`
  color: #333333; // Couleur adaptée au texte du tableau de bord
  // Autres styles pour la légende si nécessaire
`;

// Style pour les tooltips adapté au thème
const StyledTooltip = styled(Tooltip)`
  background-color: #ffffff; // Fond blanc pour la bulle d'info
  border: 1px solid #dddddd; // Bordure légère pour la bulle d'info
  // Autres styles pour la tooltip si nécessaire
`;

// Fonction pour le rendu personnalisé du label
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number,
  cy: number,
  midAngle: number,
  innerRadius: number,
  outerRadius: number,
  percent: number,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy  + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central"
      style={{ fontSize: '14px', fontFamily: 'Arial' }}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const SpendingPieChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80} // Vous pouvez ajuster ceci en fonction de la taille de votre grille
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <StyledTooltip />
      <StyledLegend />
    </PieChart>
  </ResponsiveContainer>
);

export default SpendingPieChart;
