import { createClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    env?: {
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
    };
  }
}

const supabaseUrl = window.env?.SUPABASE_URL;
const supabaseAnonKey = window.env?.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ Supabase URL ou Key manquante !");
}

// Fonction pour obtenir l'URL d'une image depuis Supabase Storage
export const getImageUrl = (path: string) => {
    return `${supabaseUrl}/storage/v1/object/public/${path}`;
  };

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
