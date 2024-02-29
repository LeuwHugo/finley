import React from 'react'
import styled from 'styled-components'
import { BiHomeAlt } from "react-icons/bi";
import { BiCar } from "react-icons/bi";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Payment() {
    return (
        <Section>
            <div className='title'>
            <div className="titleContent">
            <h4>Upcoming Payments</h4>
            <div className="dateContainer">
                    <FiChevronLeft className="arrow left" />
                    <h6>6 Feb 2023</h6>
                    <FiChevronRight className="arrow right" />
                </div>
                </div>
        </div>

        <div className="analytic ">
            <div className="design">
                <div className="logo">
                    <BiHomeAlt />
                </div>
                <div className="content">
                    <h5>Home Rent</h5>
                    <h5 className='color'>Pending</h5>
                </div>           
            </div>
            <div className="money">
                    <h5>$1500</h5>                 
            </div>         
        </div>
        <div className="analytic ">
            <div className="design">
                <div className="logo">
                    <BiCar />
                </div>
                <div className="content">
                    <h5>Car Insurance</h5>
                    <h5 className='color'>Pending</h5>
                </div>              
            </div>
            <div className="money">
                    <h5>$150</h5>            
                </div>   
        </div>

        <div className="analytic ">
            <div className="design">
                <div className="logo">
                    <BiCar />
                </div>
                <div className="content">
                    <h5>Car Insurance</h5>
                    <h5 className='color'>Pending</h5>
                </div>              
            </div>
            <div className="money">
                    <h5>$150</h5>            
                </div>   
        </div>
    </Section>
    )
}

export default Payment
const Section = styled.section`
    display: grid;
    gap: 1rem; /* Augmenter l'espace entre les éléments */
    padding: 1rem; /* Ajouter du padding autour de la section pour un meilleur espacement */
    
    .title {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;

    .titleContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .dateContainer {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .arrow {
      top: 50%;
      transform: translateY(10%);
      color: grey;
      cursor: pointer;
    }
    h4 {
    font-weight: bold;
    }

    h6 {
    color: grey;
    font-size: 0.9rem; /* Réduire la taille pour distinguer */
    margin: 0; /* Supprimer les marges par défaut pour un alignement plus précis */
    }
     }

    .analytic {
        display: flex;
        align-items: center;
        justify-content: space-between; /* Utiliser space-between pour aligner les éléments aux extrémités */
        padding: 1rem; /* Augmenter le padding pour plus d'espace autour des éléments */
        background-color: #FFFFFF; /* Couleur de fond plus douce pour chaque élément */
        border-radius: 10px; /* Arrondir les bords */
        box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* Ajouter une légère ombre pour la profondeur */

        &:hover {
            background-color: #EAEAFD; /* Changement de couleur au survol pour un effet interactif */
        }

        .design {
            display: flex;
            align-items: center;
            gap: 1rem; /* Espace entre l'icône et le texte */

            .logo {
                display: flex;
                justify-content: center;
                align-items: center;
                svg {
                    color: #4B4B4B; /* Couleur d'icône neutre */
                    font-size: 1.5rem;
                }
            }

            .content {
                h5 {
                    margin: 0; /* Supprimer les marges par défaut */
                }
                .color {
                    color: grey;
                    font-size: 0.9rem; /* Réduire la taille pour la distinction */
                }
            }
        }

        .money {
            font-weight: bold; /* Rendre le montant plus visible */
            font-size: 1.1rem; /* Augmenter légèrement la taille */
        }
    }
`;