# Finley - Personal Finance Management Application

A modern, feature-rich personal finance management application built with React, TypeScript, and Electron. Finley helps you track your accounts, transactions, budgets, and financial goals with an intuitive interface.

## 🌟 Features

### 📊 Dashboard
- **Overview**: Get a comprehensive view of your financial health
- **Account Balance**: Real-time total balance across all accounts
- **Monthly Statistics**: Income, expenses, and balance variations
- **Charts & Analytics**: Visual representation of spending patterns
- **Budget Tracking**: Monitor budget distribution and adherence

### 🏦 Account Management
- **Multiple Account Types**: Checking, savings, investment, and crypto accounts
- **Custom Logos**: Upload and manage account logos for easy identification
- **Balance Tracking**: Monitor initial and current balances
- **Currency Support**: Multi-currency account management

### 💳 Transaction Management
- **Transaction Types**: Income, expenses, and transfers
- **Categories**: Organize transactions with custom categories
- **Recurring Transactions**: Set up automatic recurring payments
- **Advanced Filtering**: Filter by date, account, category, and type
- **Bulk Operations**: Efficient transaction management

### 💰 Budget Planning
- **Monthly Budgets**: Set and track monthly spending limits
- **Category Budgets**: Allocate budgets by spending categories
- **Visual Distribution**: Pie charts showing budget allocation
- **Progress Tracking**: Monitor budget usage throughout the month

### 🔄 Recurring Expenses
- **Automated Tracking**: Manage regular payments and subscriptions
- **Payment Scheduling**: Set up monthly or yearly recurring transactions
- **Upcoming Payments**: Highlight future payments for better planning

### 🏦 Credit Management
- **Credit Categories**: Organize different types of credit
- **Credit Tracking**: Monitor credit card balances and payments
- **Credit Analysis**: Track credit utilization and payment history

### ⚙️ Settings & Customization
- **Category Management**: Create and manage transaction categories
- **Currency Settings**: Configure supported currencies
- **Logo Management**: Upload and manage account logos
- **Language Support**: English and French interface
- **Data Export**: Export financial data for backup

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Desktop App**: Electron for cross-platform desktop application
- **Database**: Supabase (PostgreSQL) for data storage
- **File Storage**: Supabase Storage for logo and file management
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Recharts for data visualization
- **State Management**: React Context API and hooks
- **Routing**: React Router for navigation
- **Build Tool**: Webpack with hot reloading

## 📋 Prerequisites

Before running Finley, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Supabase Account** for database and storage

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LeuwHugo/finley.git
   cd finley
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   
   Set up your Supabase database with the following tables:
   
   ```sql
   -- Accounts table
   CREATE TABLE accounts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     type TEXT NOT NULL,
     initial_balance DECIMAL(10,2) DEFAULT 0,
     logo_path TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Transaction categories
   CREATE TABLE transaction_categories (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     type TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Transactions
   CREATE TABLE transactions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     type TEXT NOT NULL,
     amount DECIMAL(10,2) NOT NULL,
     date DATE NOT NULL,
     account_id UUID REFERENCES accounts(id),
     category_id UUID REFERENCES transaction_categories(id),
     target_account_id UUID REFERENCES accounts(id),
     transfer_type TEXT,
     is_recurring BOOLEAN DEFAULT FALSE,
     recurring_type TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Budget categories
   CREATE TABLE budget_categories (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     color TEXT DEFAULT '#8884d8',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Budget settings
   CREATE TABLE budget_settings (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     month INTEGER NOT NULL,
     year INTEGER NOT NULL,
     category_id UUID REFERENCES budget_categories(id),
     percentage DECIMAL(5,2) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Credit categories
   CREATE TABLE credit_categories (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Currencies
   CREATE TABLE currencies (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     code TEXT NOT NULL UNIQUE,
     symbol TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Storage Setup**
   
   Create a "logos" bucket in Supabase Storage with public access for account logos.

6. **Run the application**
   ```bash
   npm start
   ```

## 🌍 Internationalization

Finley supports multiple languages:
- **English** (default)
- **French**

Language can be changed via the language selector in the dashboard header.

## 📱 Usage

### Getting Started
1. **Add Accounts**: Start by adding your bank accounts, credit cards, and investment accounts
2. **Set Categories**: Create categories for your income and expenses
3. **Add Transactions**: Begin tracking your daily transactions
4. **Set Budgets**: Create monthly budgets for different spending categories
5. **Monitor Progress**: Use the dashboard to track your financial progress

### Best Practices
- **Regular Updates**: Update transactions regularly for accurate tracking
- **Category Consistency**: Use consistent categories for better analysis
- **Budget Reviews**: Review and adjust budgets monthly
- **Data Backup**: Export your data regularly for backup

## 🔧 Development

### Project Structure
```
finley/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── utils/              # Utility functions and configurations
│   ├── app.tsx             # Main application component
│   └── index.ts            # Application entry point
├── public/                 # Static assets
├── webpack.*.config.ts     # Webpack configurations
└── package.json            # Dependencies and scripts
```

### Available Scripts
- `npm start` - Start the development server
- `npm run build` - Build the application for production
- `npm run dist` - Create distributable packages
- `npm run lint` - Run ESLint for code quality

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


**Finley** - Take control of your financial future! 💰✨