import { createClient } from "@supabase/supabase-js";

declare global {
  interface Window {
    env?: {
      SUPABASE_URL?: string;
      SUPABASE_ANON_KEY?: string;
    };
  }
}

// Configuration Supabase avec fallback pour le développement
const supabaseUrl = window.env?.SUPABASE_URL || process.env.SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey = window.env?.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "your-anon-key";

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === "https://your-project.supabase.co" || supabaseAnonKey === "your-anon-key") {
  console.warn("⚠️ Configuration Supabase manquante ! Veuillez configurer SUPABASE_URL et SUPABASE_ANON_KEY dans vos variables d'environnement.");
}

// Fonction pour obtenir l'URL d'une image depuis Supabase Storage
export const getImageUrl = (path: string) => {
  if (!path) return "";
  // Éviter le double slash en nettoyant le path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${supabaseUrl}/storage/v1/object/public/${cleanPath}`;
};

// Fonction pour vérifier et créer le bucket logos s'il n'existe pas
export const ensureLogosBucket = async () => {
  try {
    // Vérifier si le bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Erreur lors de la vérification des buckets:", listError);
      return false;
    }
    
    const logosBucketExists = buckets?.some(bucket => bucket.name === 'logos');
    
    if (!logosBucketExists) {
      // Créer le bucket logos
      const { error: createError } = await supabase.storage.createBucket('logos', {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error("Erreur lors de la création du bucket logos:", createError);
        return false;
      }
      
      console.log("✅ Bucket 'logos' créé avec succès");
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la vérification/création du bucket:", error);
    return false;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction utilitaire pour vérifier la connexion
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('accounts').select('count').limit(1);
    if (error) {
      console.error("❌ Erreur de connexion Supabase:", error.message);
      return false;
    }
    console.log("✅ Connexion Supabase établie");
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion Supabase:", error);
    return false;
  }
};
