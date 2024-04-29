import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from './components/Sidebar';
import DashboardPrincipal from './components/Dashboard';
import Transaction from './components/Transaction';
const App: React.FC = () => {
  // Ajouter un état pour le lien actuel avec TypeScript
  const [currentLink, setCurrentLink] = useState<string>('dashboard');

  return (
    <Div>
      <Sidebar onLinkClick={setCurrentLink} />
      {/* Afficher conditionnellement DashboardPrincipal en fonction de currentLink */}
      {currentLink === 'dashboard' && <DashboardPrincipal />}
      {currentLink === 'transaction' && <Transaction />}
    </Div>
  );
};

export default App;

const Div = styled.div`
  position: relative;
`;
