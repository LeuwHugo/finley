// Gestionnaire d'erreurs centralisé pour l'application Finley

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: AppError[] = [];

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Enregistrer une erreur
  logError(code: string, message: string, details?: any): void {
    const error: AppError = {
      code,
      message,
      details,
      timestamp: new Date()
    };

    this.errors.push(error);
    console.error(`[${error.code}] ${error.message}`, error.details);
  }

  // Enregistrer une erreur Supabase
  logSupabaseError(error: any, context: string): void {
    this.logError(
      'SUPABASE_ERROR',
      `Erreur Supabase dans ${context}: ${error.message}`,
      error
    );
  }

  // Enregistrer une erreur de validation
  logValidationError(field: string, value: any, rule: string): void {
    this.logError(
      'VALIDATION_ERROR',
      `Erreur de validation pour ${field}: ${rule}`,
      { field, value, rule }
    );
  }

  // Enregistrer une erreur de réseau
  logNetworkError(url: string, status: number, response?: any): void {
    this.logError(
      'NETWORK_ERROR',
      `Erreur réseau ${status} pour ${url}`,
      { url, status, response }
    );
  }

  // Obtenir toutes les erreurs
  getErrors(): AppError[] {
    return [...this.errors];
  }

  // Obtenir les erreurs récentes (dernières 24h)
  getRecentErrors(): AppError[] {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.errors.filter(error => error.timestamp > oneDayAgo);
  }

  // Effacer les erreurs
  clearErrors(): void {
    this.errors = [];
  }

  // Vérifier s'il y a des erreurs critiques
  hasCriticalErrors(): boolean {
    return this.errors.some(error => 
      error.code === 'SUPABASE_ERROR' || 
      error.code === 'NETWORK_ERROR'
    );
  }

  // Générer un rapport d'erreurs
  generateErrorReport(): string {
    const recentErrors = this.getRecentErrors();
    if (recentErrors.length === 0) {
      return "Aucune erreur récente";
    }

    let report = `Rapport d'erreurs - ${new Date().toLocaleString()}\n\n`;
    
    const groupedErrors = recentErrors.reduce((acc, error) => {
      if (!acc[error.code]) {
        acc[error.code] = [];
      }
      acc[error.code].push(error);
      return acc;
    }, {} as Record<string, AppError[]>);

    Object.entries(groupedErrors).forEach(([code, errors]) => {
      report += `${code} (${errors.length} occurrence(s)):\n`;
      errors.forEach(error => {
        report += `  - ${error.message}\n`;
        if (error.details) {
          report += `    Détails: ${JSON.stringify(error.details)}\n`;
        }
      });
      report += '\n';
    });

    return report;
  }
}

// Instance globale
export const errorHandler = ErrorHandler.getInstance();

// Fonctions utilitaires
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    errorHandler.logError('ASYNC_ERROR', `Erreur dans ${context}`, error);
    return fallback;
  }
};

export const validateRequired = (value: any, fieldName: string): boolean => {
  if (value === null || value === undefined || value === '') {
    errorHandler.logValidationError(fieldName, value, 'Champ requis');
    return false;
  }
  return true;
};

export const validateNumber = (value: any, fieldName: string, min?: number, max?: number): boolean => {
  const num = Number(value);
  if (isNaN(num)) {
    errorHandler.logValidationError(fieldName, value, 'Doit être un nombre');
    return false;
  }
  if (min !== undefined && num < min) {
    errorHandler.logValidationError(fieldName, value, `Doit être >= ${min}`);
    return false;
  }
  if (max !== undefined && num > max) {
    errorHandler.logValidationError(fieldName, value, `Doit être <= ${max}`);
    return false;
  }
  return true;
};

export const validateString = (value: any, fieldName: string, minLength?: number, maxLength?: number): boolean => {
  if (typeof value !== 'string') {
    errorHandler.logValidationError(fieldName, value, 'Doit être une chaîne de caractères');
    return false;
  }
  if (minLength !== undefined && value.length < minLength) {
    errorHandler.logValidationError(fieldName, value, `Doit avoir au moins ${minLength} caractères`);
    return false;
  }
  if (maxLength !== undefined && value.length > maxLength) {
    errorHandler.logValidationError(fieldName, value, `Doit avoir au plus ${maxLength} caractères`);
    return false;
  }
  return true;
};
