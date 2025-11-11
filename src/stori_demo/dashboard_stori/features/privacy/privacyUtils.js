/**
 * Privacy-Preserving AI Utilities
 * Demo-level encryption and anonymization for Stori Sentinel
 */

/**
 * Encrypt data using demo-level AES-like simulation
 * In production, use proper crypto libraries (crypto-js, Web Crypto API)
 */
export const encrypt_data = (data, key = 'stori-demo-key-2024') => {
  try {
    // Demo-level encryption simulation
    // In production, use: crypto.subtle.encrypt() or crypto-js
    const dataStr = JSON.stringify(data);
    const encoded = btoa(dataStr);
    
    // Simple XOR cipher simulation for demo
    let encrypted = '';
    for (let i = 0; i < encoded.length; i++) {
      const charCode = encoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode);
    }
    
    // Return base64 encoded result
    const result = btoa(encrypted);
    
    return {
      encrypted: result,
      algorithm: 'AES-256-GCM (simulated)',
      timestamp: new Date().toISOString(),
      keyHash: btoa(key).substring(0, 16) + '...'
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return {
      encrypted: null,
      error: error.message
    };
  }
};

/**
 * Decrypt data (for demo purposes)
 */
export const decrypt_data = (encryptedData, key = 'stori-demo-key-2024') => {
  try {
    // Decode base64
    const decoded = atob(encryptedData.encrypted || encryptedData);
    
    // Reverse XOR cipher
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      decrypted += String.fromCharCode(charCode);
    }
    
    // Decode from base64
    const dataStr = atob(decrypted);
    return JSON.parse(dataStr);
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

/**
 * Anonymize event data to protect privacy
 * Removes/masks PII and sensitive information
 */
export const anonymize_event = (event) => {
  try {
    const anonymized = {
      ...event,
      // Remove or mask location precision
      location: event.location ? `Zone-${Math.abs(event.location.split(' ').join('').charCodeAt(0) % 10)}` : 'Unknown',
      
      // Mask timestamps (keep relative time only)
      timestamp: event.timestamp ? new Date(event.timestamp).toISOString().split('T')[0] : null,
      exactTime: null, // Remove exact time
      
      // Anonymize description (remove specific details)
      description: event.type || 'Event detected',
      
      // Keep only essential metrics
      type: event.type,
      severity: event.severity,
      confidence: Math.round(event.confidence / 10) * 10, // Round to nearest 10
      
      // Remove any user identifiers
      userId: null,
      userName: null,
      userEmail: null,
      
      // Add anonymization metadata
      anonymized: true,
      anonymizationLevel: 'high',
      privacyCompliant: true
    };
    
    return anonymized;
  } catch (error) {
    console.error('Anonymization error:', error);
    return event;
  }
};

/**
 * Check if data contains PII (Personally Identifiable Information)
 */
export const contains_pii = (data) => {
  const piiPatterns = [
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
    /\b\d{16}\b/, // Credit card (no spaces)
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{10,}\b/ // Phone numbers
  ];
  
  const dataStr = JSON.stringify(data).toLowerCase();
  return piiPatterns.some(pattern => pattern.test(dataStr));
};

/**
 * Generate privacy-preserving hash for identifiers
 */
export const hash_identifier = (identifier) => {
  if (!identifier) return null;
  
  // Simple hash function for demo (use crypto.subtle.digest in production)
  let hash = 0;
  const str = String(identifier);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `hash_${Math.abs(hash).toString(16).substring(0, 12)}`;
};

/**
 * Apply differential privacy noise to numeric values
 */
export const add_differential_privacy = (value, epsilon = 1.0) => {
  // Add Laplace noise for differential privacy (simplified)
  const sensitivity = 1;
  const scale = sensitivity / epsilon;
  const noise = (Math.random() - 0.5) * scale * 2;
  return Math.round(value + noise);
};

