// App.tsx
import React from 'react';
import styled from 'styled-components'
import Sidebar from './components/Sidebar';
import DashboardPrincipal from './components/Dashboard_Home';
function App() {

  return (
    <div>
      <Sidebar/>
      <DashboardPrincipal/>
    </div>
  )
}
export default App
const Div = styled.div`
position: relative;
`;