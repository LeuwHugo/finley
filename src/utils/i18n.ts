import { createContext, useState } from 'react';

export type Language = 'en' | 'fr';

export interface Translations {
  // Dashboard
  dashboard: {
    title: string;
    totalBalance: string;
    allAccounts: string;
    accountDetails: string;
    balanceVariation: string;
    weeklyTransactions: string;
    expensesByCategory: string;
    monthlyBudget: string;
    monthlyIncome: string;
    averageExpense: string;
    perTransaction: string;
    monthlyBalance: string;
    income: string;
    expenses: string;
    noDataForMonth: string;
  };
  
  // Navigation
  navigation: {
    dashboard: string;
    accounts: string;
    transactions: string;
    budget: string;
    credits: string;
    recurringExpenses: string;
    settings: string;
  };
  
  // Accounts
  accounts: {
    title: string;
    addAccount: string;
    editAccount: string;
    accountName: string;
    accountType: string;
    initialBalance: string;
    selectLogo: string;
    selectCurrency: string;
    add: string;
    modify: string;
    delete: string;
    confirmDelete: string;
    accountTypes: {
      checking: string;
      savings: string;
      investment: string;
      crypto: string;
    };
  };
  
  // Transactions
  transactions: {
    title: string;
    addTransaction: string;
    editTransaction: string;
    transactionName: string;
    transactionType: string;
    amount: string;
    date: string;
    selectAccount: string;
    selectCategory: string;
    selectTargetAccount: string;
    transferType: string;
    recurring: string;
    recurringType: string;
    upcomingPayments: string;
    allTypes: string;
    allAccounts: string;
    allCategories: string;
    allMonths: string;
    allDays: string;
    reset: string;
    totalIncome: string;
    totalExpenses: string;
    totalTransfers: string;
    types: {
      income: string;
      expense: string;
      transfer: string;
    };
    transferTypes: {
      saving: string;
      investing: string;
      moving: string;
      funding: string;
    };
    recurringTypes: {
      monthly: string;
      yearly: string;
    };
  };
  
  // Budget
  budget: {
    title: string;
    monthlyBudget: string;
    budgetDistribution: string;
    totalPercentage: string;
    shouldBe100: string;
  };
  
  // Settings
  settings: {
    title: string;
    accounts: string;
    transactionCategories: string;
    currencies: string;
    creditCategories: string;
    budgetCategories: string;
    logos: string;
    searchCategory: string;
    allTypes: string;
    addCategory: string;
    modifyCategory: string;
    deleteCategory: string;
    confirmDeleteCategory: string;
    addCreditCategory: string;
    deleteCreditCategory: string;
    confirmDeleteCreditCategory: string;
    budgetCategoriesTitle: string;
    monthlyDistribution: string;
    availableCategories: string;
    addBudgetCategory: string;
    deleteBudgetCategory: string;
    confirmDeleteBudgetCategory: string;
    addDistribution: string;
    selectCategory: string;
    deleteDistribution: string;
    logosTitle: string;
    uploadNewLogo: string;
    currentLogos: string;
    deleteLogo: string;
    confirmDeleteLogo: string;
  };
  
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    modify: string;
    select: string;
    search: string;
    filter: string;
    reset: string;
    confirm: string;
    unknown: string;
    euro: string;
    currency: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    dashboard: {
      title: "Dashboard",
      totalBalance: "Total Balance",
      allAccounts: "All Accounts",
      accountDetails: "Account Details",
      balanceVariation: "Balance Variation",
      weeklyTransactions: "Weekly Transactions",
      expensesByCategory: "Expenses by Category",
      monthlyBudget: "Monthly Budget",
      monthlyIncome: "Monthly Income",
      averageExpense: "Average Expense",
      perTransaction: "per transaction",
      monthlyBalance: "Monthly Balance",
      income: "Income",
      expenses: "Expenses",
      noDataForMonth: "No data for this month",
    },
    navigation: {
      dashboard: "Dashboard",
      accounts: "Accounts",
      transactions: "Transactions",
      budget: "Budget",
      credits: "Credits",
      recurringExpenses: "Recurring Expenses",
      settings: "Settings",
    },
    accounts: {
      title: "My Accounts",
      addAccount: "Add Account",
      editAccount: "Edit Account",
      accountName: "Account Name",
      accountType: "Account Type",
      initialBalance: "Initial Balance",
      selectLogo: "Select Logo",
      selectCurrency: "Select Currency",
      add: "Add",
      modify: "Modify",
      delete: "Delete",
      confirmDelete: "Do you really want to delete this account?",
      accountTypes: {
        checking: "Checking Account",
        savings: "Savings",
        investment: "Investment",
        crypto: "Crypto",
      },
    },
    transactions: {
      title: "Transactions",
      addTransaction: "Add Transaction",
      editTransaction: "Edit Transaction",
      transactionName: "Transaction Name",
      transactionType: "Transaction Type",
      amount: "Amount",
      date: "Date",
      selectAccount: "Select Account",
      selectCategory: "Select Category",
      selectTargetAccount: "Select Target Account",
      transferType: "Transfer Type",
      recurring: "Recurring",
      recurringType: "Recurring Type",
      upcomingPayments: "Upcoming payments are highlighted in yellow",
      allTypes: "All Types",
      allAccounts: "All Accounts",
      allCategories: "All Categories",
      allMonths: "All Months",
      allDays: "All Days",
      reset: "Reset",
      totalIncome: "Total Income",
      totalExpenses: "Total Expenses",
      totalTransfers: "Total Transfers",
      types: {
        income: "Income",
        expense: "Expense",
        transfer: "Transfer",
      },
      transferTypes: {
        saving: "Saving",
        investing: "Investing",
        moving: "Moving Funds",
        funding: "Funding",
      },
      recurringTypes: {
        monthly: "Monthly",
        yearly: "Yearly",
      },
    },
    budget: {
      title: "Monthly Budget",
      monthlyBudget: "Monthly Budget",
      budgetDistribution: "Budget Distribution",
      totalPercentage: "Total percentage is",
      shouldBe100: "(should be 100%)",
    },
    settings: {
      title: "Settings",
      accounts: "Accounts",
      transactionCategories: "Transaction Categories",
      currencies: "Currencies",
      creditCategories: "Credit Categories",
      budgetCategories: "Budget Categories",
      logos: "Logos",
      searchCategory: "Search for a category...",
      allTypes: "All Types",
      addCategory: "Add Category",
      modifyCategory: "Modify Category",
      deleteCategory: "Delete Category",
      confirmDeleteCategory: "Do you really want to delete this category?",
      addCreditCategory: "Add Credit Category",
      deleteCreditCategory: "Delete Credit Category",
      confirmDeleteCreditCategory: "Do you really want to delete this credit category?",
      budgetCategoriesTitle: "Budget Categories & Monthly Distribution",
      monthlyDistribution: "Monthly Distribution",
      availableCategories: "Available Categories",
      addBudgetCategory: "Add Budget Category",
      deleteBudgetCategory: "Delete Budget Category",
      confirmDeleteBudgetCategory: "Delete this category?",
      addDistribution: "Add Monthly Distribution",
      selectCategory: "Select Category",
      deleteDistribution: "Delete Distribution",
      logosTitle: "Logo Management",
      uploadNewLogo: "Upload New Logo",
      currentLogos: "Current Logos",
      deleteLogo: "Delete Logo",
      confirmDeleteLogo: "Do you really want to delete this logo?",
    },
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      modify: "Modify",
      select: "Select",
      search: "Search",
      filter: "Filter",
      reset: "Reset",
      confirm: "Confirm",
      unknown: "Unknown",
      euro: "€",
      currency: "Currency",
    },
  },
  fr: {
    dashboard: {
      title: "Tableau de Bord",
      totalBalance: "Solde Total",
      allAccounts: "Tous les Comptes",
      accountDetails: "Détails par compte",
      balanceVariation: "Variation du solde",
      weeklyTransactions: "Transactions par Semaine",
      expensesByCategory: "Dépenses par Catégorie",
      monthlyBudget: "Budget Mensuel",
      monthlyIncome: "Revenu du Mois",
      averageExpense: "Dépense Moyenne",
      perTransaction: "par transaction",
      monthlyBalance: "Solde du Mois",
      income: "Revenus",
      expenses: "Dépenses",
      noDataForMonth: "Aucune donnée pour ce mois",
    },
    navigation: {
      dashboard: "Tableau de Bord",
      accounts: "Comptes",
      transactions: "Transactions",
      budget: "Budget",
      credits: "Crédits",
      recurringExpenses: "Dépenses Récurrentes",
      settings: "Paramètres",
    },
    accounts: {
      title: "Mes Comptes",
      addAccount: "Ajouter un compte",
      editAccount: "Modifier le compte",
      accountName: "Nom du compte",
      accountType: "Type de compte",
      initialBalance: "Solde initial",
      selectLogo: "Sélectionner un logo",
      selectCurrency: "Sélectionner une devise",
      add: "Ajouter",
      modify: "Modifier",
      delete: "Supprimer",
      confirmDelete: "Voulez-vous vraiment supprimer ce compte ?",
      accountTypes: {
        checking: "Compte Courant",
        savings: "Épargne",
        investment: "Investissement",
        crypto: "Crypto",
      },
    },
    transactions: {
      title: "Transactions",
      addTransaction: "Ajouter une transaction",
      editTransaction: "Modifier la transaction",
      transactionName: "Nom de la transaction",
      transactionType: "Type de transaction",
      amount: "Montant",
      date: "Date",
      selectAccount: "Sélectionner un compte",
      selectCategory: "Sélectionner une catégorie",
      selectTargetAccount: "Sélectionner le compte cible",
      transferType: "Type de transfert",
      recurring: "Transaction récurrente",
      recurringType: "Fréquence",
      upcomingPayments: "Les paiements à venir sont mis en évidence en jaune",
      allTypes: "Tous les types",
      allAccounts: "Tous les comptes",
      allCategories: "Toutes les catégories",
      allMonths: "Tous les mois",
      allDays: "Tous les jours",
      reset: "Réinitialiser",
      totalIncome: "Total Revenus",
      totalExpenses: "Total Dépenses",
      totalTransfers: "Total Transferts",
      types: {
        income: "Revenu",
        expense: "Dépense",
        transfer: "Transfert",
      },
      transferTypes: {
        saving: "Épargne",
        investing: "Investissement",
        moving: "Déplacement de fonds",
        funding: "Financement",
      },
      recurringTypes: {
        monthly: "Mensuelle",
        yearly: "Annuelle",
      },
    },
    budget: {
      title: "Budget Mensuel",
      monthlyBudget: "Budget Mensuel",
      budgetDistribution: "Répartition du Budget",
      totalPercentage: "La somme des pourcentages est de",
      shouldBe100: "(devrait être 100%)",
    },
    settings: {
      title: "Paramètres",
      accounts: "Comptes",
      transactionCategories: "Catégories de Transactions",
      currencies: "Devises",
      creditCategories: "Catégories de Crédits",
      budgetCategories: "Catégories Budget",
      logos: "Logos",
      searchCategory: "Rechercher une catégorie...",
      allTypes: "Tous les types",
      addCategory: "Ajouter une catégorie",
      modifyCategory: "Modifier une catégorie",
      deleteCategory: "Supprimer une catégorie",
      confirmDeleteCategory: "Voulez-vous vraiment supprimer cette catégorie ?",
      addCreditCategory: "Ajouter une catégorie de crédit",
      deleteCreditCategory: "Supprimer une catégorie de crédit",
      confirmDeleteCreditCategory: "Voulez-vous vraiment supprimer cette catégorie de crédit ?",
      budgetCategoriesTitle: "Catégories de Budget & Répartition Mensuelle",
      monthlyDistribution: "Répartition Mensuelle",
      availableCategories: "Catégories Disponibles",
      addBudgetCategory: "Ajouter une catégorie de budget",
      deleteBudgetCategory: "Supprimer une catégorie de budget",
      confirmDeleteBudgetCategory: "Supprimer cette catégorie ?",
      addDistribution: "Ajouter une répartition mensuelle",
      selectCategory: "Sélectionner une catégorie",
      deleteDistribution: "Supprimer une répartition",
      logosTitle: "Gestion des Logos",
      uploadNewLogo: "Uploader un nouveau logo",
      currentLogos: "Logos Actuels",
      deleteLogo: "Supprimer un logo",
      confirmDeleteLogo: "Voulez-vous vraiment supprimer ce logo ?",
    },
    common: {
      loading: "Chargement...",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      add: "Ajouter",
      modify: "Modifier",
      select: "Sélectionner",
      search: "Rechercher",
      filter: "Filtrer",
      reset: "Réinitialiser",
      confirm: "Confirmer",
      unknown: "Inconnue",
      euro: "€",
      currency: "Devise",
    },
  },
};

// Hook pour utiliser les traductions
export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: unknown = translations[language];
    
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
    }
    
    return (value as string) || key;
  };
  
  return { t, language, setLanguage };
};

// Context pour partager la langue dans l'app
export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Export des traductions pour utilisation dans le provider
export { translations };
