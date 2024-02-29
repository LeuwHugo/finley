import React, { useRef } from 'react';
import styled from 'styled-components';
import { BsCreditCard, BsBank2, BsFillPiggyBankFill } from "react-icons/bs";
import { AiOutlineMore } from "react-icons/ai";
import { FaBitcoin } from "react-icons/fa";

// Définir un type pour les props de ScrollButton
type ScrollButtonProps = {
    left?: boolean;
    right?: boolean;
    onClick: () => void;
};

function Analytic() {
    // Spécifiez que la référence est à un élément HTMLDivElement
    const carousel = useRef<HTMLDivElement>(null);

    // Définir un type pour 'direction'
    const handleScroll = (direction: 'left' | 'right') => {
        if (carousel.current) {
            if (direction === 'left') {
                carousel.current.scrollLeft -= 300; // Ajustez si nécessaire
            } else {
                carousel.current.scrollLeft += 300; // Ajustez si nécessaire
            }
        }
    };

    return (
        <Container>
            <ScrollButton left onClick={() => handleScroll('left')}>&lt;</ScrollButton>
            <Section ref={carousel}>
            <div className="analytic ">
                <div className="design">
                    <div className="logo">
                        <BsBank2 />
                    </div>
                    <div className="action">
                    <AiOutlineMore />
                    </div>
                </div>
                <div className="transfer">
                    <h6>Compte CMB</h6>
                </div>
                <div className="money">
                    <h5>Solde : $1200</h5>
                </div>
            </div>
            <div className="analytic ">
                <div className="design">
                    <div className="logo">
                        <FaBitcoin />
                    </div>
                    <div className="action">
                    <AiOutlineMore />
                    </div>
                </div>
                <div className="transfer">
                    <h6>Wallet Binance</h6>
                </div>
                <div className="money">
                    <h5>Solde : 1200€</h5>
                </div>
            </div>
            <div className="analytic ">
                <div className="design">
                    <div className="logo">
                        <BsBank2 />
                    </div>
                    <div className="action">
                    <AiOutlineMore />
                    </div>
                </div>
                <div className="transfer">
                    <h6>Compte Revolut </h6>
                </div>
                <div className="money">
                    <h5>Solde : 1200€</h5>
                </div>
            </div>
            <div className="analytic ">
                <div className="design">
                    <div className="logo">
                        <BsFillPiggyBankFill />
                    </div>
                    <div className="action">
                    <AiOutlineMore />
                    </div>
                </div>
                <div className="transfer">
                    <h6>Epargne Jeune </h6>
                </div>
                <div className="money">
                    <h5>Solde : 1200€</h5>
                </div>
            </div>

            <div className="analytic ">
                <div className="design">
                    <div className="logo">
                        <BsFillPiggyBankFill />
                    </div>
                    <div className="action">
                    <AiOutlineMore />
                    </div>
                </div>
                <div className="transfer">
                    <h6>Epargne Jeune </h6>
                </div>
                <div className="money">
                    <h5>Solde : 1200€</h5>
                </div>
            </div> 
            </Section>
            <ScrollButton right onClick={() => handleScroll('right')}>&gt;</ScrollButton>
        </Container>
    );
}


export default Analytic
const Container = styled.div`
    display: flex;
    align-items: center;
    position: relative;
`;

const ScrollButton = styled.button<ScrollButtonProps>`
    border: none;
    background-color: #333; // Couleur adaptée à la palette de la photo
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    user-select: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem; // Taille du bouton
    height: 2rem; // Taille du bouton
    border-radius: 50%; // Rend les boutons circulaires
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); // Ombre subtile pour la profondeur
    transition: background-color 0.3s, transform 0.3s;

    &:hover {
        background-color: #555; // Assombrir le bouton au survol
        transform: translateY(-50%) scale(1.1); // Effet de grossissement au survol
    }

    // Utilisation des props pour placer les boutons à gauche ou à droite
    ${({ left }) => left && `
        left: -0.5rem; // Décale légèrement vers l'extérieur pour l'effet flottant
        box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
    `}
    ${({ right }) => right && `
        right: -0.5rem; // Décale légèrement vers l'extérieur pour l'effet flottant
        box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.2);
    `}
`;

    const Section = styled.section`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-behavior: smooth;
    width: 100%;
    margin: 0 40px; // Ajustez la marge pour éviter le chevauchement avec les boutons

    &::-webkit-scrollbar {
        display: none; // Safari et Chrome
    }

    .analytic {
        flex: 0 0 auto;  //Empêche les cartes de s'étirer
        margin: 1rem;
        min-width: 250px; // Ou la taille que vous souhaitez
        max-width: calc(100% - 80px); // Pour empêcher les cartes de s'étirer trop
        padding: 2rem;
        border-radius: 1rem;
        margin-right: 1rem;
        color: #333;
        background-color: #fff;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.2);
        }

        &:last-child {
            margin-right: 0;
        }

        .design {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            
            .logo {
                svg {
                    font-size: 2.5rem;
                    color: #555;
                }
            }
            
            .action {
                svg {
                    font-size: 1.5rem;
                    color: #555;
                }
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
