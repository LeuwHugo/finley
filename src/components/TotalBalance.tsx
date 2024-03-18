import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'; // Importation des icônes

const TotalBalanceContainer = styled.div`
  grid-column: 1 / 6;
  grid-row: 1 / 5;
  display: flex;
  flex-direction: column; // Maintient l'organisation verticale
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const TotalBalanceTitle = styled.h2`
  margin: 0 0 20px 0;
  font-size: 1.8rem;
  color: #979898;
  padding: 0 5px;
  font-family: Roboto;
`;

const ValuesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const TotalBalanceValue = styled.p`
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

const NavigationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  color: #979898;
  font-family: Roboto;
  margin-top: auto; // Pousse le conteneur vers le bas
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer; // Change le curseur en pointeur pour indiquer la possibilité de cliquer
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
`;

const Dot = styled.span<{ isActive: boolean }>`
  padding: 0 3px;
  font-size: 1.8rem; // Agrandit les dots
  color: ${props => props.isActive ? '#000' : '#979898'}; // Dot actif en noir, les autres en gris
`;

const TotalBalance = () => {
  const [activeDot, setActiveDot] = useState(0); // 0 pour le premier dot

  const handlePrevClick = () => {
    setActiveDot(prev => Math.max(prev - 1, 0)); // Ne va pas en dessous de 0
  };

  const handleNextClick = () => {
    setActiveDot(prev => Math.min(prev + 1, 2)); // Ne va pas au-delà de 2 (pour 3 dots)
  };

  return (
    <TotalBalanceContainer>
      <TotalBalanceTitle>Solde Total</TotalBalanceTitle>
      <ValuesContainer>
        <TotalBalanceValue>240,399€</TotalBalanceValue>
        <AllAccountsText>Tous les comptes</AllAccountsText>
      </ValuesContainer>
      <Separator />
      <NavigationContainer>
        <NavItem onClick={handlePrevClick}>
          <IoIosArrowBack /><span>Précédent</span>
        </NavItem>
        <DotsContainer>
          {[...Array(3)].map((_, index) => (
            <Dot key={index} isActive={activeDot === index}>•</Dot>
          ))}
        </DotsContainer>
        <NavItem onClick={handleNextClick}>
          <span>Suivant</span><IoIosArrowForward />
        </NavItem>
      </NavigationContainer>
    </TotalBalanceContainer>
  );
};

export default TotalBalance;
