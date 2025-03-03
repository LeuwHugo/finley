import { useEffect, useState, useMemo } from "react";
import { supabase } from "../utils/supabase";
import { FiArrowUpRight, FiArrowDownLeft, FiRepeat, FiFilter, FiXCircle } from "react-icons/fi";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          id, date, name, type, amount, recurring, recurring_type, created_at,
          accounts:account_id (id, name), 
          related_accounts:related_account_id (id, name), 
          transaction_categories (id, name)
        `);
    
      if (error) console.error("Erreur chargement transactions :", error.message);
      else setTransactions(data);
    };

    const fetchAccounts = async () => {
      const { data, error } = await supabase.from("accounts").select("id, name");
      if (error) console.error("Erreur chargement comptes :", error.message);
      else setAccounts(data);
    };

    const fetchCategories = async () => {
      const { data, error } = await supabase.from("transaction_categories").select("id, name");
      if (error) console.error("Erreur chargement catégories :", error.message);
      else setCategories(data);
    };

    fetchTransactions();
    fetchAccounts();
    fetchCategories();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        (filterType ? transaction.type === filterType : true) &&
        (filterAccount ? transaction.accounts?.id === filterAccount : true) && // Correction ici
        (filterCategory ? transaction.transaction_categories?.id === filterCategory : true) &&
        (filterYear ? transactionDate.getFullYear() === filterYear : true) &&
        (filterMonth ? (transactionDate.getMonth() + 1).toString() === filterMonth : true) &&
        (filterDay ? transactionDate.getDate().toString() === filterDay : true)
      );
    });
  }, [transactions, filterType, filterAccount, filterCategory, filterYear, filterMonth, filterDay]);
  

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") acc.income += transaction.amount;
        if (transaction.type === "expense") acc.expense += transaction.amount;
        if (transaction.type === "transfer") acc.transfer += transaction.amount;
        return acc;
      },
      { income: 0, expense: 0, transfer: 0 }
    );
  }, [filteredTransactions]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">📜 Transactions</h1>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-xl"
          onClick={() => setIsModalOpen(true)}
        >
          ➕ Ajouter une transaction
        </button>
      </div>
  
      {/* Filtres */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4">
        <FiFilter className="text-gray-600 text-2xl" />
  
        <select className="p-2 border rounded-lg bg-gray-50" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Tous les types</option>
          <option value="income">Revenus</option>
          <option value="expense">Dépenses</option>
          <option value="transfer">Transferts</option>
        </select>
  
        <select className="p-2 border rounded-lg bg-gray-50" value={filterAccount} onChange={(e) => setFilterAccount(e.target.value)}>
          <option value="">Tous les comptes</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
  
        <select className="p-2 border rounded-lg bg-gray-50" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
  
        <select className="p-2 border rounded-lg bg-gray-50" value={filterYear} onChange={(e) => setFilterYear(parseInt(e.target.value))}>
          {[2022, 2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
  
        <select className="p-2 border rounded-lg bg-gray-50" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">Tous les mois</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <option key={month} value={month}>{new Date(0, month - 1).toLocaleString('fr-FR', { month: 'long' })}</option>
          ))}
        </select>
  
        <select className="p-2 border rounded-lg bg-gray-50" value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
          <option value="">Tous les jours</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
  
        <button className="bg-red-500 text-white p-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
          onClick={() => { setFilterType(""); setFilterAccount(""); setFilterCategory(""); setFilterYear(new Date().getFullYear()); setFilterMonth(""); setFilterDay(""); }}>
          <FiXCircle /> Réinitialiser
        </button>
      </div>
  
      {/* Totaux */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-md text-center font-semibold">
          📈 Total Revenus : {totals.income.toFixed(2)} €
        </div>
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-md text-center font-semibold">
          📉 Total Dépenses : {totals.expense.toFixed(2)} €
        </div>
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow-md text-center font-semibold">
          🔄 Total Transferts : {totals.transfer.toFixed(2)} €
        </div>
      </div>
  
      {/* Tableau */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr className="text-left">
              <th className="p-3">Type</th>
              <th className="p-3">Nom</th>
              <th className="p-3">Compte</th>
              <th className="p-3">Montant</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-semibold flex items-center gap-2">
                  {transaction.type === "income" && <FiArrowDownLeft className="text-green-600" />}
                  {transaction.type === "expense" && <FiArrowUpRight className="text-red-600" />}
                  {transaction.type === "transfer" && <FiRepeat className="text-blue-600" />}
                  {transaction.type}
                </td>
                <td className="p-3">{transaction.name}</td>
                <td className="p-3">{transaction.accounts?.name}</td>
                <td className="p-3 font-bold">{transaction.amount} €</td>
                <td className="p-3">{transaction.transaction_categories?.name}</td>
                <td className="p-3">{new Date(transaction.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* Popup "En cours de développement" */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">🚧 En cours de développement 🚧</h2>
            <p>Cette fonctionnalité est en cours de construction.</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onClick={() => setIsModalOpen(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Transactions;
