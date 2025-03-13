import { useEffect, useState, useMemo } from "react";
import { supabase } from "../utils/supabase";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#FF5722", "#9C27B0"];

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgetSettings, setBudgetSettings] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
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
    const totalIncome = data.reduce((sum, t) => sum + t.amount, 0);
    console.log(`💰 Revenu total calculé pour ${currentMonth}/${currentYear} : ${totalIncome}€`);
  
    // Mise à jour de l'état du budget
    setBudgetSettings({
      income: totalIncome,
      budget_vie_percent: 50, // Valeur par défaut ou issue d'un réglage utilisateur
      budget_loisir_percent: 20,
      budget_investissement_percent: 30,
    });
  };
  
  
  

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
    fetchBudgetSettings();
    fetchCategoryStats();
    fetchIncomeForBudget(); // 🔥 Récupération des revenus depuis transactions
  }, []);
  

  // 🔹 Charger les comptes
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("id, name, initial_balance");
    if (!error) setAccounts(data);
  };

  const weeklyStats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    
    // Fonction pour récupérer la semaine du mois
    const getWeekOfMonth = (date: Date) => {
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      return Math.ceil((date.getDate() + firstDay.getDay()) / 7);
    };
  
    const grouped = transactions.reduce((acc, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate.getMonth() !== currentMonth) return acc;
  
      const week = getWeekOfMonth(transactionDate);
  
      if (!acc[week]) {
        acc[week] = { week: `Semaine ${week}`, income: 0, expense: 0 };
      }
  
      if (transaction.type === "income") {
        acc[week].income += transaction.amount;
      } else if (transaction.type === "expense") {
        acc[week].expense += transaction.amount;
      }
  
      return acc;
    }, {});
  
    return Object.values(grouped);
  }, [transactions]);
  

  // 🔹 Charger les transactions
  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });
    if (!error) setTransactions(data);
  };

  // 🔹 Charger les paramètres de budget du mois
  const fetchBudgetSettings = async () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const { data, error } = await supabase
      .from("budget_settings")
      .select("*")
      .eq("month", currentMonth)
      .eq("year", currentYear)
      .limit(1)
      .single();

    if (!error) setBudgetSettings(data);
  };

  // 🔹 Charger les statistiques des catégories de dépenses avec noms
  const fetchCategoryStats = async () => {
    const { data: transactionsData, error: transactionsError } = await supabase
      .from("transactions")
      .select("category_id, amount")
      .eq("type", "expense");
  
    if (transactionsError) return;
  
    const categoryMap = transactionsData.reduce((acc: { [key: string]: number }, transaction) => {
      acc[transaction.category_id] = (acc[transaction.category_id] || 0) + transaction.amount;
      return acc;
    }, {});
  
    const categoryIds = Object.keys(categoryMap);
    if (categoryIds.length === 0) return;
  
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("transaction_categories")
      .select("id, name")
      .in("id", categoryIds);
  
    if (categoriesError) return;
  
    const categoryNameMap = categoriesData.reduce((acc: { [key: string]: string }, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  
    setCategoryStats(
      Object.entries(categoryMap).map(([id, value]) => ({
        name: categoryNameMap[id] || "Inconnu",
        value: parseFloat(value.toFixed(1)), // 🔹 Arrondi au dixième
      }))
    );
  };


  // 🔹 Solde total
  const totalBalance = useMemo(() => {
    return accounts.reduce((acc, account) => acc + account.initial_balance, 0);
  }, [accounts]);

  // 🔹 Transactions mensuelles
  const monthlyStats = useMemo(() => {
    const income = transactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0);

    return [{ month: "Ce mois", income, expense }];
  }, [transactions]);

  // 🔹 Données pour le graphique de budget
  const budgetData = useMemo(() => {
    if (!budgetSettings || budgetSettings.income === 0) return [];
    return [
      { name: "Budget Vie", value: (budgetSettings.income * budgetSettings.budget_vie_percent) / 100 },
      { name: "Budget Loisirs", value: (budgetSettings.income * budgetSettings.budget_loisir_percent) / 100 },
      { name: "Budget Investissement", value: (budgetSettings.income * budgetSettings.budget_investissement_percent) / 100 },
    ];
  }, [budgetSettings]);

    return (
      <div className="flex-1 p-6 bg-gray-100 h-full">
    
        {/* Grille des cartes (responsive) */}
        <div className="grid grid-cols-6 grid-rows-8 gap-6 flex-1 h-full">
          
          {/* 💰 Solde Total */}
          <div className="col-span-4 row-span-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg flex flex-col justify-between relative">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">💰 Solde Total</h2>
              <span className="bg-white text-blue-600 px-3 py-1 text-xs font-semibold rounded-full">
                {accounts.length} Comptes
              </span>
            </div>
            <p className="text-5xl font-extrabold mt-4">{totalBalance.toFixed(2)} €</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Détails par compte :</h3>
              <ul className="mt-2 space-y-1">
                {accounts.map((account) => (
                  <li key={account.id} className="flex justify-between text-sm opacity-90">
                    <span>{account.name}</span>
                    <span className="font-bold">{account.initial_balance.toFixed(2)} €</span>
                  </li>
                ))}
              </ul>
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
                    {categoryStats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

              {budgetSettings ? (
                <div className="flex flex-col items-center">
                  {/* 🔹 Augmenter la taille du texte du revenu */}
                  <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">
                    Revenu du Mois : {budgetSettings.income.toFixed(2)} €
                  </h3>

                  {/* 🔹 Graphique avec légende */}
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
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
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
                {transactions.length > 0
                  ? (transactions
                      .filter((t) => t.type === "expense")
                      .reduce((acc, t) => acc + t.amount, 0) / transactions.length
                    ).toFixed(1)
                  : "0.0"} €
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
