//Dashboard.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './NavBar';
import Analytic from './Analytic';
import Balance from './Balance';
import History from './History';
import Statistique from './Statistique';
import Sidebar from './Sidebar';
import Subscription from './Subscription';

function Dashboard() {
    const [activeLink, setActiveLink] = useState(1);

    const handleSetActiveLink = (link: number) => {
        setActiveLink(link);
    };

    return (
        <Section>
            <Sidebar onLinkClick={handleSetActiveLink} />
            <Grid>
                <NavbarContainer>
                 <Navbar />
                <Analytic />
                </NavbarContainer>
                <SubscriptionContainer>
                    <Subscription />
                </SubscriptionContainer>
                <BalanceContainer>
                </BalanceContainer>
            </Grid>
        </Section>
    );
}

export default Dashboard;

const Section = styled.section`
    margin-left: 5vw;
    margin-right: 14px;
    padding: 2rem;
    height: 100%;
    min-height: 60rem;
    background-color: #F5F5FD;
    display: flex;
    flex-direction: column;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); // 4 colonnes
    grid-template-rows: repeat(3, 1fr); // 4 lignes
    gap: 1rem;
    width: 80%;
    margin-top: 0.5rem;
`;

// Styles pour les conteneurs de chaque composant
const NavbarContainer = styled.div`
    grid-column: 1 / 4; // S'étend sur toutes les colonnes, couvrant toute la largeur
    grid-row: 1; // Première ligne, ce qui signifie qu'il ne s'occupera que de la ligne du haut
`;

const SubscriptionContainer = styled.div`
    grid-column: 1 / 2; // De la 3ème à la 4ème colonne
    grid-row: 2 / 6; // Deuxième ligne
`;

const BalanceContainer = styled.div`
    grid-column: 1 / 3; // De la 1ère à la 5ème ligne, couvrant les 4 colonnes
    grid-row: 3  // De la 3ème à la 5ème ligne, couvrant les deux lignes du bas
`;
