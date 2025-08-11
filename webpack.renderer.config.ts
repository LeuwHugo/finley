import type { Configuration } from 'webpack';
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import Dotenv from 'dotenv-webpack';

const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
    new Dotenv(), // 🔥 Injecte les variables d'environnement
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  // 🔥 Ajout d'optimisations pour améliorer la stabilité
  optimization: {
    minimize: false, // Désactive la minification en développement pour faciliter le debug
  },
  // 🔥 Amélioration de la gestion des erreurs
  stats: {
    errorDetails: true,
  },
};

// 🔥 Assure l'exportation correcte pour éviter l'erreur
export { rendererConfig };
