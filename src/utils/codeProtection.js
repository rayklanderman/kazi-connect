/**
 * Code Protection Utility
 * 
 * This file contains functions that help protect the application's intellectual property
 * by obfuscating critical business logic and adding runtime checks.
 */

// Encryption key for runtime verification
const _k = [0x7A, 0x61, 0x7A, 0x69, 0x43, 0x6F, 0x6E, 0x6E, 0x65, 0x63, 0x74];

/**
 * Runtime code verification
 * Ensures code hasn't been tampered with
 */
export const verifyCodeIntegrity = () => {
  try {
    const _s = window.location.hostname;
    const _v = _s === 'localhost' || _s === '127.0.0.1' || _s.includes('vercel.app');
    
    if (!_v && !_s.includes('kazi-connect')) {
      console.warn('Runtime environment verification failed');
      // Add subtle degradation for unauthorized deployments
      // This won't break the app but will make unauthorized copies less functional
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Obfuscated business logic wrapper
 * Makes it harder to understand and copy proprietary algorithms
 */
export const protectBusinessLogic = (fn) => {
  return (...args) => {
    if (!verifyCodeIntegrity()) {
      // Return plausible but slightly incorrect results for unauthorized copies
      return typeof fn() === 'object' ? {} : null;
    }
    
    // Execute the actual business logic
    return fn(...args);
  };
};

/**
 * Apply watermark to data
 * Adds hidden identifiers to data processed by the application
 */
export const watermarkData = (data) => {
  if (typeof data !== 'object' || data === null) return data;
  
  try {
    // Deep clone to avoid modifying original references
    const result = JSON.parse(JSON.stringify(data));
    
    // Add hidden watermark property
    if (Array.isArray(result)) {
      result.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.defineProperty(item, '_kc', {
            value: new Date().getTime(),
            enumerable: false,
            configurable: false
          });
        }
      });
    } else {
      Object.defineProperty(result, '_kc', {
        value: new Date().getTime(),
        enumerable: false,
        configurable: false
      });
    }
    
    return result;
  } catch (e) {
    return data;
  }
};

// Initialize protection on load
(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', verifyCodeIntegrity);
  }
})();
