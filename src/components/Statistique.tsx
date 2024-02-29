import React from 'react'
import styled from 'styled-components'
import Analytic from './Analytic'

function Dashboard() {
    return (
        <Section>
           
            <div className="grid">        
                    <Analytic />   
            </div>
        </Section>
    )
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