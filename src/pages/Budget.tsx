import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4CAF50", "#FF9800", "#2196F3"]; // Couleurs pour chaque budget

const Budget = () => {
  const [income, setIncome] = useState(0);
  const [budgetVie] = useState(50);
  const [budgetLoisir] = useState(20);
  const [budgetInvestissement] = useState(30);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchTotalIncome(); // Récupérer les revenus en fonction des transactions
  }, [selectedMonth, selectedYear]);

  const fetchTotalIncome = async () => {
    const { data: incomes, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("type", "income")
      .gte("date", `${selectedYear}-${selectedMonth}-01`)
      .lte("date", `${selectedYear}-${selectedMonth}-31`);

    if (error) {
      console.error("Erreur récupération revenus :", error.message);
      return;
    }

    // Calcul du revenu total du mois
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    setIncome(totalIncome);

    console.log(`💰 Revenu total calculé pour ${selectedMonth}/${selectedYear} : ${totalIncome}€`);
  };

  // Préparation des données pour le graphique en fonction du revenu du mois
  const budgetData = [
    { name: "Budget Vie", value: (income * budgetVie) / 100 },
    { name: "Budget Loisirs & Shopping", value: (income * budgetLoisir) / 100 },
    { name: "Budget Investissement", value: (income * budgetInvestissement) / 100 },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📊 Budget Mensuel</h1>

      {/* Sélecteur de mois et année */}
      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded-lg"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>
              {new Date(0, month - 1).toLocaleString("fr-FR", { month: "long" })}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded-lg"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          {[2023, 2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Affichage des revenus et budgets */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-200 text-gray-900 p-4 rounded-lg shadow-md text-center font-semibold">
          💰 Revenu du mois : {income.toFixed(2)} €
        </div>
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md text-center font-semibold">
          🏠 Budget Vie : {(income * budgetVie / 100).toFixed(2)} € ({budgetVie}%)
        </div>
        <div className="bg-orange-100 text-orange-800 p-4 rounded-lg shadow-md text-center font-semibold">
          🎉 Budget Loisirs : {(income * budgetLoisir / 100).toFixed(2)} € ({budgetLoisir}%)
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md text-center font-semibold">
          📈 Budget Investissement : {(income * budgetInvestissement / 100).toFixed(2)} € ({budgetInvestissement}%)
        </div>
      </div>

      {/* Diagramme circulaire amélioré avec légende */}
      <div className="flex flex-col items-center my-10 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Répartition du Budget</h2>

        <div className="w-full flex flex-col items-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={140} // 🔥 Ajustement pour améliorer la lisibilité
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(2)} €`} // 🔥 Ajout des labels directement sur le graphique
              >
                {budgetData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}€` : value)} />
              <Legend verticalAlign="bottom" height={36} /> {/* 🔥 Légende affichée sous le graphique */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Budget;
