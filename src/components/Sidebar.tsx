import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiCreditCard, FiTrendingUp, FiSettings, FiMenu, FiX, FiPieChart } from "react-icons/fi";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      {/* Bouton pour ouvrir/fermer la sidebar */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h1 className="text-xl font-bold transition-opacity duration-300">Finley</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition cursor-pointer"
        >
          {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-2">
        <SidebarItem to="/" icon={<FiHome size={22} />} label="Dashboard" isCollapsed={isCollapsed} />
        <SidebarItem to="/comptes" icon={<FiCreditCard size={22} />} label="Comptes" isCollapsed={isCollapsed} />
        <SidebarItem to="/transactions" icon={<FiTrendingUp size={22} />} label="Transactions" isCollapsed={isCollapsed} />
        <SidebarItem to="/budget" icon={<FiPieChart size={22} />} label="Budget" isCollapsed={isCollapsed} /> {/* ✅ Ajout de l'onglet Budget */}
        <SidebarItem to="/settings" icon={<FiSettings size={22} />} label="Paramètres" isCollapsed={isCollapsed} />
      </nav>
    </div>
  );
};

// Composant réutilisable pour chaque lien
interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem = ({ to, icon, label, isCollapsed }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-3 rounded-lg transition w-full ${
          isActive ? "bg-blue-500 text-white" : "hover:bg-gray-800"
        }`
      }
    >
      <div className="flex items-center justify-center w-10 h-10">
        {icon}
      </div>
      {/* Texte masqué en mode réduit */}
      <span className={`ml-3 transition-all duration-300 inline-flex ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
        {label}
      </span>
    </NavLink>
  );
};

export default Sidebar;
