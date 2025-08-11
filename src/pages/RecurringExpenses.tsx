import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { FiPlusCircle, FiTrash, FiCheckCircle, FiX } from "react-icons/fi";

interface RecurringExpense {
  id: string;
  name: string;
  type: string;
  amount: number;
  frequency: string;
  start_date: string;
  next_payment_date: string;
  last_payment_date?: string;
  total_spent: number;
  status: string;
  account_id?: string;
  category_id?: string;
  accounts?: { name: string }[] | null;
  transaction_categories?: { name: string }[] | null;
}

interface Account {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const RecurringExpenses = () => {
  const [expenses, setExpenses] = useState<RecurringExpense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newExpense, setNewExpense] = useState({
    name: "",
    type: "subscription",
    amount: 0,
    frequency: "monthly",
    start_date: "",
    account_id: "",
    category_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchExpenses(),
        fetchAccounts(),
        fetchCategories()
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async ({ year, month }: { year?: string; month?: string } = {}) => {
    let query = supabase.from("recurring_expenses").select(`
      id, name, type, amount, frequency, start_date, next_payment_date, last_payment_date, total_spent, status, account_id, category_id,
      accounts (name),
      transaction_categories (name)
    `);
  
    if (year) {
      query = query.gte("start_date", `${year}-01-01`).lte("start_date", `${year}-12-31`);
    }
    if (month) {
      query = query.filter("EXTRACT(MONTH FROM start_date)", "eq", month);
    }
  
    const { data, error } = await query;
    if (!error) setExpenses(data || []);
  };
  
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("id, name");
    if (!error) setAccounts(data || []);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("transaction_categories").select("id, name");
    if (!error) setCategories(data || []);
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextPaymentDate = new Date(newExpense.start_date);
    if (newExpense.frequency === "monthly") {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    } else {
      nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
    }

    const { error } = await supabase.from("recurring_expenses").insert([
      {
        ...newExpense,
        next_payment_date: nextPaymentDate.toISOString().split("T")[0],
        status: "active",
      },
    ]);
    if (!error) {
      fetchExpenses();
      setIsModalOpen(false);
      // Réinitialiser le formulaire
      setNewExpense({
        name: "",
        type: "subscription",
        amount: 0,
        frequency: "monthly",
        start_date: "",
        account_id: "",
        category_id: "",
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette dépense récurrente ?")) return;
    const { error } = await supabase.from("recurring_expenses").delete().eq("id", id);
    if (!error) fetchExpenses();
  };

  const handleMarkAsPaid = async (expense: RecurringExpense) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedTotal = expense.total_spent + expense.amount;

    const { error } = await supabase.from("recurring_expenses").update({
      last_payment_date: today,
      total_spent: updatedTotal
    }).eq("id", expense.id);

    if (!error) fetchExpenses();
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des dépenses récurrentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">🔄 Abonnements & Dépenses Récurrentes</h1>

      <button
        className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
        onClick={() => setIsModalOpen(true)}
      >
        <FiPlusCircle /> Ajouter une dépense récurrente
      </button>

      <div className="mt-6 text-xl font-semibold">
        Total des dépenses récurrentes :{" "}
        {expenses.reduce((acc, e) => acc + e.amount, 0).toFixed(2)} €
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex gap-4 mt-6">
          <select
            onChange={(e) => {
              const year = e.target.value;
              fetchExpenses({ year });
            }}
            className="p-2 border rounded"
          >
            <option value="">Toutes les années</option>
            {[...new Set(expenses.map(e => new Date(e.start_date).getFullYear()))].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            onChange={(e) => {
              const month = e.target.value;
              fetchExpenses({ month });
            }}
            className="p-2 border rounded"
          >
            <option value="">Tous les mois</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{month.toString().padStart(2, "0")}</option>
            ))}
          </select>
        </div>

        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Montant</th>
              <th className="p-3 text-left">Fréquence</th>
              <th className="p-3 text-left">Prochain paiement</th>
              <th className="p-3 text-left">Dernier paiement</th>
              <th className="p-3 text-left">Total payé</th>
              <th className="p-3 text-left">Statut</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b">
                <td className="p-3">{expense.name}</td>
                <td className="p-3 capitalize">{expense.type === "subscription" ? "Abonnement" : "Dépense"}</td>
                <td className="p-3 font-bold">{expense.amount.toFixed(2)} €</td>
                <td className="p-3 capitalize">{expense.frequency === "monthly" ? "Mensuel" : "Annuel"}</td>
                <td className="p-3">{new Date(expense.next_payment_date).toLocaleDateString()}</td>
                <td className="p-3">{expense.last_payment_date ? new Date(expense.last_payment_date).toLocaleDateString() : "-"}</td>
                <td className="p-3 font-bold">{expense.total_spent.toFixed(2)} €</td>
                <td className={`p-3 font-bold ${expense.status === "active" ? "text-green-500" : "text-red-500"}`}>
                  {expense.status === "active" ? <FiCheckCircle /> : <FiX />}
                </td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleMarkAsPaid(expense)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <FiCheckCircle />
                  </button>

                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Ajouter une dépense récurrente</h2>
            <form onSubmit={handleAddExpense}>
              <input
                type="text"
                placeholder="Nom"
                className="w-full p-2 border rounded-lg mb-3"
                required
                value={newExpense.name}
                onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              />

              <select
                className="w-full p-2 border rounded-lg mb-3"
                value={newExpense.type}
                onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
              >
                <option value="subscription">Abonnement</option>
                <option value="expense">Dépense</option>
              </select>

              <input
                type="number"
                placeholder="Montant (€)"
                className="w-full p-2 border rounded-lg mb-3"
                required
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
              />

              <select
                className="w-full p-2 border rounded-lg mb-3"
                value={newExpense.frequency}
                onChange={(e) => setNewExpense({ ...newExpense, frequency: e.target.value })}
              >
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
              </select>

              <input
                type="date"
                className="w-full p-2 border rounded-lg mb-3"
                required
                value={newExpense.start_date}
                onChange={(e) => setNewExpense({ ...newExpense, start_date: e.target.value })}
              />

              <select
                className="w-full p-2 border rounded-lg mb-3"
                required
                value={newExpense.account_id}
                onChange={(e) => setNewExpense({ ...newExpense, account_id: e.target.value })}
              >
                <option value="">Sélectionner un compte</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 border rounded-lg mb-3"
                value={newExpense.category_id}
                onChange={(e) => setNewExpense({ ...newExpense, category_id: e.target.value })}
              >
                <option value="">Sélectionner une catégorie (facultatif)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg">
                Ajouter
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringExpenses;
