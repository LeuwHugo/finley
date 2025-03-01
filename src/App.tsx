import React from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Comptes from "./pages/Comptes";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import "./index.css";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="comptes" element={<Comptes />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
