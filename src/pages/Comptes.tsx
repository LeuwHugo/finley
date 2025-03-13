import { useEffect, useState, useMemo } from "react";
import { supabase, getImageUrl } from "../utils/supabase";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#app");

const Comptes = () => {
  const [accounts, setAccounts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [logos, setLogos] = useState([]);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState(""); // Filtrer par type de compte
  const [filterCurrency, setFilterCurrency] = useState(""); // Filtrer par devise
  const [selectedAccount, setSelectedAccount] = useState(null); // Compte sélectionné pour édition
  const [transactions, setTransactions] = useState([]);

  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "checking",
    initial_balance: 0,
    currency_id: "",
    logo_path: "",
    logo_file: null,
  });

  // Charger les comptes, devises et logos existants
  useEffect(() => {
    const fetchAccounts = async () => {
      const { data, error } = await supabase
        .from("accounts")
        .select("*, currencies(code, symbol)");

      if (error) console.error("Erreur chargement comptes :", error.message);
      else setAccounts(data);
    };

    const fetchCurrencies = async () => {
      const { data, error } = await supabase.from("currencies").select("*");
      if (error) console.error("Erreur chargement devises :", error.message);
      else setCurrencies(data);
    };

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("id, type, amount, account_id, related_account_id");
  
      if (error) console.error("Erreur chargement transactions :", error.message);
      else setTransactions(data);
    };

    const fetchLogos = async () => {
      const { data, error } = await supabase.storage.from("logos").list("", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

      if (error) console.error("Erreur chargement logos :", error.message);
      else setLogos(data.map((file) => file.name));
    };

    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,binancecoin,usd,eur,gbp,jpy&vs_currencies=eur`
        );

        console.log("📊 Taux de change reçus :", response.data);
        setExchangeRates(response.data);
      } catch (error) {
        console.error("⚠️ Erreur récupération des taux de change :", error);
      }
    };

    fetchAccounts();
    fetchCurrencies();
    fetchLogos();
    fetchExchangeRates();
    fetchTransactions();
  }, []);

  // Filtrage des comptes
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchType = filterType ? account.type === filterType : true;
      const matchCurrency = filterCurrency ? account.currencies?.code === filterCurrency : true;
      return matchType && matchCurrency;
    });
  }, [accounts, filterType, filterCurrency]);

  // Fonction pour convertir en EUR
  const convertToEuro = (amount: number, currencyCode: string) => {
    if (currencyCode === "EUR") return Number(amount.toFixed(2)); // Déjà en EUR, arrondi
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) return "Chargement...";
  
    const lowerCode = currencyCode?.toLowerCase();
    return exchangeRates[lowerCode]
      ? Number((amount / exchangeRates[lowerCode]).toFixed(2))
      : "Indisponible";
  };

  // Fonction pour gérer l'ouverture de la modale en mode édition
  interface Account {
    id: number;
    name: string;
    type: string;
    initial_balance: number;
    currency_id: string;
    logo_path: string;
    currencies?: {
      code: string;
      symbol: string;
    };
  }

  const getAccountBalance = (account: Account) => {
    let balance = account.initial_balance;
  
    transactions.forEach((transaction) => {
      if (transaction.account_id === account.id) {
        if (transaction.type === "income") balance += transaction.amount;
        if (transaction.type === "expense") balance -= transaction.amount;
        if (transaction.type === "transfer") balance -= transaction.amount;
      }
  
      if (transaction.related_account_id === account.id && transaction.type === "transfer") {
        balance += transaction.amount;
      }
    });
  
    return Number(balance.toFixed(2)); // 🔥 Force le format numérique avec 2 décimales
  };
  
  

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setNewAccount({
      name: account.name,
      type: account.type,
      initial_balance: account.initial_balance,
      currency_id: account.currency_id,
      logo_path: account.logo_path,
      logo_file: null,
    });
    setIsModalOpen(true);
  };

  // Fonction pour gérer l'ajout ou la modification d'un compte
  const handleSaveAccount = async () => {
    let logoPath = newAccount.logo_path;

    // Si un fichier a été sélectionné, l'uploader
    if (newAccount.logo_file) {
      const { error } = await supabase.storage.from("logos").upload(`${newAccount.logo_file.name}`, newAccount.logo_file);
      if (error) {
        console.error("Erreur upload : ", error.message);
        return;
      }
      logoPath = `logos/${newAccount.logo_file.name}`;
    }

    if (selectedAccount) {
      // Mise à jour du compte existant
      const { error } = await supabase
        .from("accounts")
        .update({
          name: newAccount.name,
          type: newAccount.type,
          initial_balance: newAccount.initial_balance,
          currency_id: newAccount.currency_id,
          logo_path: logoPath,
        })
        .eq("id", selectedAccount.id);

      if (error) {
        console.error("Erreur modification compte :", error.message);
      } else {
        setAccounts((prev) =>
          prev.map((acc) =>
            acc.id === selectedAccount.id ? { ...acc, ...newAccount } : acc
          )
        );
      }
    } else {
      // Ajout d'un nouveau compte
      const { error } = await supabase.from("accounts").insert([
        {
          name: newAccount.name,
          type: newAccount.type,
          initial_balance: newAccount.initial_balance,
          currency_id: newAccount.currency_id,
          logo_path: logoPath,
        },
      ]);

      if (error) {
        console.error("Erreur ajout compte :", error.message);
      } else {
        window.location.reload(); // Recharge la page pour voir le nouveau compte
      }
    }

    setIsModalOpen(false);
    setSelectedAccount(null);
  };

  // Fonction pour supprimer un compte
  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;

    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce compte ?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("accounts").delete().eq("id", selectedAccount.id);

    if (error) {
      console.error("Erreur suppression compte :", error.message);
    } else {
      setAccounts((prev) => prev.filter((acc) => acc.id !== selectedAccount.id));
      setIsModalOpen(false);
      setSelectedAccount(null);
    }
  };
  
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">💰 Mes Comptes</h1>
        <button
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-xl"
          onClick={() => {
            setSelectedAccount(null);
            setNewAccount({
              name: "",
              type: "checking",
              initial_balance: 0,
              currency_id: "",
              logo_path: "",
              logo_file: null,
            });
            setIsModalOpen(true);
          }}
        >
          <FiPlus size={20} /> Ajouter un compte
        </button>
      </div>
  
      {/* Filtres */}
      <div className="flex gap-4 mb-6">
        {/* Filtre par type de compte */}
        <select 
          className="p-2 border rounded-lg bg-white"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="checking">Compte Courant</option>
          <option value="savings">Épargne</option>
          <option value="investment">Investissement</option>
          <option value="crypto">Crypto</option>
        </select>
  
        {/* Filtre par devise */}
        <select 
          className="p-2 border rounded-lg bg-white"
          value={filterCurrency}
          onChange={(e) => setFilterCurrency(e.target.value)}
        >
          <option value="">Toutes les devises</option>
          {currencies.map((currency) => (
            <option key={currency.id} value={currency.code}>
              {currency.name} ({currency.symbol})
            </option>
          ))}
        </select>
  
        {/* Bouton pour réinitialiser les filtres */}
        <button 
          className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition"
          onClick={() => { setFilterType(""); setFilterCurrency(""); }}
        >
          Réinitialiser
        </button>
      </div>
  
      {/* Grille des comptes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <motion.div
              key={account.id}
              className="relative bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-md overflow-hidden flex flex-col border border-gray-200 cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.2)" }}
              transition={{ duration: 0.3 }}
              onClick={() => handleEditAccount(account)}
            >
              {/* Logo de la banque/wallet */}
              {account.logo_path && (
                <img
                  src={getImageUrl(account.logo_path)}
                  alt={account.name}
                  className="absolute top-4 right-4 w-12 h-12 object-contain"
                />
              )}
  
              {/* Infos du compte */}
              <h2 className="text-xl font-semibold text-gray-900">{account.name}</h2>
              <p className="text-gray-500 text-sm uppercase">{account.type}</p>
  
              {/* Solde avec conversion */}
              <motion.p
                className="text-2xl font-bold mt-3 text-gray-800"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {getAccountBalance(account)} {account.currencies?.symbol}
              </motion.p>
              <p className="text-gray-600 text-sm">
                ≈ {convertToEuro(getAccountBalance(account), account.currencies?.code)} €
              </p>
  
              {/* Badge devises */}
              <span className="absolute bottom-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                {account.currencies?.code}
              </span>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-gray-500 text-center">Aucun compte trouvé.</p>
        )}
      </div>
  
      {/* Modale d'ajout/modification de compte */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setSelectedAccount(null);
        }}
        className="bg-white p-6 rounded-lg shadow-xl w-96 mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold mb-4">
          {selectedAccount ? "Modifier le compte" : "Ajouter un compte"}
        </h2>
  
        {/* Nom du compte */}
        <input
          type="text"
          placeholder="Nom du compte"
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          value={newAccount.name}
          onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
        />
  
        {/* Type de compte */}
        <select
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          value={newAccount.type}
          onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value })}
        >
          <option value="checking">Compte Courant</option>
          <option value="savings">Épargne</option>
          <option value="investment">Investissement</option>
          <option value="crypto">Crypto</option>
        </select>
  
        {/* Solde initial */}
        <input
          type="number"
          placeholder="Solde initial"
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          value={newAccount.initial_balance}
          onChange={(e) => setNewAccount({ ...newAccount, initial_balance: parseFloat(e.target.value) })}
        />
           
        {/* Logo du compte */}  
        <select
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          value={newAccount.logo_path}
          onChange={(e) => setNewAccount({ ...newAccount, logo_path: e.target.value })}
           >
        <option value="">Sélectionner un logo</option>
          {logos.map((logo) => (
          <option key={logo} value={`logos/${logo}`}>{logo}</option>
          ))}
        </select>

        {/* Sélecteur de devise */}
        <select
          className="w-full p-2 border rounded-lg mb-3 focus:ring-2 focus:ring-blue-500"
          value={newAccount.currency_id}
          onChange={(e) => setNewAccount({ ...newAccount, currency_id: e.target.value })}
        >
          <option value="">Sélectionner une devise</option>
          {currencies.map((currency) => (
            <option key={currency.id} value={currency.id}>
              {currency.name} ({currency.symbol})
            </option>
          ))}
        </select>
  
        {/* Bouton d'ajout/modification */}
        <button
          onClick={handleSaveAccount}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 text-white py-3 rounded-lg transition-all duration-300 shadow-xl"
        >
          {selectedAccount ? "Modifier" : "Ajouter"}
        </button>
  
        {/* Bouton de suppression en mode édition */}
        {selectedAccount && (
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg mt-3 transition-all duration-300 shadow-xl"
          >
            Supprimer
          </button>
        )}
      </Modal>
    </div>
  );
  
}  

export default Comptes;
