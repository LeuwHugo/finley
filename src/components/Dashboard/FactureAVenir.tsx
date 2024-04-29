import React from 'react';
import styled from 'styled-components';
// Define a TypeScript interface for the component's props
interface FactureAVenirProps {
  charges: Array<{
    date: string;
    description: string;
    subtitle: string;
    amount: string;
    note: string;
  }>;
}
const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // Aligner les éléments au centre verticalement
`;

const DayText = styled.div`
  font-size: 2rem; // Augmentez la taille de la police pour le jour
  font-weight: bold; // Rendez le texte du jour gras
  color: #333;
`;

const MonthText = styled.div`
  font-size: 0.9rem; // Diminuez la taille de la police pour le mois
  color: #666;
  margin-bottom: 4px; // Ajoutez un peu d'espace entre le mois et le jour
`;
const FactureAVenirContainer = styled.div`
  grid-column: 11 / 16;
  grid-row: 1 / 5;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  `;

const ValuesContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  flex: 0 0 auto; // Do not grow or shrink
`;

const FactureAVenirValue = styled.p`
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

const ChargesContainer = styled.div`
  flex-grow: 1; // Allows the container to fill the space
  display: flex;
  flex-direction: column; // Stack vertically
  gap: 10px; // Adds space between charge containers
  overflow-y: auto; // Allows scrolling on the y-axis
  padding-bottom: 10px; // Adds padding at the bottom
  margin-bottom: 10px; // Space after the last charge container
`;

const ChargeContainer = styled.div`
  display: flex;
  flex-direction: row; // Change to row to place the date on the left
  align-items: center; // Stack date, description and note vertically
  padding: 20px; // Increased padding for better spacing
  background-color: #FFFFFF; // White background for a clean look
  border-radius: 10px; // Smoothed border radius for a modern feel
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // More pronounced shadow for depth
  margin-bottom: 10px; // Space between each charge container
`;

const DescriptionNoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1; // Allows this container to fill available space
  margin-left: 30px; // Add some space between the date and the rest
`;

const DateText = styled.div`
  font-size: 0.9rem;
  font-weight: bold; // Make date text bold
  color: #333; // Darker color for better readability
  margin-bottom: 8px; // Space between date and description
`;

const DescriptionContainer = styled.div`
  display: flex;
  justify-content: space-between; // Space between description and amount
  align-items: flex-start; // Aligns items to the top
  margin-bottom: 4px; // Space between description and note
`;

const DescriptionText = styled.div`
  font-size: 1.6rem; // Larger font size for description
  color: #333;
  font-family: 'Roboto', sans-serif;
  font-weight: bold; // Bold for emphasis
`;

const SubtitleText = styled.div`
  font-size: 0.9rem; // Subdued font size for subtitle
  color: #666; // Lighter color for hierarchy
  font-family: 'Roboto', sans-serif;
  margin-top: 4px; // Space between description and subtitle
`;

const AmountButton = styled.div`
  background-color: #F2F4F7; // Fond gris clair pour un contraste subtil
  color: #333;
  font-family: 'Roboto', sans-serif;
  font-weight: bold; // Rendre le texte en gras
  font-size: 2rem; // Augmenter la taille de la police
  padding: 10px 20px; // Augmenter le padding pour un bouton plus grand
  border-radius: 18px; // Coins arrondis
  margin-top: 30px; // Space between description and subtitle

`;



const NoteText = styled.div`
  font-size: 0.8rem; // Smaller font size for a subtle note
  color: #999; // Lighter color for less emphasis
  font-family: 'Roboto', sans-serif;
  margin-top: 8px; // Space between note and bottom of container
`;
const FactureAVenir: React.FC<FactureAVenirProps> = ({ charges }) => {
  return (
    <FactureAVenirContainer>
      <ValuesContainer>
        <FactureAVenirValue>240,399€</FactureAVenirValue>
        <AllAccountsText>Tous les comptes</AllAccountsText>
      </ValuesContainer>
      <Separator />
      <ChargesContainer>
        {charges.map((charge, index) => {
          const dateParts = new Date(charge.date); // Créez un objet Date à partir de la chaîne de date
          const day = dateParts.getDate().toString(); // Obtenez le jour sous forme de chaîne
          const month = dateParts.toLocaleString('default', { month: 'long' }); // Obtenez le nom du mois

          return (
            <ChargeContainer key={index}>
              <DateContainer>
                <MonthText>{month}</MonthText>
                <DayText>{day}</DayText>
              </DateContainer>
              <DescriptionNoteContainer>
                <DescriptionContainer>
                  <div>
                    <DescriptionText>{charge.description}</DescriptionText>
                    <SubtitleText>{charge.subtitle}</SubtitleText>
                  </div>
                  <AmountButton>{charge.amount}</AmountButton>
                </DescriptionContainer>
                <NoteText>{charge.note}</NoteText>
              </DescriptionNoteContainer>
            </ChargeContainer>
          );
        })}
      </ChargesContainer>
    </FactureAVenirContainer>
  );
};

export default FactureAVenir;
