import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "./LanguageProvider";

const Sidebar = () => {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { path: "/", label: t("navigation.dashboard"), icon: "📊" },
    { path: "/comptes", label: t("navigation.accounts"), icon: "🏦" },
    { path: "/transactions", label: t("navigation.transactions"), icon: "💳" },
    { path: "/budget", label: t("navigation.budget"), icon: "💰" },
    { path: "/credits", label: t("navigation.credits"), icon: "🏦" },
    { path: "/recurring-expenses", label: t("navigation.recurringExpenses"), icon: "🔄" },
    { path: "/settings", label: t("navigation.settings"), icon: "⚙️" },
  ];

  return (
    <div className={`min-h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      {/* Bouton pour ouvrir/fermer la sidebar */}
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h1 className="text-xl font-bold transition-opacity duration-300">Finley</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition cursor-pointer"
        >
          {isCollapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 p-2">
        {navItems.map((item) => (
          <SidebarItem 
            key={item.path}
            to={item.path} 
            icon={item.icon} 
            label={item.label} 
            isCollapsed={isCollapsed} 
          />
        ))}
      </nav>
    </div>
  );
};

// Composant réutilisable pour chaque lien
interface SidebarItemProps {
  to: string;
  icon: string;
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
      <div className="flex items-center justify-center w-10 h-10 text-xl">
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
