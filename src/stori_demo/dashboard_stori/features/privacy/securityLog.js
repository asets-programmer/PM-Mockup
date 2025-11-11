/**
 * Security Logging Service
 * Tracks security events, access attempts, and privacy operations
 */

class SecurityLogService {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs
    this.initializeLogs();
  }

  initializeLogs() {
    // Load from localStorage if available
    try {
      const stored = localStorage.getItem('stori_security_logs');
      if (stored) {
        this.logs = JSON.parse(stored).slice(-this.maxLogs);
      }
    } catch (error) {
      console.error('Error loading security logs:', error);
    }
  }

  saveLogs() {
    try {
      localStorage.setItem('stori_security_logs', JSON.stringify(this.logs.slice(-this.maxLogs)));
    } catch (error) {
      console.error('Error saving security logs:', error);
    }
  }

  /**
   * Log security event
   */
  log(event) {
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: event.type || 'info',
      category: event.category || 'general',
      severity: event.severity || 'low',
      message: event.message || '',
      details: event.details || {},
      userId: event.userId || 'system',
      ipAddress: event.ipAddress || '127.0.0.1',
      userAgent: event.userAgent || navigator.userAgent,
      status: event.status || 'success'
    };

    this.logs.push(logEntry);
    
    // Keep only last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.saveLogs();
    
    // Console log for debugging
    console.log(`[Security Log] ${logEntry.type.toUpperCase()}: ${logEntry.message}`, logEntry);
    
    return logEntry;
  }

  /**
   * Log encryption operation
   */
  logEncryption(dataType, success = true) {
    return this.log({
      type: 'encryption',
      category: 'privacy',
      severity: success ? 'low' : 'high',
      message: `${success ? 'Data encrypted' : 'Encryption failed'}: ${dataType}`,
      details: { dataType, success },
      status: success ? 'success' : 'error'
    });
  }

  /**
   * Log anonymization operation
   */
  logAnonymization(eventType, success = true) {
    return this.log({
      type: 'anonymization',
      category: 'privacy',
      severity: 'medium',
      message: `${success ? 'Event anonymized' : 'Anonymization failed'}: ${eventType}`,
      details: { eventType, success },
      status: success ? 'success' : 'error'
    });
  }

  /**
   * Log access attempt
   */
  logAccess(resource, userId, success = true) {
    return this.log({
      type: 'access',
      category: 'security',
      severity: success ? 'low' : 'high',
      message: `${success ? 'Access granted' : 'Access denied'}: ${resource}`,
      details: { resource, userId },
      userId,
      status: success ? 'success' : 'denied'
    });
  }

  /**
   * Log API call
   */
  logAPI(endpoint, method, success = true) {
    return this.log({
      type: 'api',
      category: 'network',
      severity: success ? 'low' : 'medium',
      message: `${method} ${endpoint} - ${success ? 'Success' : 'Failed'}`,
      details: { endpoint, method },
      status: success ? 'success' : 'error'
    });
  }

  /**
   * Log security alert
   */
  logSecurityAlert(alertType, description) {
    return this.log({
      type: 'alert',
      category: 'security',
      severity: 'high',
      message: `Security Alert: ${alertType}`,
      details: { alertType, description },
      status: 'warning'
    });
  }

  /**
   * Get logs filtered by criteria
   */
  getLogs(filters = {}) {
    let filtered = [...this.logs];

    if (filters.type) {
      filtered = filtered.filter(log => log.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    if (filters.severity) {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    if (filters.startDate) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(log => new Date(log.timestamp) <= new Date(filters.endDate));
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Get recent logs (last N entries)
   */
  getRecentLogs(count = 50) {
    return this.logs.slice(-count).reverse();
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const stats = {
      total: this.logs.length,
      byType: {},
      byCategory: {},
      bySeverity: {},
      recent24h: 0,
      errors: 0,
      warnings: 0
    };

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    this.logs.forEach(log => {
      // Count by type
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;
      
      // Count by category
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
      
      // Count by severity
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
      
      // Count recent (24h)
      if (new Date(log.timestamp) >= yesterday) {
        stats.recent24h++;
      }
      
      // Count errors and warnings
      if (log.status === 'error' || log.status === 'denied') {
        stats.errors++;
      }
      if (log.severity === 'high' || log.status === 'warning') {
        stats.warnings++;
      }
    });

    return stats;
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }
}

// Export singleton instance
export const securityLog = new SecurityLogService();

