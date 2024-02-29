import React from 'react';
import styled from 'styled-components';
import { MdOutlineWaterDrop } from 'react-icons/md';
import { GiPayMoney } from 'react-icons/gi';
import { AiOutlineThunderbolt } from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
interface AnalyticProps {
    status: 'payé' | 'reçu'; // Définir les valeurs possibles pour la prop status
  }
function Activity() {
  return (
    <Section>
      <div className='title'>
        <div className="titleContent">
          <h4>Recent Activities</h4>
          <div className="dateContainer">
            <FiChevronLeft className="arrow" />
            <h6>10 Jan 2022</h6>
            <FiChevronRight className="arrow" />
          </div>
        </div>
      </div>

      <Analytic status="payé">
        <div className="design">
          <div className="logo">
            <MdOutlineWaterDrop />
          </div>
          <div className="content">
            <h5>Water Bill</h5>
            <h5 className='color'>Payé</h5>
          </div>
        </div>
        <div className="money">
          <h5>$120</h5>
        </div>
      </Analytic>

      <Analytic status="reçu">
        <div className="design">
          <div className="logo">
            <GiPayMoney />
          </div>
          <div className="content">
            <h5>Income Salary</h5>
            <h5 className='color'>Reçu</h5>
          </div>
        </div>
        <div className="money">
          <h5>$4500</h5>
        </div>
      </Analytic>

      <Analytic status="payé">
        <div className="design">
          <div className="logo">
            <AiOutlineThunderbolt />
          </div>
          <div className="content">
            <h5>Electric Bill</h5>
            <h5 className='color'>Payé</h5>
          </div>
        </div>
        <div className="money">
          <h5>$150</h5>
        </div>
      </Analytic>

    </Section>
  )
}

const Section = styled.section`
  display: grid;
  gap: 1rem;
  padding: 1rem;

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
`;

const Analytic = styled.div<AnalyticProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #ffff;
  //background-color: ${props => props.status === 'payé' ? '#FF9A8D' : '#93C572'};
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    background-color: #EAEAFD;
  }

  .design {
    display: flex;
    align-items: center;
    gap: 1rem;

    .logo {
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        color: #4B4B4B;
        font-size: 1.5rem;
      }
    }

    .content {
      h5 {
        margin: 0;
      }
      .color {
        color: grey;
        font-size: 0.9rem;
      }
    }
  }

  .money {
    font-weight: bold;
    font-size: 1.1rem;
  }
`;

export default Activity;
