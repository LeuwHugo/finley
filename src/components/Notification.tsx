import React from 'react';
import styled from 'styled-components';
import { AiOutlineCalendar } from 'react-icons/ai';
import { AiOutlineBell } from 'react-icons/ai';
import { AiOutlineCaretDown } from 'react-icons/ai';

function Notification() {
  return (
    <Nav>
      <div className="notification">
        <AiOutlineCalendar className="font_icon"/>
      </div>
    </Nav>
  )
}
export default Notification
const Nav = styled.nav`
display: flex;
justify-content: space-between;
justify-content: right;
.notification{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 50%;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover{
    background-color: #ECECF6;
  }
  .font_icon{
    font-size: 1.5rem;
  }
}
`