// Helper pour les traductions manquantes
export const missingTranslations = {
  // Messages de confirmation
  confirmDelete: {
    en: "Do you really want to delete this item?",
    fr: "Voulez-vous vraiment supprimer cet élément ?"
  },
  
  // Messages d'erreur
  errorLoading: {
    en: "Error loading data",
    fr: "Erreur lors du chargement des données"
  },
  
  // Messages de succès
  successSave: {
    en: "Successfully saved",
    fr: "Enregistré avec succès"
  },
  
  // Types de comptes
  accountTypes: {
    checking: {
      en: "Checking Account",
      fr: "Compte Courant"
    },
    savings: {
      en: "Savings",
      fr: "Épargne"
    },
    investment: {
      en: "Investment",
      fr: "Investissement"
    },
    crypto: {
      en: "Crypto",
      fr: "Crypto"
    }
  },
  
  // Types de transactions
  transactionTypes: {
    income: {
      en: "Income",
      fr: "Revenu"
    },
    expense: {
      en: "Expense",
      fr: "Dépense"
    },
    transfer: {
      en: "Transfer",
      fr: "Transfert"
    }
  },
  
  // Types de transferts
  transferTypes: {
    saving: {
      en: "Saving",
      fr: "Épargne"
    },
    investing: {
      en: "Investing",
      fr: "Investissement"
    },
    moving: {
      en: "Moving Funds",
      fr: "Déplacement de fonds"
    },
    funding: {
      en: "Funding",
      fr: "Financement"
    }
  },
  
  // Fréquences récurrentes
  recurringTypes: {
    monthly: {
      en: "Monthly",
      fr: "Mensuelle"
    },
    yearly: {
      en: "Yearly",
      fr: "Annuelle"
    }
  }
};

// Fonction pour obtenir une traduction manquante
export const getMissingTranslation = (key: string, language: 'en' | 'fr' = 'en') => {
  const keys = key.split('.');
  let value: any = missingTranslations;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value?.[language] || key;
};

