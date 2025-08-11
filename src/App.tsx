import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Comptes from "./pages/Comptes";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Credits from "./pages/Credits";
import RecurringExpenses from "./pages/RecurringExpenses";
import Settings from "./pages/Settings";
import { LanguageProvider } from "./components/LanguageProvider";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="comptes" element={<Comptes />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budget" element={<Budget />} />
            <Route path="credits" element={<Credits />} />
            <Route path="recurring-expenses" element={<RecurringExpenses />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
