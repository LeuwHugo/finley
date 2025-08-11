import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import path from 'path';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    icon: path.resolve(__dirname, 'public', 'icon', 'icon'), // 🔥 Définition de l'icône principale
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      setupIcon: path.resolve(__dirname, 'public', 'icon', 'icon.ico'), // 🔥 Icône pour l'installateur Windows
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
      // 🔥 Ajout d'options pour améliorer la stabilité
      devContentSecurityPolicy: "default-src 'self' 'unsafe-eval' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
    }),
  ],
};

export default config;
