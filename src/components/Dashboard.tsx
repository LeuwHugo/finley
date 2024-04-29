// DashboardPrincipal.tsx
import React from 'react';
import styled from 'styled-components';
import TotalBalance from './Dashboard/TotalBalance'; // Assurez-vous que le chemin d'importation est correct
import Goals from './Dashboard/Goals';
import FactureAVenir from './Dashboard/FactureAVenir';
import Test3 from './Dashboard/test3';
import Test4 from './Dashboard/test4';
import Test5 from './Dashboard/test5';

// Example charge data
const chargesData = [
  {
    date: "May 15",
    description: "Figma",
    subtitle: "Figma - Monthly",
    amount: "150 €",
    note: "Last Charge - 14 May, 2022"
  },
  {
    date: "June 12",
    description: "Adobe",
    subtitle: "Adobe - Annual",
    amount: "180 €",
    note: "Last Charge - 11 June, 2022"
  },
];
const DashboardPrincipal: React.FC = () => {
  return (
    <GridContainer>
      <TotalBalance />
      <ObjectifTitle>Objectif</ObjectifTitle> {/* Positionné dans l'espace entre les composants */}
      <Goals/>
      <FactureAVenir charges={chargesData} />
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
