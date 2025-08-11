import { useEffect, useState, useMemo } from "react";
import { supabase, getImageUrl } from "../utils/supabase";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import LanguageSelector from "../components/LanguageSelector";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#FF5722", "#9C27B0"];

interface Account {
  id: string;
  name: string;
  type: string;
  initial_balance: number;
  logo_path?: string; // Added for logo path
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  category_id?: string;
}

interface BudgetSetting {
  id: string;
  percentage: number;
  budget_categories: {
    name: string;
    color: string;
  };
}

interface CategoryStat {
  name: string;
  value: number;
}

const Dashboard = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetSettings, setBudgetSettings] = useState<BudgetSetting[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const fetchIncomeForBudget = async () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
  
    const { data, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("type", "income")
      .gte("date", `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`)
      .lte("date", `${currentYear}-${String(currentMonth).padStart(2, "0")}-31`);
  
    if (error) {
      console.error("Erreur récupération revenus :", error.message);
      return;
    }
  
    // 🔥 Calcul du revenu total
    const totalIncome = data?.reduce((sum, t) => sum + t.amount, 0) || 0;
    console.log(`💰 Revenu total calculé pour ${currentMonth}/${currentYear} : ${totalIncome}€`);
  };
  
  useEffect(() => {
    console.log("📅 Mois ou année sélectionné changé :", {
      selectedMonth,
      selectedYear
    });
    fetchData();
  }, [selectedMonth, selectedYear]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAccounts(),
        fetchTransactions(),
        fetchBudgetSettings(),
        fetchCategoryStats(),
        fetchIncomeForBudget()
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  // 🔹 Charger les comptes
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("id, name, type, initial_balance, logo_path");
    if (!error && data) setAccounts(data);
  };

  const weeklyStats = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
  
    // Fonction pour récupérer la semaine du mois
    const getWeekOfMonth = (date: Date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
      return Math.ceil((date.getDate() + firstDay) / 7);
    };
  
    const grouped = filtered.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const week = getWeekOfMonth(date);
  
      if (!acc[week]) {
        acc[week] = { week: `Semaine ${week}`, income: 0, expense: 0 };
      }
  
      if (transaction.type === "income") {
        acc[week].income += transaction.amount;
      } else if (transaction.type === "expense") {
        acc[week].expense += transaction.amount;
      }
  
      return acc;
    }, {} as Record<string, { week: string; income: number; expense: number }>);
  
    console.log("📊 weeklyStats regroupées :", Object.values(grouped));
    return Object.values(grouped);
  }, [transactions, selectedMonth, selectedYear]);
  
  // 🔹 Charger les transactions
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });
    if (!error && data) setTransactions(data);
  };

  // 🔹 Charger les paramètres de budget du mois
  const fetchBudgetSettings = async () => {
    // D'abord, récupérer les budget_settings
    const { data: budgetSettings, error } = await supabase
      .from("budget_settings")
      .select("id, percentage, category_id")
      .eq("month", selectedMonth + 1)
      .eq("year", selectedYear);
  
    if (error) {
      console.error("Erreur récupération du budget :", error.message);
      return;
    }

    if (!budgetSettings || budgetSettings.length === 0) {
      setBudgetSettings([]);
      return;
    }

    // Récupérer tous les category_ids uniques
    const categoryIds = budgetSettings.map(s => s.category_id).filter(Boolean);
    
    // Récupérer les catégories correspondantes
    const { data: categories, error: categoriesError } = await supabase
      .from("budget_categories")
      .select("id, name, color")
      .in("id", categoryIds);

    if (categoriesError) {
      console.error("Erreur récupération catégories:", categoriesError);
      return;
    }

    // Créer un map pour accéder rapidement aux catégories
    const categoryMap = categories?.reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<string, { name: string; color: string }>) || {};

    // Transformation des données pour correspondre à l'interface
    const transformedData = budgetSettings.map((setting) => ({
      id: setting.id,
      percentage: setting.percentage,
      budget_categories: {
        name: categoryMap[setting.category_id]?.name || "Inconnue",
        color: categoryMap[setting.category_id]?.color || "#8884d8"
      }
    }));
    
    setBudgetSettings(transformedData);
  };
  
  // 🔹 Charger les statistiques des catégories de dépenses avec noms
  const fetchCategoryStats = async () => {
    const realMonth = selectedMonth + 1;
    const lastDay = new Date(selectedYear, realMonth, 0).getDate();

    const fromDate = `${selectedYear}-${String(realMonth).padStart(2, "0")}-01`;
    const toDate = `${selectedYear}-${String(realMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select("category_id, amount, date")
      .eq("type", "expense")
      .gte("date", fromDate)
      .lte("date", toDate);
  
    console.log("📌 Dépenses brutes récupérées :", transactionsData);
  
    if (transactionsError) {
      console.error("❌ Erreur fetch transactions:", transactionsError);
      return;
    }
  
    if (!transactionsData || transactionsData.length === 0) {
      setCategoryStats([]);
      console.log("📭 Aucune dépense catégorisée trouvée.");
      return;
    }

    const categoryMap = transactionsData.reduce((acc: Record<string, number>, t) => {
      if (!t.category_id) return acc;
      acc[t.category_id] = (acc[t.category_id] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);
  
    const categoryIds = Object.keys(categoryMap);
    if (categoryIds.length === 0) {
      setCategoryStats([]);
      console.log("📭 Aucune dépense catégorisée trouvée.");
      return;
    }
  
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("transaction_categories")
      .select("id, name")
      .in("id", categoryIds);
  
    if (categoriesError) {
      console.error("❌ Erreur fetch catégories:", categoriesError);
      return;
    }
  
    console.log("📂 Catégories récupérées :", categoriesData);
  
    if (!categoriesData) {
      setCategoryStats([]);
      return;
    }

    const categoryNameMap = categoriesData.reduce((acc: Record<string, string>, cat) => {
      acc[cat.id] = cat.name;
      return acc;
    }, {});
  
    const finalStats = Object.entries(categoryMap).map(([id, value]) => ({
      name: categoryNameMap[id] || "Inconnue",
      value: parseFloat((value as number).toFixed(1)),
    }));
  
    console.log("✅ Stats finales:", finalStats);
  
    setCategoryStats(finalStats);
  };
  
  // 🔹 Solde total
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, account) => acc + account.initial_balance, 0);
  }, [accounts]);

  // 🔹 Transactions mensuelles
  const monthlyStats = useMemo(() => {
    const filtered = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
    
    const income = filtered
      .filter((t) => t.type === "income")
      .reduce((acc, t) => acc + t.amount, 0);
  
    const expense = filtered
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => acc + t.amount, 0);
  
    return [{ month: "Ce mois", income, expense }];
  }, [transactions, selectedMonth, selectedYear]);
  
  // 🔹 Données pour le graphique de budget
  const budgetData = useMemo(() => {
    if (!budgetSettings || !Array.isArray(budgetSettings)) return [];
  
    return budgetSettings.map((setting) => ({
      name: setting.budget_categories.name,
      value: (totalIncome * setting.percentage) / 100,
      color: setting.budget_categories.color || "#8884d8",
    }));
  }, [budgetSettings, totalIncome]);

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-100 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-100 h-full">
      {/* Header avec sélecteur de langue */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="border p-2 rounded-md">
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{new Date(0, i).toLocaleString("fr-FR", { month: "long" })}</option>
            ))}
          </select>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="border p-2 rounded-md">
            {[2023, 2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <LanguageSelector />
      </div>

      {/* Grille des cartes (responsive) */}
      <div className="grid grid-cols-6 grid-rows-8 gap-6 flex-1 h-full">
        
       {/* 💰 Solde Total */}
        <div className="col-span-4 row-span-2 bg-gradient-to-br from-indigo-500 to-blue-600 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative">
          
          {/* En-tête avec Titre & Bouton Afficher Tous */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-wide">💰 Solde Total</h2>
            <button className="text-sm bg-white text-blue-600 px-3 py-1 font-semibold rounded-full shadow-md hover:bg-gray-100 transition">
              Tous les Comptes
            </button>
          </div>

          {/* 🔹 Montant Total */}
          <p className="text-5xl font-extrabold mt-4 tracking-wide drop-shadow-md">{totalBalance.toFixed(2)} €</p>

          {/* 🔹 Liste des comptes avec un carrousel horizontal */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold opacity-90">Détails par compte :</h3>
            <div className="mt-2 overflow-x-auto flex gap-4 scroll-smooth scroll-snap-x-mandatory px-1 py-2">
              
              {accounts.map((account) => (
                <div key={account.id} className="bg-white text-gray-900 min-w-[180px] p-4 rounded-xl shadow-lg flex flex-col items-center gap-2 scroll-snap-align-start">
                  
                  {/* 🔹 Icône dynamique selon le type de compte */}
                  <div className="text-2xl">
                    {account.logo_path ? (
                      <img
                        src={getImageUrl(account.logo_path)}
                        alt={account.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          // Fallback vers emoji si l'image ne charge pas
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.emoji-fallback');
                          if (fallback) {
                            (fallback as HTMLElement).style.display = 'block';
                          }
                        }}
                      />
                    ) : null}
                    <span 
                      className="emoji-fallback" 
                      style={{ display: account.logo_path ? 'none' : 'block' }}
                    >
                      {account.type === "credit_card" ? "💳" : account.type === "savings" ? "🏦" : "💼"}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-gray-500">{account.name}</span>
                  <span className="text-xl font-bold text-blue-600">{account.initial_balance.toFixed(2)} €</span>
                </div>
              ))}

            </div>
          </div>

          {/* 🔹 Variation du solde par rapport au mois précédent */}
          <div className="mt-2 flex justify-end">
            {totalBalance >= 0 ? (
              <span className="text-green-300 text-sm font-semibold flex items-center">
                📈 +5% par rapport au mois dernier
              </span>
            ) : (
              <span className="text-red-300 text-sm font-semibold flex items-center">
                📉 -3% par rapport au mois dernier
              </span>
            )}
          </div>
        </div>

  
        {/* 📅 Transactions par Semaine */}
        <div className="col-span-2 row-span-2 bg-white p-8 rounded-2xl shadow-lg flex flex-col justify-between">
          <h2 className="text-2xl font-bold text-gray-900">📅 Transactions par Semaine</h2>

          <div className="mt-6 flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyStats}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#4CAF50" name="Revenus" barSize={40} />
              <Bar dataKey="expense" fill="#FF5722" name="Dépenses" barSize={40} />
            </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

  
        {/* 📌 Dépenses par Catégorie */}
        <div className="col-span-2 row-span-2 bg-white p-6 rounded-lg shadow-md flex flex-col">
          <h2 className="text-xl font-bold mb-4 text-gray-900">📌 Dépenses par Catégorie</h2>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                dataKey="value"
                paddingAngle={3}
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={`pie-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)} €`} />
              <Legend />
            </PieChart>

            </ResponsiveContainer>
          </div>
        </div>
  
        {/* 📅 Budget Mensuel */}
        <div className="col-span-2 row-span-2 bg-white p-8 rounded-lg shadow-md flex flex-col justify-between">
            <h2 className="text-xl font-bold">📅 Budget Mensuel</h2>

            {budgetSettings && budgetSettings.length > 0 ? (
              <div className="flex flex-col items-center">
                {/* 🔹 Augmenter la taille du texte du revenu */}
                <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">
                  Revenu du Mois : {totalIncome.toFixed(2)} €
                </h3>

                {/* �� Graphique avec légende */}
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="40%" // 🔥 Positionne le graphique un peu plus haut
                      innerRadius={70}  // 🔥 Agrandi l'espace interne pour améliorer la lisibilité
                      outerRadius={100}  // 🔥 Augmente la taille du graphique
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}€` : value)} />

                    {/* 🔹 Légende sous le graphique */}
                    <Legend 
                      verticalAlign="bottom" 
                      align="center" 
                      formatter={(value, entry) => 
                        <span className="text-gray-700 font-medium">{value} : {entry.payload.value.toFixed(2)} €</span>
                      } 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-4">Aucun budget défini pour ce mois.</p>
            )}
          </div>

        {/* 💳 Dépense Moyenne par Transaction */}
        <div className="col-span-2 row-span-1 bg-white p-8 rounded-lg shadow-md flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900">💳 Dépense Moyenne</h2>

          <div className="flex flex-col items-center mt-4">
            <p className="text-4xl font-extrabold text-blue-600">
            {(() => {

              const filtered = transactions.filter((t) => {
                const date = new Date(t.date);
                return (
                  t.type === "expense" &&
                  date.getMonth() === selectedMonth &&
                  date.getFullYear() === selectedYear
                );
              });

              const total = filtered.reduce((acc, t) => acc + t.amount, 0);
              const moyenne = filtered.length > 0 ? (total / filtered.length).toFixed(1) : "0.0";
              return `${moyenne} €`;
            })()}

            </p>
            <p className="text-gray-500 text-sm">par transaction</p>
          </div>
        </div>

  
        {/* 📆 Solde du Mois */}
        <div className="col-span-2 row-span-1 bg-white p-8 rounded-lg shadow-md flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            📆 Solde du Mois
          </h2>

          <div className="flex flex-col items-center">
            {/* 🔹 Solde global du mois arrondi au dixième */}
            <p
              className={`text-4xl font-extrabold ${
                (monthlyStats[0]?.income || 0) - (monthlyStats[0]?.expense || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {((monthlyStats[0]?.income || 0) - (monthlyStats[0]?.expense || 0)).toFixed(1)} €
            </p>
            <p className="text-gray-500 text-sm">Revenus - Dépenses</p>
          </div>

          {/* 🔹 Détails des revenus et dépenses arrondis au dixième */}
          <div className="mt-4 flex justify-between text-lg">
            <div className="flex flex-col items-center">
              <span className="text-green-600 font-semibold">
                + {(monthlyStats[0]?.income || 0).toFixed(1)} €
              </span>
              <span className="text-gray-500 text-sm">Revenus</span>
            </div>
            <div className="border-l border-gray-300 h-6 mx-4"></div>
            <div className="flex flex-col items-center">
              <span className="text-red-600 font-semibold">
                - {(monthlyStats[0]?.expense || 0).toFixed(1)} €
              </span>
              <span className="text-gray-500 text-sm">Dépenses</span>
            </div>
          </div>

          {/* 🔹 Indicateur de performance */}
          <div className="mt-6">
            {(monthlyStats[0]?.income || 0) > 0 ? (
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-4 bg-gray-200 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        ((monthlyStats[0]?.income - monthlyStats[0]?.expense) / monthlyStats[0]?.income) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center">Aucune donnée pour ce mois.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );    
};

export default Dashboard;
