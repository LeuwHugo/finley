import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("accounts");
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState({ name: "", type: "expense" });
  const [creditCategories, setCreditCategories] = useState([]);
  const [newCreditCategory, setNewCreditCategory] = useState(""); // Pour l'ajout

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
    fetchCurrencies();
    fetchCreditCategories(); // 🔹 Récupérer les catégories de crédits

  }, []);

  // 🔹 Filtrer les catégories par nom et type
const filteredCategories = categories.filter(category =>
  category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (filterType ? category.type === filterType : true)
);

const addCreditCategory = async () => {
  if (!newCreditCategory.trim()) return;
  const { error } = await supabase.from("credit_categories").insert([{ name: newCreditCategory }]);
  if (!error) {
    setNewCreditCategory(""); // Réinitialiser l'input
    fetchCreditCategories(); // Recharger les catégories
  }
};

const deleteCreditCategory = async (id: number) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie de crédit ?")) return;
  const { error } = await supabase.from("credit_categories").delete().eq("id", id);
  if (!error) fetchCreditCategories(); // Rafraîchir la liste
};

const fetchCreditCategories = async () => {
  const { data, error } = await supabase.from("credit_categories").select("*");
  if (!error) setCreditCategories(data);
};

// 🔹 Ajouter une Nouvelle Catégorie
const addCategory = async () => {
  if (!newCategory.name.trim()) return;
  const { error } = await supabase.from("transaction_categories").insert([newCategory]);
  if (!error) {
    setNewCategory({ name: "", type: "expense" });
    fetchCategories(); // Rafraîchir les catégories
  }
};

// 🔹 Modifier une catégorie existante
const updateCategory = async () => {
  if (!editingCategory || !updatedCategory.name.trim()) return;
  const { error } = await supabase
    .from("transaction_categories")
    .update(updatedCategory)
    .eq("id", editingCategory.id);
  if (!error) {
    setEditingCategory(null);
    setUpdatedCategory({ name: "", type: "expense" });
    fetchCategories(); // Rafraîchir les catégories
  }
};

// 🔹 Supprimer une catégorie
const deleteCategory = async (id: number) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
  const { error } = await supabase.from("transaction_categories").delete().eq("id", id);
  if (!error) fetchCategories(); // Rafraîchir les catégories
};

  // 🔹 Charger les Comptes
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("*");
    if (!error) setAccounts(data);
  };

  // 🔹 Charger les Catégories de Transactions
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("transaction_categories").select("*");
    if (!error) setCategories(data);
  };

  // 🔹 Charger les Devises
  const fetchCurrencies = async () => {
    const { data, error } = await supabase.from("currencies").select("*");
    if (!error) setCurrencies(data);
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">⚙️ Paramètres</h1>

      {/* Navigation des onglets */}
      <div className="flex space-x-4 border-b pb-3">
        <button onClick={() => setActiveTab("accounts")} className={`py-2 px-4 ${activeTab === "accounts" ? "border-b-2 border-blue-500" : ""}`}>Comptes</button>
        <button onClick={() => setActiveTab("categories")} className={`py-2 px-4 ${activeTab === "categories" ? "border-b-2 border-blue-500" : ""}`}>Catégories de Transactions</button>
        <button onClick={() => setActiveTab("currencies")} className={`py-2 px-4 ${activeTab === "currencies" ? "border-b-2 border-blue-500" : ""}`}>Devises</button>
        <button onClick={() => setActiveTab("credit_categories")} className={`py-2 px-4 ${activeTab === "credit_categories" ? "border-b-2 border-blue-500" : ""}`}>Catégories de Crédits</button>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {activeTab === "accounts" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">🏦 Gestion des Comptes</h2>
            <ul>
              {accounts.map((account) => (
                <li key={account.id} className="border p-2 rounded-md my-2">
                  {account.name} - {account.type} - {account.initial_balance} €
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "categories" && (
          <div>
          <h2 className="text-xl font-semibold mb-4">📂 Catégories de Transactions</h2>
        
          {/* Barre de Recherche et Filtres */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-md w-1/2"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border p-2 rounded-md w-1/3"
            >
              <option value="">Tous les types</option>
              <option value="income">Revenu</option>
              <option value="expense">Dépense</option>
              <option value="transfer">Transfert</option>
            </select>
          </div>
        
          {/* Formulaire d'Ajout / Modification */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Nom de la catégorie"
              value={editingCategory ? updatedCategory.name : newCategory.name}
              onChange={(e) => {
                if (editingCategory) setUpdatedCategory({ ...updatedCategory, name: e.target.value });
                else setNewCategory({ ...newCategory, name: e.target.value });
              }}
              className="border p-2 rounded-md w-1/2"
            />
            <select
              value={editingCategory ? updatedCategory.type : newCategory.type}
              onChange={(e) => {
                if (editingCategory) setUpdatedCategory({ ...updatedCategory, type: e.target.value });
                else setNewCategory({ ...newCategory, type: e.target.value });
              }}
              className="border p-2 rounded-md w-1/3"
            >
              <option value="income">Revenu</option>
              <option value="expense">Dépense</option>
              <option value="transfer">Transfert</option>
            </select>
            {editingCategory ? (
              <button onClick={updateCategory} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                Modifier
              </button>
            ) : (
              <button onClick={addCategory} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Ajouter
              </button>
            )}
          </div>
        
          {/* Liste des Catégories */}
          <ul className="space-y-2">
            {filteredCategories.map((category) => (
              <li key={category.id} className="flex justify-between border p-2 rounded-md">
                <span>
                  {category.name} - <span className="italic text-gray-500">{category.type}</span>
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setUpdatedCategory({ name: category.name, type: category.type });
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        )}

        {activeTab === "credit_categories" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">🏦 Catégories de Crédits</h2>

            {/* Formulaire d'Ajout */}
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Nouvelle catégorie"
                value={newCreditCategory}
                onChange={(e) => setNewCreditCategory(e.target.value)}
                className="border p-2 rounded-md w-2/3"
              />
              <button onClick={addCreditCategory} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                Ajouter
              </button>
            </div>

            {/* Liste des Catégories */}
            <ul className="space-y-2">
              {creditCategories.map((category) => (
                <li key={category.id} className="flex justify-between border p-2 rounded-md">
                  <span>{category.name}</span>
                  <button
                    onClick={() => deleteCreditCategory(category.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    🗑️ Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}


        {activeTab === "currencies" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">💱 Devises</h2>
            <ul>
              {currencies.map((currency) => (
                <li key={currency.id} className="border p-2 rounded-md my-2">
                  {currency.name} ({currency.symbol}) - {currency.code}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
