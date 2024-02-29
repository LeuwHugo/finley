//Dashboard.tsx
import React, { useState } from 'react'; // Importation de useState
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
            <div className="grid">
                {activeLink === 2 ? (
                    <Balance />
                ) : activeLink === 3 ? (
                    <History />
                ) : activeLink === 4 ? (
                    <Analytic />
                ) : (
                    <>
                        <Navbar />
                        <Analytic />
                        <ContentWrapper>
                            <Subscription />
                            <div className="placeholder" />
                            <div className="placeholder" />
                        </ContentWrapper>
                        <Balance />
                    </>
                )}
            </div>
        </Section>
    );
}


export default Dashboard
const Section = styled.section`
    margin-left: 5vw;
    margin-right: 14px;
    padding: 2rem;
    height: 100%; /* Modifier pour prendre toute la hauteur disponible */
    min-height: 60rem; /* Assurez-vous que le minimum est de 60rem */
    background-color: #F5F5FD;
    display: flex; /* Ajouter flex pour permettre à grid de grandir */
    flex-direction: column; /* Organiser les enfants en colonne */

    .grid { 
        margin-top: 0.5rem;
        z-index: 2;
        width: 80%;
        flex-grow: 1; /* Permet à grid de prendre tout l'espace disponible */
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`;
const ContentWrapper = styled.div`
    display: flex; // Set up a flex container
    justify-content: space-between; // Space out children evenly
    width: 100%; // Ensure the wrapper takes the full width

    .placeholder {
        flex: 1; // Each placeholder takes up 1/3 of the space
        margin: 0 1rem; // Optional: add margins between sections
        background-color: #f0f0f0; // Optional: just for visualization
    }
`;