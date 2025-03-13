import type { Configuration } from 'webpack';
import path from 'path';
import dotenv from 'dotenv';
import { rules } from './webpack.rules';

dotenv.config(); // 🔥 Charge les variables d'environnement

const mainConfig: Configuration = {
  entry: path.resolve(__dirname, 'src', 'index.ts'), // 🔥 Assure un chemin d'entrée correct
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};

// 🔥 Assure l'exportation correcte pour éviter l'erreur
export { mainConfig };
