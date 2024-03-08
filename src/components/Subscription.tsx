import React from 'react';
import styled from 'styled-components';
import { RiAlarmWarningFill } from "react-icons/ri";

// Données des abonnements
const subscriptions = [
  { serviceName: 'LinkedIn', dueDate: 'le 23/12/04', amount: '35.5€' },
  { serviceName: 'Netflix', dueDate: 'le 23/12/10', amount: '20.5€' },
  { serviceName: 'Disney', dueDate: 'le 23/12/22', amount: '18.5€' },
  { serviceName: 'Spotify', dueDate: 'le 23/12/30', amount: '12.5€' },
  { serviceName: 'Amazon Prime', dueDate: 'le 23/12/30', amount: '46.5€' }

];

// Composant principal pour la liste des abonnements
const SubscriptionList = () => {
  return (
    <SubscriptionsContainer>
      <Header>
        Abonnement
        <AddButton>+</AddButton>
      </Header>
      {subscriptions.map((subscription, index) => (
        <Subscription key={index}>
          <IconAlarmWarning />
          <ServiceName>{subscription.serviceName}</ServiceName>
          <DueDate>{subscription.dueDate}</DueDate>
          <Amount>{subscription.amount}</Amount>
        </Subscription>
      ))}
    </SubscriptionsContainer>
  );
};

export default SubscriptionList;

// Styles pour le conteneur des abonnements
const SubscriptionsContainer = styled.div`
  background: #F8F8F8;
  border-radius: 10px;
  padding: 20px;
  color: #333;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 100%;
  margin: auto;
  overflow-y: auto; 
  max-height: 290px; 
  // Personnalisation de la barre de défilement pour Webkit browsers
  &::-webkit-scrollbar {
    width: 8px; // Largeur de la barre de défilement
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; // Couleur de fond de la piste de la barre de défilement
  }

  &::-webkit-scrollbar-thumb {
    background: #888; // Couleur de la barre de défilement
    border-radius: 4px; // Bord arrondi pour la barre de défilement
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555; // Couleur de la barre de défilement au survol
  }
`;

// Styles pour le conteneur de l'en-tête
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  margin-bottom: 20px;
`;

// Styles pour le bouton d'ajout d'un nouvel abonnement
const AddButton = styled.button`
  background: #4CAF50;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
`;

// Styles pour chaque élément d'abonnement
const Subscription = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #DDD;
`;

// Styles pour l'icône d'alerte
const IconAlarmWarning = styled(RiAlarmWarningFill)`
  color: #FF4136;
  font-size: 1.5em;
  margin-right: 10px;
  border: 2px solid #FF4136;
  border-radius: 50%;
  padding: 5px;
`;

// Styles pour le nom du service
const ServiceName = styled.span`
`;

// Styles pour la date d'échéance
const DueDate = styled.span`
  margin: 0 10px;
  white-space: nowrap;
  color: #888;
  font-size: 0.9em;
`;

// Styles pour le montant de l'abonnement
const Amount = styled.span`
  font-weight: bold;
  color: #333;
  margin-left: auto;
`;
