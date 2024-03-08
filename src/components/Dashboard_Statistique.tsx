// DashboardStatistique.tsx
import React from 'react';
import styled from 'styled-components';

const DashboardStatistique: React.FC = () => {
  return (
    <GridContainer>
      
    </GridContainer>
  );
};

export default DashboardStatistique;

// Utilisez styled-components pour définir le style de la grille
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 colonnes */
  grid-template-rows: repeat(5, 1fr); /* 5 lignes */
  gap: 10px; /* Espacement entre les cellules */
  padding: 20px; /* Padding autour de la grille */
  margin-left: 250px; /* Assurez-vous que cela correspond à la largeur de votre Sidebar pour éviter le chevauchement */
  height: calc(100vh - 40px); /* Hauteur totale moins le padding pour éviter le débordement */
  overflow: auto; /* Permet le défilement si le contenu dépasse la hauteur de la grille */
  background-color: #202020; /* Nouvelle couleur de fond */

`;
