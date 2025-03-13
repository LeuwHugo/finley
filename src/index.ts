import { app, BrowserWindow, session } from "electron";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config();

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 800, // 🔥 Augmentation de la hauteur pour une meilleure UX
    width: 1200, // 🔥 Augmentation de la largeur pour une meilleure UX
    icon: path.join(__dirname, "assets", "minimal_budget_icon.ico"), // 🔥 Ajout de l'icône de l'application
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
    },
  });

  // Déterminer si l'application est en mode développement
  const isDev = process.env.NODE_ENV === "development";

  // Appliquer la Content Security Policy (CSP) pour sécuriser l'application
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          isDev
            ? "default-src 'self' 'unsafe-eval'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
              "connect-src 'self' ws://localhost:3000 https://srunnvweahqpxvmzxxsc.supabase.co https://api.coingecko.com; " +
              "img-src 'self' data: https://srunnvweahqpxvmzxxsc.supabase.co/storage/v1/object/public/logos/; " +
              "style-src 'self' 'unsafe-inline';"
            : "default-src 'self'; " +
              "script-src 'self'; " +
              "connect-src 'self' https://srunnvweahqpxvmzxxsc.supabase.co https://api.coingecko.com; " +
              "img-src 'self' data: https://srunnvweahqpxvmzxxsc.supabase.co/storage/v1/object/public/logos/; " +
              "style-src 'self' 'unsafe-inline';",
        ],
      },
    });
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
};

app.on("ready", createWindow);

// Quitter l'application quand toutes les fenêtres sont fermées (sauf sur macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Réactiver l'application si elle est fermée sur macOS
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
