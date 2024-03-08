import React from 'react';
import styled from 'styled-components';

interface TransactionProps {
  service: string;
  amount: string;
  type: string;
  date: string;
  isIncome: boolean;
}

// Définition des props du composant TransactionItem
interface TransactionItemProps {
    isIncome: boolean;
  }
  
  // Définition des props du composant TransactionAmount
  interface TransactionAmountProps {
    isIncome: boolean;
  }

const TransactionList: React.FC = () => {
  const transactions: TransactionProps[] = [
    { service: 'Spotify',type : "Subscription" , amount: '-$18.99', date: 'Wed 12:00am', isIncome: false },
    { service: 'Gumroad', type : "Income" , amount: '+$180.99', date: 'Wed 7:45pm', isIncome: true },
    { service: 'Webflow', type : "Income" , amount: '-$58.99', date: 'Wed 5:10pm', isIncome: false },
    { service: 'Netflix', type : "Income" , amount: '-$22.59', date: 'Tue 3:20pm', isIncome: false },
    { service: 'Netflix', type : "Income" , amount: '-$22.59', date: 'Tue 3:20pm', isIncome: false },
    

];

    return (
        <TransactionListContainer>

        <Header>
        <Title>Transactions</Title>
        <Completed>Completed</Completed>
        </Header>
            <Divider /> 
          {transactions.map((transaction, index) => (
            <TransactionCard key={index} isIncome={transaction.isIncome}>
              <ServiceInfo>
                <ServiceIcon service={transaction.service} />
                <ServiceName>{transaction.service}</ServiceName>
                <ServiceType>{transaction.type}</ServiceType> 
              </ServiceInfo>
              <TransactionAmount isIncome={transaction.isIncome}>
                {transaction.amount}
              </TransactionAmount>
              <TransactionDate>{transaction.date}</TransactionDate>
            </TransactionCard>
          ))}
        </TransactionListContainer>
      );
    };

export default TransactionList;

// Styles

const TransactionListContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1 / 3;
  grid-row: 4 / 6;
  overflow-y: auto;
  padding: 10px;
  gap: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

const TransactionItem = styled.div<TransactionItemProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: ${({ isIncome }) => (isIncome ? '#e0f2f1' : '#fce4ec')};
  border-radius: 10px;
`;

const ServiceIcon = styled.div<{ service: string }>`
  width: 30px;
  height: 30px;
  background-color: #cfd8dc;
  border-radius: 50%;
  `;

const ServiceName = styled.span`
  font-weight: bold;
  font-size: 16px; // Exemple de taille de police, à ajuster selon l'image
  color: #333; // Exemple de couleur de police, à ajuster selon l'image
  margin-bottom: 4px; // Ajuster l'espacement pour soulever le texte
  display: block; // Permet d'avoir le type de service en dessous
`;

const ServiceType = styled.span`
  font-size: 14px; // Exemple de taille de police, à ajuster selon l'image
  color: #676767; // Exemple de couleur de police, à ajuster selon l'image
  display: block; // Assurez-vous que cela s'affiche en dessous du nom du service
`;

const TransactionAmount = styled.span<TransactionAmountProps>`
  color: ${({ isIncome }) => (isIncome ? 'green' : 'red')};
`;

const TransactionDate = styled.span`
  color: #78909c;

  
`;

const TransactionCard = styled.div<{ isIncome: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const ServiceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px; // Ajustez selon vos besoins
`;

const Title = styled.h2`
  font-size: 1.5em; // Ajustez la taille selon vos besoins
  color: #333; // Ajustez la couleur selon vos besoins
`;

const Completed = styled.span`
  font-size: 1em; // Ajustez la taille selon vos besoins
  color: #333; // Ajustez la couleur selon vos besoins
  font-weight: bold;
`;

const Divider = styled.div`
  width: 100%;
  border-top: 0.5px solid #a2a2a2; // Utilisez une bordure supérieure solide pour créer le trait horizontal
  margin: 15px 0;
`;

