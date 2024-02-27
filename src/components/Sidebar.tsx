import react from 'react'
import styled from 'styled-components'
import { BiHomeAlt } from 'react-icons/bi';
import{AiOutlineFundProjectionScreen} from 'react-icons/ai';
import {BsCreditCard2Front} from 'react-icons/bs';
import { AiOutlineTrophy} from 'react-icons/ai';
import { AiOutlineFileText} from 'react-icons/ai';

import { AiOutlineDotChart} from 'react-icons/ai';

import {BsCircleFill} from 'react-icons/bs';

function Sidebar() {
  return (
    <div>
      <Section>
          <div className= "top">
            <div className="brand">
              <BsCircleFill className="color1"/>
              <BsCircleFill className="color2"/>
              <BsCircleFill className="color3"/>
            </div>
            <div className='links'>
              <ul>
                <li>
                  <a href="#">
                    <BiHomeAlt/>
                  </a>
                </li>
              </ul>

            </div>
          </div>  
      </Section>
    </div>
  )
}

export default Sidebar

const Section = styled.section `

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
    .brand{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.3rem 0;
      .color1{
        color: red;
      }
      .color2{
        color: yellow;
      }
      .color1{
        color: green;
      }
      svg{
       margin: 0 2px;
       font-size: 0.8rem;
      }
    }
  }
  `;

