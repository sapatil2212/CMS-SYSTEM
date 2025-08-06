// Production-safe logger utility
// Only logs in development mode to prevent console pollution in production

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Always log errors, even in production, but with less verbose output
    if (isDevelopment) {
      console.error(...args);
    } else {
      // In production, log minimal error info
      console.error('Error:', args[0]?.message || args[0] || 'Unknown error');
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
};

// Helper function to check if we're in development
export const isDev = () => isDevelopment; 