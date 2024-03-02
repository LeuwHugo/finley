import React, { useRef,ReactElement  } from 'react';
import styled from 'styled-components';
import { BsCreditCard, BsBank2, BsFillPiggyBankFill } from "react-icons/bs";
import { AiOutlineMore } from "react-icons/ai";
import { FaBitcoin } from "react-icons/fa";

// Type pour les propriétés du composant ScrollButton
interface ScrollButtonProps {
    direction?: 'left' | 'right';
    onClick: () => void;
}

// Définissez une interface pour les props
interface AnalyticCardProps {
    Icon: ReactElement; // Utilisez ReactElement pour le type d'icône
    title: string;
    balance: string;
  }

// Utilisez l'interface avec votre composant
const AnalyticCard: React.FC<AnalyticCardProps> = ({ Icon, title, balance }) => {
    return (
      <div className="analytic">
        <div className="design">
          <div className="logo">{Icon}</div>  {/* Utiliser directement l'élément React pour l'icône */}
          <div className="action"><AiOutlineMore /></div>
        </div>
        <div className="transfer"><h6>{title}</h6></div>
        <div className="money"><h5>Solde : {balance}</h5></div>
      </div>
    );
  };

// Composant principal pour afficher les analyses financières
function Analytic() {
    const carousel = useRef<HTMLDivElement>(null); // Référence pour le conteneur défilant

    // Fonction pour gérer le défilement horizontal
    const handleScroll = (direction: 'left' | 'right') => {
        if (carousel.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carousel.current.scrollLeft += scrollAmount;
        }
    };

    return (
        <Container>
          <ScrollButton direction="left" onClick={() => handleScroll('left')}>&lt;</ScrollButton>
          <Section ref={carousel}>
          <AnalyticCard Icon={<BsBank2 />} title="Compte CMB" balance="$1200" />
          <AnalyticCard Icon={<FaBitcoin />} title="Wallet Binance" balance="1200€" />
          <AnalyticCard Icon={<BsBank2 />} title="Compte Revolut" balance="1200€" />
          <AnalyticCard Icon={<BsFillPiggyBankFill />} title="Épargne Jeune" balance="1200€" />
          <AnalyticCard Icon={<BsFillPiggyBankFill />} title="Épargne Jeune" balance="1200€" />
          <AnalyticCard Icon={<BsFillPiggyBankFill />} title="Épargne Jeune" balance="1200€" />
          </Section>
          <ScrollButton direction="right" onClick={() => handleScroll('right')}>&gt;</ScrollButton>
        </Container>
      );
}

export default Analytic;

// Styles pour le conteneur principal
const Container = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

// Styles pour les boutons de défilement
const ScrollButton = styled.button<ScrollButtonProps>`
    border: none;
    background-color: #333;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    user-select: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #555;
        transform: translateY(-50%) scale(1.1);
    }

    ${({ direction }) => direction === 'left' && `left: -0.5rem;`}
    ${({ direction }) => direction === 'right' && `right: -0.5rem;`}
`;

// Styles pour la section contenant les cartes d'analyse
const Section = styled.section`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-behavior: smooth;
    width: 100%;
    margin: 0 40px;

    &::-webkit-scrollbar {
        display: none;
    }

    .analytic {
        flex: 0 0 auto;
        margin: 1rem;
        min-width: 250px;
        padding: 2rem;
        border-radius: 1rem;
        color: #333;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }

        .design {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .logo svg {
                font-size: 2.5rem;
                color: #555;
            }
            
            .action svg {
                font-size: 1.5rem;
                color: #555;
            }
        }

        .transfer {
            margin-top: 1rem;
            color: #777;
            font-size: 1rem;
        }

        .money {
            margin-top: 1rem;
            font-size: 1.2rem;
            font-weight: bold;
        }
    }
`;
