import { useEffect, useState, useMemo } from "react";
import { supabase } from "../utils/supabase";
import { FiArrowUpRight, FiArrowDownLeft, FiRepeat, FiFilter, FiXCircle } from "react-icons/fi";

interface Transaction {
  id: string;
  date: string;
  name: string;
  type: string;
  amount: number;
  recurring: boolean;
  recurring_type?: string;
  created_at: string;
  account_id?: string;
  category_id?: string;
  related_account_id?: string;
  transfer_type?: string;
  accounts?: { id: string; name: string };
  related_accounts?: { id: string; name: string };
  transaction_categories?: { id: string; name: string };
}

interface Account {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface RawTransactionData {
  id: string;
  date: string;
  name: string;
  type: string;
  amount: number;
  recurring: boolean;
  recurring_type?: string;
  created_at: string;
  account_id?: string;
  category_id?: string;
  related_account_id?: string;
  transfer_type?: string;
  accounts?: { id: string; name: string }[] | null;
  related_accounts?: { id: string; name: string }[] | null;
  transaction_categories?: { id: string; name: string }[] | null;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterType, setFilterType] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [newTransaction, setNewTransaction] = useState({
    name: "",
    type: "income",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    account_id: "",
    category_id: "",
    related_account_id: "",
    transfer_type: "",
    recurring: false,
    recurring_type: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTransactions(),
        fetchAccounts(),
        fetchCategories()
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(`
        id, date, name, type, amount, recurring, recurring_type, created_at,
        accounts:account_id (id, name), 
        related_accounts:related_account_id (id, name), 
        transaction_categories (id, name)
      `);
  
    if (error) {
      console.error("Erreur chargement transactions :", error.message);
      return;
    }
    
    // Transformation des données pour correspondre à l'interface
    const transformedData = data?.map((item: RawTransactionData) => ({
      id: item.id,
      date: item.date,
      name: item.name,
      type: item.type,
      amount: item.amount,
      recurring: item.recurring,
      recurring_type: item.recurring_type,
      created_at: item.created_at,
      account_id: item.account_id,
      category_id: item.category_id,
      related_account_id: item.related_account_id,
      transfer_type: item.transfer_type,
      accounts: item.accounts?.[0] || null,
      related_accounts: item.related_accounts?.[0] || null,
      transaction_categories: item.transaction_categories?.[0] || null
    })) || [];
    
    setTransactions(transformedData);
  };

  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("id, name");
    if (error) {
      console.error("Erreur chargement comptes :", error.message);
      return;
    }
    setAccounts(data || []);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("transaction_categories").select("id, name");
    if (error) {
      console.error("Erreur chargement catégories :", error.message);
      return;
    }
    setCategories(data || []);
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          (filterType ? transaction.type === filterType : true) &&
          (filterAccount ? transaction.accounts?.id === filterAccount : true) &&
          (filterCategory ? transaction.transaction_categories?.id === filterCategory : true) &&
          (filterYear ? transactionDate.getFullYear() === filterYear : true) &&
          (filterMonth ? (transactionDate.getMonth() + 1).toString() === filterMonth : true) &&
          (filterDay ? transactionDate.getDate().toString() === filterDay : true)
        );
      })
      .sort((a, b) => {
        return sortOrder === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [transactions, filterType, filterAccount, filterCategory, filterYear, filterMonth, filterDay, sortOrder]);
  
  const handleDeleteTransaction = async (transactionId: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette transaction ?")) return;
  
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId);
  
    if (error) {
      console.error("Erreur suppression transaction :", error.message);
    } else {
      // Mise à jour de l'état au lieu de recharger la page
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewTransaction({
      name: transaction.name,
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date.split("T")[0],
      account_id: transaction.account_id || transaction.accounts?.id || "",
      category_id: transaction.category_id || transaction.transaction_categories?.id || "",
      related_account_id: transaction.related_account_id || "",
      transfer_type: transaction.transfer_type || "",
      recurring: transaction.recurring,
      recurring_type: transaction.recurring ? transaction.recurring_type || "" : "",
    });
    setIsModalOpen(true);
  };

  const handleUpdateTransaction = async () => {
    if (!selectedTransaction) return;
  
    const transactionData = {
      name: newTransaction.name,
      type: newTransaction.type,
      amount: newTransaction.amount,
      date: newTransaction.date,
      account_id: newTransaction.account_id || null,
      category_id: newTransaction.category_id || null,
      related_account_id: newTransaction.type === "transfer" ? newTransaction.related_account_id || null : null,
      transfer_type: newTransaction.type === "transfer" ? newTransaction.transfer_type || null : null,
      recurring: newTransaction.recurring,
      recurring_type: newTransaction.recurring ? newTransaction.recurring_type : null,
    };
  
    const { error } = await supabase
      .from("transactions")
      .update(transactionData)
      .eq("id", selectedTransaction.id);
  
    if (error) {
      console.error("Erreur mise à jour transaction :", error.message);
    } else {
      // Mise à jour de l'état au lieu de recharger la page
      setTransactions(prev => prev.map(t => 
        t.id === selectedTransaction.id 
          ? { ...t, ...transactionData }
          : t
      ));
      setIsModalOpen(false);
      setSelectedTransaction(null);
    }
  };
  
  const handleAddTransaction = async () => {
    const transactionData = {
      name: newTransaction.name,
      type: newTransaction.type,
      amount: newTransaction.amount,
      date: newTransaction.date,
      recurring: newTransaction.recurring,
      recurring_type: newTransaction.recurring ? newTransaction.recurring_type : null,
      account_id: newTransaction.account_id || null,
      category_id: newTransaction.category_id || null,
      related_account_id: newTransaction.type === "transfer" ? newTransaction.related_account_id || null : null,
      transfer_type: newTransaction.type === "transfer" ? newTransaction.transfer_type || null : null,
    };
  
    const { data, error } = await supabase.from("transactions").insert([transactionData]).select();
  
    if (error) {
      console.error("Erreur ajout transaction :", error.message);
    } else {
      // Mise à jour de l'état au lieu de recharger la page
      if (data && data[0]) {
        setTransactions(prev => [data[0] as Transaction, ...prev]);
      }
      setIsModalOpen(false);
      // Réinitialiser le formulaire
      setNewTransaction({
        name: "",
        type: "income",
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        account_id: "",
        category_id: "",
        related_account_id: "",
        transfer_type: "",
        recurring: false,
        recurring_type: "",
      });
    }
  };

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

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900">📜 Transactions</h1>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:scale-105 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-xl"
          onClick={() => {
            setSelectedTransaction(null);
            setNewTransaction({
              name: "",
              type: "income",
              amount: 0,
              date: new Date().toISOString().slice(0, 10),
              account_id: "",
              category_id: "",
              related_account_id: "",
              transfer_type: "",
              recurring: false,
              recurring_type: "",
            });
            setIsModalOpen(true);
          }}
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
      <p className="text-sm text-gray-600 mb-2">📅 Les paiements à venir sont mis en évidence en jaune.</p>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border rounded-lg">
        <thead className="bg-gray-200 text-gray-700">
  <tr className="text-left">
    <th className="p-3">Type</th>
    <th className="p-3">Nom</th>
    <th className="p-3">Compte</th>
    <th className="p-3">Montant</th>
    <th className="p-3">Catégorie</th>
    <th className="p-3 text-center cursor-pointer hover:bg-gray-300" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
        📅 Date {sortOrder === "asc" ? "🔼" : "🔽"}
    </th>
    <th className="p-3 text-center">Actions</th>
  </tr>
</thead>
<tbody>
  {filteredTransactions.map((transaction) => (
   <tr key={transaction.id} 
   className={`border-t hover:bg-gray-50 ${new Date(transaction.date) > today ? "bg-yellow-100 font-semibold" : ""}`}>
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
      <td className="p-3 flex gap-2 justify-center">
        <button 
          className="text-blue-500 hover:text-blue-700"
          onClick={() => handleEditTransaction(transaction)}
        >
          ✏️
        </button>
        <button 
          className="text-red-500 hover:text-red-700"
          onClick={() => handleDeleteTransaction(transaction.id)}
        >
          🗑️
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
  
      {/* Popup "En cours de développement" */}
      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">
        {selectedTransaction ? "Modifier la transaction" : "Ajouter une transaction"}
      </h2>

      {/* Nom de la transaction */}
      <input
        type="text"
        placeholder="Nom de la transaction"
        className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
        value={newTransaction.name}
        onChange={(e) => setNewTransaction({ ...newTransaction, name: e.target.value })}
      />

      {/* Type de transaction */}
      <select
        className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
        value={newTransaction.type}
        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
      >
        <option value="income">Revenu</option>
        <option value="expense">Dépense</option>
        <option value="transfer">Transfert</option>
      </select>

      {/* Montant */}
      <input
        type="number"
        placeholder="Montant"
        className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
        value={newTransaction.amount}
        onChange={(e) => setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })}
      />

      {/* Date */}
      <input
        type="date"
        className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
        value={newTransaction.date}
        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
      />

      {/* Sélection du compte */}
      <select
        className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
        value={newTransaction.account_id}
        onChange={(e) => setNewTransaction({ ...newTransaction, account_id: e.target.value })}
      >
        <option value="">Sélectionner un compte</option>
        {accounts.map((account) => (
          <option key={account.id} value={account.id}>{account.name}</option>
        ))}
      </select>

      {/* Sélection de la catégorie */}
      <select
        className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
        value={newTransaction.category_id}
        onChange={(e) => setNewTransaction({ ...newTransaction, category_id: e.target.value })}
      >
        <option value="">Sélectionner une catégorie</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>

      {/* Sélection du compte cible (uniquement pour les transferts) */}
      {newTransaction.type === "transfer" && (
        <select
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          value={newTransaction.related_account_id}
          onChange={(e) => setNewTransaction({ ...newTransaction, related_account_id: e.target.value })}
        >
          <option value="">Sélectionner le compte cible</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
      )}

        {/* Sélection du type de transfert */}
        {newTransaction.type === "transfer" && (
          <select
            className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
            value={newTransaction.transfer_type}
            onChange={(e) => setNewTransaction({ ...newTransaction, transfer_type: e.target.value })}
          >
            <option value="">Type de transfert</option>
            <option value="saving">Épargne</option>
            <option value="investing">Investissement</option>
            <option value="moving">Déplacement de fonds</option>
            <option value="funding">Financement</option>
          </select>
        )}

      {/* Checkbox pour transaction récurrente */}
      <div className="flex items-center mb-3">
        <input
          type="checkbox"
          checked={newTransaction.recurring}
          onChange={(e) => setNewTransaction({ ...newTransaction, recurring: e.target.checked })}
        />
        <span className="ml-2">Transaction récurrente</span>
      </div>

      {/* Sélection de la fréquence (si récurrente) */}
      {newTransaction.recurring && (
        <select
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          value={newTransaction.recurring_type}
          onChange={(e) => setNewTransaction({ ...newTransaction, recurring_type: e.target.value })}
        >
          <option value="">Fréquence</option>
          <option value="monthly">Mensuelle</option>
          <option value="yearly">Annuelle</option>
        </select>
      )}

      {/* Boutons */}
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          onClick={() => setIsModalOpen(false)}
        >
          Annuler
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          onClick={selectedTransaction ? handleUpdateTransaction : handleAddTransaction}
        >
          {selectedTransaction ? "Modifier" : "Ajouter"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
  
};

export default Transactions;
