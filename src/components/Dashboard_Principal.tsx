// DashboardPrincipal.tsx
import React from 'react';
import styled from 'styled-components';
import TransactionList from './Transaction';
const DashboardPrincipal: React.FC = () => {
  return (
    <GridContainer>
       <TransactionList />
    </GridContainer>
  );
};

export default DashboardPrincipal;

// Utilisez styled-components pour définir le style de la grille
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 colonnes */
  grid-template-rows: repeat(5, 1fr); /* 5 lignes */
  gap: 10px; /* Espacement entre les cellules */
  padding: 20px; /* Padding autour de la grille */
  margin-left: 180px; /* Assurez-vous que cela correspond à la largeur de votre Sidebar */
  height: calc(100vh - 40px); /* Hauteur totale moins le padding pour s'assurer que cela s'étire vers le bas */
  overflow: auto; /* Permet le défilement si le contenu dépasse la hauteur de la grille */
  background-color: #eeeff1; /* Change la couleur de fond en vert */
`;
