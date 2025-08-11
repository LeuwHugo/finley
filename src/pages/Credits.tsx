import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { FiTrash, FiPlusCircle, FiX, FiCheckSquare, FiSquare, FiClock, FiCheckCircle } from "react-icons/fi";

interface Credit {
  id: string;
  name: string;
  amount: number;
  interest_rate: number;
  monthly_payment: number;
  remaining_balance: number;
  start_date: string;
  end_date: string;
  category: string;
  status: string;
  statusColor?: string;
  statusIcon?: JSX.Element;
  next_payment_date?: string;
  credit_categories?: { name: string }[] | null;
}

interface Payment {
  id: string;
  credit_id: string;
  payment_date: string;
  amount: number;
  status: string;
}

interface CreditCategory {
  id: string;
  name: string;
}

interface RawCreditData {
  id: string;
  name: string;
  amount: number;
  remaining_balance: number;
  interest_rate: number;
  start_date: string;
  end_date: string;
  category_id: string;
  monthly_payment: number;
  next_payment_date: string;
  credit_categories: {
    id: string;
    name: string;
  }[] | null;
}

const Credit = () => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState<{ [key: string]: Payment[] }>({});
  const [categories, setCategories] = useState<CreditCategory[]>([]);
  
  // États pour la création d'un crédit
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [installments, setInstallments] = useState(1);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [category, setCategory] = useState("");

  const totalRemainingBalance = credits.reduce((sum, credit) => sum + credit.remaining_balance, 0).toFixed(2);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const totalDueThisMonth = Object.values(payments).flat()
    .filter(payment => payment.payment_date.startsWith(currentMonth) && payment.status === "non payé")
    .reduce((sum, payment) => sum + payment.amount, 0)
    .toFixed(2);

  // Vérification de la somme des échéances
  const totalToRepay = amount + (amount * interestRate) / 100;
  const isValid = totalToRepay.toFixed(2) === (monthlyPayment * installments).toFixed(2);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (installments > 0) {
      setMonthlyPayment(Number((totalToRepay / installments).toFixed(2)));
    }
  }, [amount, interestRate, installments, totalToRepay]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCredits(),
        fetchCategories(),
        fetchPayments()
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCredits = async () => {
    const { data, error } = await supabase
      .from("credits")
      .select(`
        id, 
        name, 
        amount, 
        remaining_balance, 
        interest_rate, 
        start_date, 
        end_date, 
        category_id, 
        monthly_payment, 
        next_payment_date,
        credit_categories(id, name)
      `)
      .order("start_date", { ascending: false });
  
    if (error) {
      console.error("Erreur lors de la récupération des crédits :", error);
      return;
    }

    // Transformation des données pour calculer dynamiquement le statut
    const formattedData = data?.map((credit: RawCreditData) => {
      const totalPaid = payments[credit.id]
        ? payments[credit.id]
            .filter((p) => p.status === "payé")
            .reduce((sum, p) => sum + p.amount, 0)
        : 0;
    
      const remainingBalance = credit.amount + (credit.amount * credit.interest_rate) / 100 - totalPaid;
    
      const status = remainingBalance > 0 ? "En cours" : "Remboursé";
      const statusColor = remainingBalance > 0 ? "text-yellow-400" : "text-green-400";
      const statusIcon = remainingBalance > 0 ? <FiClock /> : <FiCheckCircle />;
    
      return {
        ...credit,
        remaining_balance: parseFloat(remainingBalance.toFixed(2)),
        status,
        statusColor,
        statusIcon,
        category: credit.credit_categories?.[0]?.name || "Non spécifiée"
      };
    }) || [];
    
    setCredits(formattedData);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("credit_categories").select("id, name");
    if (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      return;
    }
    setCategories(data || []);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase.from("credit_payments").select("*");
    if (error) {
      console.error("Erreur lors de la récupération des paiements :", error);
      return;
    }
    
    // Regrouper les paiements par crédit
    const groupedPayments = data?.reduce((acc: { [key: string]: Payment[] }, payment: Payment) => {
      if (!acc[payment.credit_id]) acc[payment.credit_id] = [];
      acc[payment.credit_id].push(payment);
      return acc;
    }, {}) || {};
    
    setPayments(groupedPayments);
  };

  const togglePaymentStatus = async (paymentId: string, creditId: string, currentStatus: string) => {
    const newStatus = currentStatus === "non payé" ? "payé" : "non payé";
  
    const { error } = await supabase
      .from("credit_payments")
      .update({ status: newStatus })
      .eq("id", paymentId);
  
    if (error) {
      console.error("Erreur lors de la mise à jour du paiement :", error);
    } else {
      // Mise à jour locale du state
      setPayments((prevPayments) => {
        if (!prevPayments[creditId]) return prevPayments;
  
        return {
          ...prevPayments,
          [creditId]: prevPayments[creditId].map((p) =>
            p.id === paymentId ? { ...p, status: newStatus } : p
          ),
        };
      });
    }
  };

  const handleAddCredit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!isValid) {
      alert("⚠️ La somme des échéances ne correspond pas au montant total !");
      return;
    }
  
    if (!category) {
      alert("Erreur : Veuillez sélectionner une catégorie.");
      return;
    }
  
    // Validation pour éviter l'erreur "numeric field overflow"
    const remaining_balance = totalToRepay - monthlyPayment * installments;
    if (amount >= 100000 || interestRate >= 1000 || remaining_balance >= 100000) {
      alert("⚠️ Valeurs trop grandes pour être enregistrées !");
      return;
    }
  
    // Définition des dates
    const startDate = new Date().toISOString().split("T")[0];
    const endDate = new Date(new Date().setMonth(new Date().getMonth() + installments))
      .toISOString()
      .split("T")[0];
    const nextPaymentDate = new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0];
  
    // Insérer le crédit dans Supabase et récupérer son ID
    const { data, error } = await supabase
      .from("credits")
      .insert([
        {
          name,
          amount: parseFloat(amount.toFixed(2)),
          interest_rate: parseFloat(interestRate.toFixed(2)),
          monthly_payment: parseFloat(monthlyPayment.toFixed(2)),
          category_id: category,
          start_date: startDate,
          end_date: endDate,
          remaining_balance: parseFloat(totalToRepay.toFixed(2)),
          next_payment_date: nextPaymentDate,
        },
      ])
      .select("id")
      .single();
  
    if (error || !data) {
      console.error("Erreur lors de l'ajout du crédit :", error);
      alert("Erreur lors de l'ajout du crédit.");
      return;
    }
  
    const creditId = data.id;
  
    // Générer les paiements pour chaque échéance
    const payments = [];
    for (let i = 0; i < installments; i++) {
      const paymentDate = new Date(new Date().setMonth(new Date().getMonth() + i + 1))
        .toISOString()
        .split("T")[0];
  
      payments.push({
        credit_id: creditId,
        payment_date: paymentDate,
        amount: parseFloat(monthlyPayment.toFixed(2)),
        status: "non payé",
      });
    }
  
    // Insérer les paiements dans Supabase
    const { error: paymentError } = await supabase.from("credit_payments").insert(payments);
  
    if (paymentError) {
      console.error("Erreur lors de l'ajout des paiements :", paymentError);
      alert("Erreur lors de la création des échéances.");
    } else {
      alert("✅ Crédit ajouté avec ses échéances !");
      setIsModalOpen(false);
      
      // Réinitialiser le formulaire
      setName("");
      setAmount(0);
      setInterestRate(0);
      setInstallments(1);
      setMonthlyPayment(0);
      setCategory("");
      
      // Recharger les données
      fetchData();
    }
  };
  
  const handleDeleteCredit = async (id: string) => {
    const { error } = await supabase.from("credits").delete().match({ id });
    if (error) {
      console.error("Erreur lors de la suppression du crédit :", error);
      alert("Erreur lors de la suppression.");
    } else {
      alert("🗑️ Crédit supprimé !");
      setCredits(credits.filter((credit) => credit.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen p-8 bg-gray-900 rounded-lg shadow-2xl overflow-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-white">Chargement des crédits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-8 bg-gray-900 rounded-lg shadow-2xl overflow-auto">
      <h2 className="text-3xl font-extrabold text-white mb-6 text-center uppercase tracking-wide">
        Liste des Crédits
      </h2>
      <p className="text-white text-lg font-semibold text-center">
        💰 Total Solde Restant : <span className="text-green-400">{totalRemainingBalance}€</span>
      </p>
      <p className="text-white text-lg font-semibold text-center mt-2 mb-6">
        📅 Total Échéances du Mois : <span className="text-yellow-400">{totalDueThisMonth}€</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credits.length > 0 ? (
          credits.map((credit) => (
            <div 
              key={credit.id} 
              className="p-6 bg-gray-800 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-white">{credit.name}</h3>
                <button 
                  onClick={() => handleDeleteCredit(credit.id)} 
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <FiTrash size={20} />
                </button>
              </div>
  
              <p className="text-gray-300 text-lg font-semibold">
                Solde restant : {(
                  (credit.amount + (credit.amount * credit.interest_rate) / 100) - 
                  (payments[credit.id]?.filter(p => p.status === "payé").reduce((sum, p) => sum + p.amount, 0) || 0)
                ).toFixed(2)} €
              </p>

              <p className="text-sm text-gray-400">Montant initial : <span className="text-white">{credit.amount}€</span></p>
              <p className="text-sm text-gray-400">Taux d'intérêt : <span className="text-white">{credit.interest_rate}%</span></p>
              <p className="text-sm text-gray-400">Mensualité : <span className="text-white">{credit.monthly_payment}€</span></p>
              <p className="text-sm text-gray-400">Catégorie : <span className="text-white">{credit.category}</span></p>
              <p className={`text-sm font-semibold ${credit.statusColor} flex items-center gap-2`}>
                {credit.statusIcon} {credit.status}
              </p>

              {/* Section des paiements */}
              <div className="mt-4 bg-gray-700 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-white mb-2 uppercase tracking-wide">Échéances</h4>
                {payments[credit.id] ? (
                  payments[credit.id].map((payment) => (
                    <div 
                      key={payment.id} 
                      className="flex justify-between items-center py-2 border-b border-gray-600 last:border-none"
                    >
                      <span className="text-gray-300">{payment.payment_date} - {payment.amount}€</span>
                      <button 
                        onClick={() => togglePaymentStatus(payment.id, credit.id, payment.status)}
                        className="transition-transform transform hover:scale-110"
                      >
                        {payment.status === "payé" ? (
                          <FiCheckSquare className="text-green-400" size={22} />
                        ) : (
                          <FiSquare className="text-red-400" size={22} />
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">Aucune échéance trouvée.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-white text-lg">Aucun crédit trouvé.</p>
        )}
      </div>
  
      {/* Bouton pour ouvrir la modale */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
      >
        <FiPlusCircle size={22} /> Ajouter un Crédit
      </button>
  
      {/* Modale interne pour ajouter un crédit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-lg w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Ajouter un Crédit</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-300">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleAddCredit} className="flex flex-col gap-4">
              <label className="text-white">
                Nom du crédit
                <input 
                  type="text" 
                  placeholder="Nom du crédit" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="p-3 rounded-lg bg-gray-800 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  required 
                />
              </label>

              <label className="text-white">
                Catégorie
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="p-3 rounded bg-gray-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  required
                >
                  <option value="" disabled>Choisir une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-white">
                Montant (€)
                <input 
                  type="number" 
                  placeholder="Montant" 
                  value={amount} 
                  onChange={(e) => setAmount(Number(e.target.value) || 0)} 
                  className="p-3 rounded bg-gray-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                  required 
                />
              </label>
  
              <label className="text-white">
                Taux d'intérêt (%)
                <input 
                  type="number" 
                  placeholder="% Intérêt" 
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)} 
                  className="p-3 rounded bg-gray-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                  required 
                />
              </label>
  
              <label className="text-white">
                Nombre d'échéances
                <input 
                  type="number" 
                  placeholder="Nombre d'échéances" 
                  value={installments} 
                  onChange={(e) => setInstallments(Number(e.target.value) || 1)} 
                  className="p-3 rounded bg-gray-700 text-white w-full focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                  required 
                />
              </label>
  
              <label className="text-white">
                Montant par échéance (€)
                <input 
                  type="number" 
                  value={monthlyPayment} 
                  disabled 
                  className="p-3 rounded bg-gray-700 text-gray-400 w-full cursor-not-allowed focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
                />
              </label>
  
              <p className={`text-sm ${isValid ? "text-green-400" : "text-red-400"}`}>
                {isValid ? "✅ La somme des échéances est correcte" : "⚠️ Erreur de calcul !"}
              </p>
  
              <button 
                type="submit" 
                className="p-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-transform hover:scale-105"
              >
                Ajouter le Crédit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}  

export default Credit;
