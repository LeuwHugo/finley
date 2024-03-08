// Sidebar.tsx component

import React, { useState } from 'react';
import styled from 'styled-components';
import { BiHomeAlt, BiLogOut } from 'react-icons/bi';
import { AiOutlineTransaction, AiOutlineCreditCard, AiOutlineSetting } from 'react-icons/ai';
import { RiDashboardLine } from 'react-icons/ri';
import { FiCreditCard } from 'react-icons/fi';

// Définir le type pour les props de Sidebar
interface SidebarProps {
  onLinkClick: (link: string) => void; // Définir le type de la fonction de rappel
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => {
  const [currentLink, setCurrentLink] = useState('dashboard');

  const handleClick = (link: string) => {
    setCurrentLink(link);
    onLinkClick(link);
  };

  return (
    <SidebarContainer>
      <Logo>
        <BiHomeAlt /> {/* Vous pouvez remplacer ceci par votre logo */}
        <span>Bank El</span>
      </Logo>
      <Menu>
        <MenuItem className={currentLink === 'dashboard' ? "active" : ""} onClick={() => handleClick('dashboard')}>
          <RiDashboardLine />
          <span>Dashboard</span>
        </MenuItem>
        <MenuItem className={currentLink === 'transaction' ? "active" : ""} onClick={() => handleClick('transaction')}>
          <AiOutlineTransaction />
          <span>Transaction</span>
        </MenuItem>
        <MenuItem className={currentLink === 'payment' ? "active" : ""} onClick={() => handleClick('payment')}>
          <BiHomeAlt />
          <span>Payment</span>
        </MenuItem>
        <MenuItem className={currentLink === 'card' ? "active" : ""} onClick={() => handleClick('card')}>
          <FiCreditCard />
          <span>Card</span>
        </MenuItem>
        <MenuItem className={currentLink === 'insights' ? "active" : ""} onClick={() => handleClick('insights')}>
          <AiOutlineCreditCard />
          <span>Insights</span>
        </MenuItem>
        <MenuItem className={currentLink === 'settings' ? "active" : ""} onClick={() => handleClick('settings')}>
          <AiOutlineSetting />
          <span>Settings</span>
        </MenuItem>
        <MenuItem onClick={() => handleClick('logout')}>
          <BiLogOut />
          <span>Logout</span>
        </MenuItem>
      </Menu>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  background-color: #ffffff;
  height: 100vh;
  width: 180px; // Ajustez la largeur comme vous le souhaitez
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  svg {
    color: white;
    font-size: 1.5rem;
  }
  span {
    color: white;
    font-weight: bold;
  }
`;

const Menu = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  margin-top: 50px  ;
`;

const MenuItem = styled.li`
  color: #7b7b7b;
  width: 100%;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s; /* Transition pour un effet de survol lisse */

  &:hover, &.active {
    color: #0c0c0a;
    background-color: #f0f0f0; /* Couleur de fond au survol et élément actif */
  }
  svg {
    font-size: 1.5rem;
    min-width: 2rem; /* Garantit que les icônes sont alignées */
  }
  span {
    display: inline; /* Changez 'none' en 'inline' pour afficher le texte à côté des icônes */
    font-size: 0.85rem;
  }
`;