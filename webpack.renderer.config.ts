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
};

// 🔥 Assure l'exportation correcte pour éviter l'erreur
export { rendererConfig };
