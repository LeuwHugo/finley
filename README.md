# 🚀 Finley - Gestionnaire de Finances Personnelles  
Finley est une application de gestion financière moderne et intuitive, permettant aux utilisateurs de gérer leurs **comptes bancaires, portefeuilles cryptos et investissements** au sein d'une **interface fluide et optimisée**.  

---

## 📌 Fonctionnalités  

### **💰 Gestion des comptes**
- 📊 **Affichage sous forme de cartes interactives avec animations (`Framer Motion`)**
- 🏦 **Prise en charge des comptes bancaires, portefeuilles cryptos et investissements**
- 💾 **Stockage des comptes dans Supabase**
- 🏷 **Ajout d’un logo personnalisé pour chaque compte (via `Supabase Storage`)**
- 🔄 **Mise à jour et suppression des comptes directement via l'interface**
- 🌍 **Conversion en temps réel des devises et cryptos avec `CoinGecko API`**
- 🔍 **Filtres avancés pour trier les comptes par type et devise**

### **📑 Ajout, Modification et Suppression des comptes**
- ➕ **Ajout d’un compte** via une modale ergonomique
- ✏️ **Modification d’un compte existant** en cliquant sur la carte
- ❌ **Suppression d’un compte avec confirmation** et mise à jour dynamique

### **🔌 Intégrations API & Sécurité**
- 🔐 **Connexion sécurisée à Supabase** pour stocker les comptes et devises
- 🌍 **Utilisation de `CoinGecko API` pour récupérer les taux de change en temps réel**
- 📡 **Gestion de la Content Security Policy (`CSP`)** pour autoriser `CoinGecko`, `Supabase` et WebSockets
- 🚀 **Optimisation des performances avec `useMemo()` et `useEffect()`**

---

## 🎨 Interface utilisateur  

### 📸 **Aperçu de l'interface** *(à insérer plus tard)*
*(Ajoute ici une capture d’écran de l’application)*

---

## 🛠️ Installation & Lancement  

### 🛠️ **Prérequis**  
- **Node.js v16+**
- **NPM ou Yarn**
- **Compte Supabase** *(avec projet configuré)*
- **Compte CoinGecko (clé API non nécessaire pour les taux de change publics)*

### 📥 **Cloner le projet**
```sh
git clone https://github.com/ton-projet/finley.git
cd finley
