import React from 'react';
import styled from 'styled-components';
import { RiAlarmWarningFill } from "react-icons/ri";

const SubscriptionList = () => {
    return (
      <SubscriptionsContainer>
        <Header>
          Subscriptions
          <AddButton>+</AddButton>
        </Header>
        <Subscription>
          <IconAlarmWarning />
          <ServiceName>LinkedIn</ServiceName>
          <DueDate>due 23/12/04</DueDate>
          <Amount>$2000</Amount>
        </Subscription>
        <Subscription>
          <IconAlarmWarning />
          <ServiceName>Netflix</ServiceName>
          <DueDate>due 23/12/10</DueDate>
          <Amount>$500</Amount>
        </Subscription>
        <Subscription>
          <IconAlarmWarning />
          <ServiceName>Disney</ServiceName>
          <DueDate>due 23/12/22</DueDate>
          <Amount>$200</Amount>
        </Subscription>
      </SubscriptionsContainer>
    );
  };

export default SubscriptionList;

// Styled Components
const SubscriptionsContainer = styled.div`
  background: #F8F8F8; // Soft shade of gray as the background
  border-radius: 10px;
  padding: 20px;
  color: #333; // Dark gray color for the text
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); // Subtle shadow for depth
  width: 50%;
  max-width: 500px;
  margin: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; // Professional font family
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #555; // Slightly lighter color for the header text
`;

const AddButton = styled.button`
  background: #4CAF50; // A green color for the add button
  border-radius: 50%; // Make the button circular
  width: 30px; // Fixed width
  height: 30px; // Fixed height
  border: none;
  color: white;
  font-size: 1.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #367C39; // Darker shade on hover
  }
`;

const Subscription = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #DDD;
`;

const Icon = styled.span`
  font-size: 1.5em;
  color: #4CAF50; // Icons colored to match the add button
`;
const IconAlarmWarning = styled(RiAlarmWarningFill)`
  color: #FF4136; // Light red color for the icon
  font-size: 1.5em;
  margin-right: 10px; // Adds space between the icon and the service name
  border: 2px solid #FF4136; // Light red border for the circle
  border-radius: 50%; // Makes the border rounded
  padding: 5px; // Padding inside the circle
`;

const ServiceName = styled.span`
`;

const DueDate = styled.span`
  margin: 0 10px; // Add some margin to both sides of the date
  white-space: nowrap; // Prevents the date from wrapping to the next line
  color: #888; // Lighter color for the date for differentiation
  font-size: 0.9em; // Slightly smaller font size for the date
`;

const Amount = styled.span`
  font-weight: bold;
  color: #333;
  margin-left: auto; // Pushes the amount to the right
`;
