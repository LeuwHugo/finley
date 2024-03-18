// Test5.tsx
import React from 'react';
import styled from 'styled-components';



const Test5Container = styled.div`
  grid-column: 6 / 16; /* S'étend de la colonne 1 à 6 */
  grid-row: 9 / 13; /* S'étend de la ligne 4 à 7 */
  display: flex;
  flex-direction: column;
  background-color: white; /* Couleur de fond du composant */
  padding: 20px; /* Espace interne */
  border-radius: 10px; /* Bordures arrondies */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); /* Ombre portée pour le relief */
  // Ajouter d'autres styles selon votre design
`;

const Test5Title = styled.h2`
    margin: 0 0 20px 0; // Ajoutez une marge au bas si nécessaire
  font-size: 1.8rem;
  color: #979898;
  padding: 0 5px;
  font-family: Roboto;
`;
const TotalBalanceTitle = styled.h2`
  position: absolute;
  top: -50px;
  left: 0;
  margin: 0;
  font-size: 1.8rem;
  color: #979898;
  padding: 0 5px;
  font-family: Roboto;
`;

const Test5Value = styled.p`
  font-size: 2rem;
  font-weight: bold;
  color: #333; // Couleur du texte
  // Ajouter d'autres styles pour la valeur
`;

const Test5: React.FC = () => {
  return (
    <Test5Container>
      <Test5Title>Total Balance</Test5Title>
      <Test5Value>$240,399</Test5Value>
      {/* Ajoutez d'autres éléments de l'UI ici selon votre besoin */}
    </Test5Container>
  );
};

export default Test5;
