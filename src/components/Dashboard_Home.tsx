// DashboardPrincipal.tsx
import React from 'react';
import styled from 'styled-components';
import TotalBalance from './TotalBalance'; // Assurez-vous que le chemin d'importation est correct
import Goals from './Goals';
import Test2 from './test2';
import Test3 from './test3';
import Test4 from './test4';
import Test5 from './test5';
const DashboardPrincipal: React.FC = () => {
  return (
    <GridContainer>
      <TotalBalance />
      <ObjectifTitle>Objectif</ObjectifTitle> {/* Positionné dans l'espace entre les composants */}
      <Goals/>
      <Test2/>
      <Test3 />
      <Test4 />
      <Test5 />
    </GridContainer>
  );
};


export default DashboardPrincipal;

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
const ObjectifTitle = styled.div`
  grid-column: 1 / 6; // Aligné avec TotalBalance et Test3
  grid-row: 4 / 5; // Positionné entre TotalBalance et Test3
  display: flex;
  align-items: center; // Centre le texte verticalement
  padding: 0 20px; // Assurez-vous que le padding correspond pour l'alignement avec les autres composants
  font-size: 1.8rem;
  color: #979898;
  font-family: Roboto;
`;
