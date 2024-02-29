import React, { useState } from 'react';
import styled from 'styled-components';
import { BiHomeAlt } from 'react-icons/bi';
import { AiOutlineFundProjectionScreen, AiOutlineTrophy, AiOutlineFileText, AiOutlineDotChart } from 'react-icons/ai';
import { BsCreditCard2Front } from 'react-icons/bs';

// Définir le type pour les props de Sidebar
interface SidebarProps {
  onLinkClick: (link: number) => void; // Définir le type de la fonction de rappel
}

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick }) => { // Utiliser le type SidebarProps
  const [currentLink, setCurrentLink] = useState(1);

  const handleClick = (link: number) => { // Ajouter le typage au paramètre de la fonction
    setCurrentLink(link);
    onLinkClick(link);
  };

  return (
    <div>
      <Section>
        <div className="top">
          <div className='links'>
            <ul>
              <li className={currentLink === 1 ? "active" : ""}
                onClick={() => handleClick(1)}
              >
                <a href="#">
                  <BiHomeAlt />
                </a>
              </li>
              <li className={currentLink === 2 ? "active" : ""}
                onClick={() => handleClick(2)}
              >
                <a href="#">
                  <AiOutlineDotChart />
                </a>
              </li>
              <li className={currentLink === 3 ? "active" : ""}
                onClick={() => handleClick(3)}
              >
                <a href="#">
                  <AiOutlineFileText />
                </a>
              </li>
              <li className={currentLink === 4 ? "active" : ""}
                onClick={() => handleClick(4)}
              >
                <a href="#" className='noti'>
                  <BsCreditCard2Front />
                </a>
              </li>
              <li className={currentLink === 5 ? "active" : ""}
                onClick={() => handleClick(5)}
              >
                <a href="#">
                  <AiOutlineTrophy />
                </a>
              </li>
              <li className={currentLink === 6 ? "active" : ""}
                onClick={() => handleClick(6)}
              >
                <a href="#">
                  <AiOutlineFundProjectionScreen />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default Sidebar;

const Section = styled.section`
  position: fixed;
  left: 0;
  background-color: #ECECF6;
  height: 100vh;
  width: 6vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 0;
  gap: 2rem;

  .top{
    display: flex;
    flex-direction: column;
    gap: 4rem;
    width: 100%;
    .links {
      ul {
        margin-bottom: 3rem;
        .active {
          border-right: 0.2rem solid black;
          a {
            color: black;
          }
        }
        li {
          display: flex;
          justify-content: center;
          border-right: 0.2rem solid transparent;
          margin: 1rem 0;
          list-style-type: none;
          a {
            text-decoration: none;
            color: grey;
            font-size: 1.6rem;
          }
          .noti {
            display: flex;
            align-items: center;
            span {
              background-color: red;
              font-size: 0.5rem;
              padding: 2px 5px;
              border-radius: 50%;
              color: white;
              margin-left: 0.5rem;
            }
          }
          &:hover a {
            color: black;
          }
        }
      }
    }
  }
`;
