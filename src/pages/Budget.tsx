import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const getLastDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

interface BudgetData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

interface BudgetSetting {
  percentage: number;
  category_id: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  color: string;
}

const Budget = () => {
  const [income, setIncome] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState<BudgetData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotalIncome();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (income > 0) {
      fetchBudgetCategories();
    } else {
      setCategories([]);
    }
  }, [income, selectedMonth, selectedYear]);

  const fetchTotalIncome = async () => {
    setLoading(true);
    const lastDay = getLastDayOfMonth(selectedYear, selectedMonth);
    const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
    const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${lastDay}`;

    const { data: incomes, error } = await supabase
      .from("transactions")
      .select("amount")
      .eq("type", "income")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      console.error("Erreur récupération revenus :", error.message);
      setLoading(false);
      return;
    }

    const totalIncome = incomes?.reduce((sum, income) => sum + income.amount, 0) || 0;
    setIncome(totalIncome);
    setLoading(false);
  };

  const fetchBudgetCategories = async () => {
    // D'abord, récupérer les budget_settings
    const { data: budgetSettings, error } = await supabase
      .from("budget_settings")
      .select("percentage, category_id")
      .eq("month", selectedMonth)
      .eq("year", selectedYear);
  
    if (!error && budgetSettings && budgetSettings.length === 0) {
      // Appel auto duplication depuis mois précédent
      const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
  
      const { error: funcError } = await supabase.rpc("duplicate_budget_settings", {
        from_month: prevMonth,
        from_year: prevYear,
        to_month: selectedMonth,
        to_year: selectedYear,
      });
  
      if (!funcError) {
        // Re-fetch après duplication
        const { data: newBudgetSettings, error: newError } = await supabase
          .from("budget_settings")
          .select("percentage, category_id")
          .eq("month", selectedMonth)
          .eq("year", selectedYear);
  
        if (!newError && newBudgetSettings) {
          await processBudgetSettings(newBudgetSettings);
        }
      }
    } else if (budgetSettings) {
      await processBudgetSettings(budgetSettings);
    }
  };

  const processBudgetSettings = async (settings: BudgetSetting[]) => {
    // Récupérer tous les category_ids uniques
    const categoryIds = settings.map(s => s.category_id).filter(Boolean);
    
    if (categoryIds.length === 0) {
      setCategories([]);
      return;
    }

    // Récupérer les catégories correspondantes
    const { data: categories, error } = await supabase
      .from("budget_categories")
      .select("id, name, color")
      .in("id", categoryIds);

    if (error) {
      console.error("Erreur récupération catégories:", error);
      return;
    }

    // Créer un map pour accéder rapidement aux catégories
    const categoryMap = categories?.reduce((acc, cat: BudgetCategory) => {
      acc[cat.id] = cat;
      return acc;
    }, {} as Record<string, BudgetCategory>) || {};

    // Formater les données
    const formatted = settings.map((setting) => {
      const category = categoryMap[setting.category_id];
      return {
        name: category?.name || "Inconnue",
        value: income * (setting.percentage / 100),
        percentage: setting.percentage,
        color: category?.color || "#8884d8",
      };
    });

    setCategories(formatted);
  };

  const totalBudgetPercent = categories.reduce((acc, cat) => acc + cat.percentage, 0);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du budget...</p>
        </div>
      </div>
    );
  }

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
        {categories.map((cat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow-md text-center font-semibold"
            style={{ backgroundColor: cat.color + "22", color: cat.color }}
          >
            {cat.name} : {cat.value.toFixed(2)} € ({cat.percentage}%)
          </div>
        ))}
      </div>

      {/* Diagramme circulaire amélioré avec légende */}
      <div className="flex flex-col items-center my-10 w-full">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Répartition du Budget</h2>

        <div className="w-full flex flex-col items-center">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value.toFixed(2)} €`}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}€` : value)} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optionnel : alerte si le total ≠ 100% */}
      {totalBudgetPercent !== 100 && (
        <p className="text-red-600 font-semibold text-center">
          ⚠️ La somme des pourcentages est de {totalBudgetPercent}% (devrait être 100%)
        </p>
      )}
    </div>
  );
};

export default Budget;
