import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosArrowBack, IoIosArrowForward, IoMdMan } from 'react-icons/io'; // Ajout de IoMdMan pour l'icône de la banque
import { BsBank2 } from "react-icons/bs";
import mastercardLogo from './src/assets/mastercard2.png';
import { MdArrowOutward } from "react-icons/md";
import { IconType } from 'react-icons';
import { MdAccountBalance } from "react-icons/md"; // Un exemple d'une autre icône que vous pourriez utiliser
import { FaBitcoin, FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";

type AccountData = {
  type: string;
  bank: string;
  balance: number; 
  color: string;
  account_logo: string;
  type_logo: IconType; // Utilise IconType pour la propriété type_logo
};
const TotalBalanceContainer = styled.div`
  grid-column: 1 / 6;
  grid-row: 1 / 5;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: all 0.3s ease; /* Ajout de la transition */
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
  font-size: 2.5rem; // Agrandit les dots
  color: ${props => props.isActive ? '#2d9c90' : '#979898'}; // Dot actif en #2d9c90, les autres en gris
`;

const AccountInfoContainer = styled.div`
  position: relative; /* Ajout d'une position relative pour positionner les éléments enfants */
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d9c90;
  padding: 15px;
  border-radius: 10px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  color: #333;
  height: 120px;
`;

const AccountLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; // Un espace entre l'icône et le texte
`;

const AccountTypeIcon = styled.div<{ Icon: IconType }>`
  ${({ Icon }) => `
    font-size: 30px;
    color: #2d9c90;
    background-color: #ffff;
    border-radius: 50%;
    padding: 10px;
    display: inline-flex; // Ajout pour afficher correctement l'icône
  `}
`;

const IconContainer = styled.div`
  font-size: 30px;
  color: #2d9c90;
  background-color: #ffff;
  border-radius: 50%;
  padding: 10px;
  display: inline-flex; // Ajout pour afficher correctement l'icône
`;

const OutwardArrowContainer = styled.div`
  width: 40px; /* Ajuster la largeur */
  height: 40px; /* Ajuster la hauteur */
  border-radius: 50%; /* Rendre le conteneur circulaire */
  background-color: #ffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 15px;
  right: 0; /* Alignement à droite */
  transform: translateX(100%); /* Pour ajuster la position à droite de BalanceValue */
  margin-right: 30px;
  margin-top: 60px;
`;
const AccountName = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccountType = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffff;
  margin: 0;
  margin-left: 10px; // Un peu d'espace entre l'icône et le texte
`;
const BalanceValueContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 15px;
  right: 15px;
  text-align: right; /* Aligner le texte à droite */
  width: 150px; /* Ajouter une largeur de 300 pixels (ou la valeur souhaitée) */
`;
const AccountNumber = styled.span`
  font-size: 0.9rem;
  color: #ffff; // Une couleur de texte plus légère pour le numéro de compte
  margin-left: 10px; // Un peu d'espace entre l'icône et le texte
`;


const BalanceValue = styled.span`
  font-weight: bold;
  font-size: 1.6rem; // Augmenter la taille pour l'importance du solde
  color: #ffffff; // Une couleur vive pour le solde pour attirer l'attention
  position: absolute;
  bottom: 15px;
  right: 40px;
  text-align: right; /* Aligner le texte à droite */
  margin-bottom: 5px;
`;

const MastercardLogo = styled.img`
  height: 30px;
  position: absolute;
  top: 10px; /* Déplace le logo vers le haut */
  right: 10px; /* Déplace le logo vers la droite */
`;

const AccountDetails = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const TotalBalance = () => {
  const [activeDot, setActiveDot] = useState(0); // 0 pour le premier dot
  const [activeAccountIndex, setActiveAccountIndex] = useState(0); // Index du compte actuellement affiché
  
  const accountsData: AccountData[] = [

    {
      type: "Type de compte 1",
      bank: "Banque 1",
      balance: 25000 ,
      color: "#2d9c90",
      account_logo: "./src/assets/mastercard2.png",
      type_logo: BsBank2
    },
    {
      type: "Type de compte 2",
      bank: "Banque 2",
      balance: 30000,
      color: "#ff5733",
      account_logo: "./src/assets/cmb.png",
      type_logo: FaBitcoin
    },
    {
      type: "Type de compte A",
      bank: "Banque A",
      balance: 15000,
      color: "#4287f5",
      account_logo: "./src/assets/bankA.png",
      type_logo: FaDollarSign
    },

    {
      type: "Type de compte B",
      bank: "Banque B",
      balance: -5000, 
      color: "#42A55a",
      account_logo: "./src/assets/bankB.png",
      type_logo: FaEuroSign
    },

    {
      type: "Type de compte C",
      bank: "Banque C",
      balance: 25000.25 ,
      color: "#f5429e",
      account_logo: "./src/assets/bankC.png",
      type_logo: FaPoundSign
    }
    
  ];
  
  const handlePrevClick = () => {
    setActiveAccountIndex(prev => Math.max(prev - 1, 0)); // Ne va pas en dessous de 0
    setActiveDot(prev => Math.max(prev - 1, 0)); // Met à jour l'index du point actif
  };

  const handleNextClick = () => {
    setActiveAccountIndex(prev => Math.min(prev + 1, accountsData.length - 1)); // Ne va pas au-delà du nombre total de comptes - 1
    setActiveDot(prev => Math.min(prev + 1, accountsData.length - 1)); // Met à jour l'index du point actif
  };

  

  return (
    <TotalBalanceContainer>
      <ValuesContainer>
        <TotalBalanceValue>240,399€</TotalBalanceValue>
        <AllAccountsText>Tous les comptes</AllAccountsText>
      </ValuesContainer>
      <Separator />
      <AccountInfoContainer style={{ backgroundColor: accountsData[activeAccountIndex].color }}>
      <AccountDetails>
  <AccountLogo>
    <IconContainer>
      {React.createElement(accountsData[activeAccountIndex].type_logo)}
    </IconContainer>
    <AccountName>
      <AccountType>{accountsData[activeAccountIndex].type}</AccountType>
      <AccountNumber>{accountsData[activeAccountIndex].bank}</AccountNumber>
    </AccountName>
  </AccountLogo>
</AccountDetails>
        <BalanceValueContainer>
        <BalanceValue>
        {accountsData[activeAccountIndex].balance.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </BalanceValue>
          <OutwardArrowContainer>
            <MdArrowOutward size={30} color="#2d9c90" />
          </OutwardArrowContainer>
        </BalanceValueContainer>
        <MastercardLogo src={accountsData[activeAccountIndex].account_logo} alt="Account Logo" />
      </AccountInfoContainer>
      <NavigationContainer>
        <NavItem onClick={handlePrevClick}>
          <IoIosArrowBack /><span>Précédent</span>
        </NavItem>
        <DotsContainer>
          {[...Array(accountsData.length)].map((_, index) => (
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
