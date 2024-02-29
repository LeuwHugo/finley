//Dashboard.tsx
import React, { useState } from 'react'; // Importation de useState
import styled from 'styled-components';
import Navbar from './NavBar';
import Analytic from './Analytic';
import Balance from './Balance';
import History from './History';
import Statistique from './Statistique';
import Sidebar from './Sidebar'; // 

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
                    <Balance />// Affiche seulement Statistique si le lien 6 est actif
                ) : (
                    <>
                        <Navbar />
                        <Analytic />
                        <History />
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