
import React from 'react';
import styled from 'styled-components';

const Test3Container = styled.div`
  grid-column: 1 / 6;
  grid-row: 5 / 13;
  display: flex;
  flex-direction: column; // Maintient l'organisation verticale
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const Test3Title = styled.h2`
  margin: 0 0 20px 0; // Ajoutez une marge au bas si nécessaire
  font-size: 1.8rem;
  color: #979898;
  padding: 0 5px;
  font-family: Roboto;
`;

const ValuesContainer = styled.div`
  display: flex;
  flex-direction: row; // Alignement horizontal des éléments
  justify-content: space-between; // Répartit l'espace entre les éléments
  width: 100%; // Utilise la pleine largeur pour pousser "Tous les comptes" à droite
  align-items: center; // Alignement vertical au centre pour tous les éléments
`;

const Test3Value = styled.p`
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
  border: none; // Supprime le bord par défaut
  border-top: 1px solid #e0e0e0; // Ligne fine en haut
  width: 100%; // S'étend sur toute la largeur du conteneur
  margin-top: 10px; // Espace au-dessus du séparateur
`;

const Test3: React.FC = () => {
  return (
    <Test3Container>
      <Test3Title>Objectif</Test3Title>
      <ValuesContainer>
        <Test3Value>240,399€</Test3Value>
        <AllAccountsText>Tous les comptes</AllAccountsText>
      </ValuesContainer>
      <Separator /> {/* Ajout du séparateur juste en dessous */}
    </Test3Container>
  );
};

export default Test3;