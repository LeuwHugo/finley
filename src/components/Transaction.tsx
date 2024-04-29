// Transaction.tsx
import React from 'react';
import styled from 'styled-components';
import TotalBalance from './Dashboard/TotalBalance'; // Assurez-vous que le chemin d'importation est correct
import Goals from './Dashboard/Goals';;


const Transaction: React.FC = () => {
  return (
    <GridContainer>
      <TotalBalance />
      <Goals/>
    </GridContainer>
  );
};


export default Transaction;

// Styles pour GridContainer comme défini précédemment
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(15, 1fr); /* 16 colonnes */
  grid-template-rows: repeat(12, 1fr); /* 12 lignes */
  gap: 30px; /* Espacement entre les cellules */
  padding: 20px; /* Padding autour de la grille */
  margin-left: 230px; /* Assurez-vous que cela correspond à la largeur de votre Sidebar */
  height: calc(100vh - 40px); /* Hauteur totale moins le padding pour s'assurer que cela s'étire vers le bas */
  overflow: auto; /* Permet le défilement si le contenu dépasse la hauteur de la grille */
  background-color: #eeeff1; /* Couleur de fond */
  margin-right: 20px;
`;
