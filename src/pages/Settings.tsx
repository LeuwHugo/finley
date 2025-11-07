import { useState, useEffect } from "react";
import { supabase, getImageUrl, ensureLogosBucket } from "../utils/supabase";
import { useLanguage } from "../components/LanguageProvider";

interface Account {
  id: string;
  name: string;
  type: string;
  initial_balance: number;
}

interface Category {
  id: string;
  name: string;
  type: string;
}

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
}

interface CreditCategory {
  id: string;
  name: string;
}

interface BudgetCategory {
  id: string;
  name: string;
  color: string;
}

interface BudgetSetting {
  id: string;
  percentage: number;
  budget_categories: {
    name: string;
    color: string;
  };
}

const Settings = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("accounts");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", type: "expense" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [updatedCategory, setUpdatedCategory] = useState({ name: "", type: "expense" });
  const [creditCategories, setCreditCategories] = useState<CreditCategory[]>([]);
  const [newCreditCategory, setNewCreditCategory] = useState("");
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [budgetSettings, setBudgetSettings] = useState<BudgetSetting[]>([]);
  const [selectedBudgetMonth, setSelectedBudgetMonth] = useState(new Date().getMonth() + 1);
  const [selectedBudgetYear, setSelectedBudgetYear] = useState(new Date().getFullYear());
  const [newBudgetCategory, setNewBudgetCategory] = useState({ name: "", color: "#8884d8" });
  const [newSetting, setNewSetting] = useState({ category_id: "", percentage: 0 });
  const [loading, setLoading] = useState(true);
  const [logos, setLogos] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "budget_categories") {
      fetchBudgetSettings();
    }
  }, [selectedBudgetMonth, selectedBudgetYear, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // S'assurer que le bucket logos existe
      await ensureLogosBucket();
      
      await Promise.all([
        fetchAccounts(),
        fetchCategories(),
        fetchCurrencies(),
        fetchCreditCategories(),
        fetchBudgetCategories(),
        fetchLogos()
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Filtrer les catégories par nom et type
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType ? category.type === filterType : true)
  );

  const addCreditCategory = async () => {
    if (!newCreditCategory.trim()) return;
    const { error } = await supabase.from("credit_categories").insert([{ name: newCreditCategory }]);
    if (!error) {
      setNewCreditCategory("");
      fetchCreditCategories();
    }
  };

  const deleteCreditCategory = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie de crédit ?")) return;
    const { error } = await supabase.from("credit_categories").delete().eq("id", id);
    if (!error) fetchCreditCategories();
  };

  const fetchCreditCategories = async () => {
    const { data, error } = await supabase.from("credit_categories").select("*");
    if (!error) setCreditCategories(data || []);
  };

  // 🔹 Ajouter une Nouvelle Catégorie
  const addCategory = async () => {
    if (!newCategory.name.trim()) return;
    const { error } = await supabase.from("transaction_categories").insert([newCategory]);
    if (!error) {
      setNewCategory({ name: "", type: "expense" });
      fetchCategories();
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
      fetchCategories();
    }
  };

  // 🔹 Supprimer une catégorie
  const deleteCategory = async (id: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
    const { error } = await supabase.from("transaction_categories").delete().eq("id", id);
    if (!error) fetchCategories();
  };

  // 🔹 Charger les Comptes
  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("*");
    if (!error) setAccounts(data || []);
  };

  // 🔹 Charger les Catégories de Transactions
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("transaction_categories").select("*");
    if (!error) setCategories(data || []);
  };

  // 🔹 Charger les Devises
  const fetchCurrencies = async () => {
    const { data, error } = await supabase.from("currencies").select("*");
    if (!error) setCurrencies(data || []);
  };

  const fetchBudgetCategories = async () => {
    const { data, error } = await supabase.from("budget_categories").select("*");
    if (!error) setBudgetCategories(data || []);
  };

  const fetchLogos = async () => {
    try {
      const { data, error } = await supabase.storage.from("logos").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) {
        console.error("Erreur chargement logos :", error.message);
        return;
      }
      
      // Filtrer pour ne garder que les fichiers (pas les dossiers)
      const logoFiles = data?.filter(item => !item.id) || [];
      setLogos(logoFiles.map((file) => file.name));
    } catch (error) {
      console.error("Erreur lors du chargement des logos:", error);
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from("logos").upload(fileName, file);
      
      if (error) {
        console.error("Erreur upload logo :", error.message);
        return false;
      }
      
      // Recharger la liste des logos
      await fetchLogos();
      return true;
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      return false;
    }
  };

  const deleteLogo = async (logoName: string) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce logo ?")) return;
    
    try {
      const { error } = await supabase.storage.from("logos").remove([logoName]);
      
      if (error) {
        console.error("Erreur suppression logo :", error.message);
        return;
      }
      
      // Recharger la liste des logos
      await fetchLogos();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };
  
  const fetchBudgetSettings = async () => {
    // D'abord, récupérer les budget_settings
    const { data: budgetSettings } = await supabase
      .from("budget_settings")
      .select("id, percentage, category_id")
      .eq("month", selectedBudgetMonth)
      .eq("year", selectedBudgetYear);
  
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
  
  const addBudgetCategory = async () => {
    if (!newBudgetCategory.name.trim()) return;
    const { error } = await supabase.from("budget_categories").insert([newBudgetCategory]);
    if (!error) {
      setNewBudgetCategory({ name: "", color: "#8884d8" });
      fetchBudgetCategories();
    }
  };
  
  const deleteBudgetCategory = async (id: string) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    const { error } = await supabase.from("budget_categories").delete().eq("id", id);
    if (!error) fetchBudgetCategories();
  };

  const addBudgetSetting = async () => {
    if (!newSetting.category_id || newSetting.percentage <= 0) return;
    const { error } = await supabase.from("budget_settings").insert([
      {
        ...newSetting,
        month: selectedBudgetMonth,
        year: selectedBudgetYear,
      },
    ]);
    if (!error) {
      setNewSetting({ category_id: "", percentage: 0 });
      fetchBudgetSettings();
    }
  };
  
  const deleteBudgetSetting = async (id: string) => {
    const { error } = await supabase.from("budget_settings").delete().eq("id", id);
    if (!error) fetchBudgetSettings();
  };
  
  const updateBudgetSetting = async (id: string, newPercentage: number) => {
    const { error } = await supabase.from("budget_settings").update({ percentage: newPercentage }).eq("id", id);
    if (!error) fetchBudgetSettings();
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                     <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
             <h1 className="text-3xl font-bold mb-6">⚙️ {t('settings.title')}</h1>

      <div className="flex gap-4 mb-4">
        <select value={selectedBudgetMonth} onChange={(e) => setSelectedBudgetMonth(parseInt(e.target.value))} className="border p-2 rounded-md">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{new Date(0, m - 1).toLocaleString("fr-FR", { month: "long" })}</option>
          ))}
        </select>
        <select value={selectedBudgetYear} onChange={(e) => setSelectedBudgetYear(parseInt(e.target.value))} className="border p-2 rounded-md">
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Navigation des onglets */}
      <div className="flex space-x-4 border-b pb-3">
                 <button onClick={() => setActiveTab("accounts")} className={`py-2 px-4 ${activeTab === "accounts" ? "border-b-2 border-blue-500" : ""}`}>{t('settings.accounts')}</button>
         <button onClick={() => setActiveTab("categories")} className={`py-2 px-4 ${activeTab === "categories" ? "border-b-2 border-blue-500" : ""}`}>{t('settings.transactionCategories')}</button>
         <button onClick={() => setActiveTab("currencies")} className={`py-2 px-4 ${activeTab === "currencies" ? "border-b-2 border-blue-500" : ""}`}>{t('settings.currencies')}</button>
         <button onClick={() => setActiveTab("credit_categories")} className={`py-2 px-4 ${activeTab === "credit_categories" ? "border-b-2 border-blue-500" : ""}`}>{t('settings.creditCategories')}</button>
         <button onClick={() => setActiveTab("budget_categories")} className={`py-2 px-4 ${activeTab === "budget_categories" ? "border-b-2 border-blue-500" : ""}`}>{t('settings.budgetCategories')}</button>
         <button onClick={() => setActiveTab("logos")} className={`py-2 px-4 ${activeTab === "logos" ? "border-b-2 border-blue-500" : ""}`}>{t('settings.logos')}</button>
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

        {activeTab === "budget_categories" && (
  <div>
    <h2 className="text-xl font-semibold mb-4">📊 Catégories de Budget & Répartition Mensuelle</h2>

    {/* 🔎 Filtres mois / année */}
    <div className="flex gap-4 mb-6">
      <select value={selectedBudgetMonth} onChange={(e) => setSelectedBudgetMonth(parseInt(e.target.value))} className="border p-2 rounded-md">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={m}>{new Date(0, m - 1).toLocaleString("fr-FR", { month: "long" })}</option>
        ))}
      </select>
      <select value={selectedBudgetYear} onChange={(e) => setSelectedBudgetYear(parseInt(e.target.value))} className="border p-2 rounded-md">
        {[2023, 2024, 2025, 2026].map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>

    {/* ➕ Ajouter une catégorie disponible */}
    <div className="flex gap-4 mb-6">
      <input
        type="text"
        placeholder="Nom de la catégorie"
        value={newBudgetCategory.name}
        onChange={(e) => setNewBudgetCategory({ ...newBudgetCategory, name: e.target.value })}
        className="border p-2 rounded-md w-1/2"
      />
      <input
        type="color"
        value={newBudgetCategory.color}
        onChange={(e) => setNewBudgetCategory({ ...newBudgetCategory, color: e.target.value })}
        className="w-12 h-12 p-1 border rounded"
      />
      <button onClick={addBudgetCategory} className="bg-blue-500 text-white px-4 py-2 rounded-md">Ajouter</button>
    </div>

    {/* Liste des catégories disponibles */}
    <h3 className="text-lg font-semibold mb-2">📁 Catégories Disponibles</h3>
    <ul className="space-y-2 mb-6">
      {budgetCategories.map((cat) => (
        <li key={cat.id} className="flex justify-between items-center border p-2 rounded-md">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }}></div>
            <span>{cat.name}</span>
          </div>
          <button
            onClick={() => deleteBudgetCategory(cat.id)}
            className="bg-red-500 text-white px-2 py-1 rounded-md"
          >
            🗑️ Supprimer
          </button>
        </li>
      ))}
    </ul>

    {/* ➕ Ajouter une répartition mensuelle */}
    <h3 className="text-lg font-semibold mb-2">📆 Répartition pour {selectedBudgetMonth}/{selectedBudgetYear}</h3>
    <div className="flex gap-4 mb-4">
      <select
        value={newSetting.category_id}
        onChange={(e) => setNewSetting({ ...newSetting, category_id: e.target.value })}
        className="border p-2 rounded-md w-1/2"
      >
        <option value="">Sélectionner une catégorie</option>
        {budgetCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="%"
        value={newSetting.percentage}
        onChange={(e) => setNewSetting({ ...newSetting, percentage: parseFloat(e.target.value) || 0 })}
        className="border p-2 rounded-md w-1/4"
      />
      <button onClick={addBudgetSetting} className="bg-blue-500 text-white px-4 py-2 rounded-md">Ajouter</button>
    </div>

    {/* Liste des répartitions */}
    <ul className="space-y-2">
      {budgetSettings.map((setting) => (
        <li key={setting.id} className="flex justify-between border p-2 rounded-md items-center">
          <span>
            {setting.budget_categories.name} : <strong>{setting.percentage}%</strong>
          </span>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              defaultValue={setting.percentage}
              onBlur={(e) => updateBudgetSetting(setting.id, parseFloat(e.target.value) || 0)}
              className="border p-1 rounded-md w-20"
            />
            <button onClick={() => deleteBudgetSetting(setting.id)} className="bg-red-500 text-white px-2 py-1 rounded-md">
              🗑️ Supprimer
            </button>
          </div>
        </li>
      ))}
    </ul>
    <pre className="text-xs bg-gray-200 p-2 rounded mt-6 overflow-x-auto">
  {JSON.stringify(budgetSettings, null, 2)}
</pre>
  </div>
)}

        {activeTab === "logos" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">🖼️ Gestion des Logos</h2>
            <div className="flex gap-4 mb-4">
              <input type="file" accept="image/*" onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleLogoUpload(e.target.files[0]);
                }
              }} className="border p-2 rounded-md" />
            </div>
            <h3 className="text-lg font-semibold mb-2">👇 Logos Actuels</h3>
            <ul className="grid grid-cols-4 gap-3">
              {logos.map((logo) => (
                <li key={logo} className="relative group">
                  <img src={getImageUrl(`logos/${logo}`)} alt={logo} className="w-full h-20 object-cover rounded-md" />
                  <button
                    onClick={() => deleteLogo(logo)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Supprimer le logo"
                  >
                    🗑️
                  </button>
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
