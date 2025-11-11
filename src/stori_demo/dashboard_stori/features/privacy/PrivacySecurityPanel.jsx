import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, EyeOff, FileText, AlertTriangle, CheckCircle, Activity, TrendingUp, AlertCircle } from 'lucide-react';
import { privacyAPI } from './privacyAPI';
import { securityLog } from './securityLog';

const PrivacySecurityPanel = () => {
  const [privacyStatus, setPrivacyStatus] = useState(null);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [statusResponse, logs, statistics] = await Promise.all([
        privacyAPI.getPrivacyStatus(),
        Promise.resolve(securityLog.getRecentLogs(10)),
        Promise.resolve(securityLog.getStatistics())
      ]);

      setPrivacyStatus(statusResponse.data);
      setSecurityLogs(logs);
      setStats(statistics);
      setLoading(false);
    } catch (error) {
      console.error('Error loading privacy/security data:', error);
      setLoading(false);
    }
  };

  const complianceScore = privacyStatus ? privacyAPI.getComplianceScore() : null;

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
              <p className="text-sm text-gray-600">AI-Powered Privacy-Preserving Layer</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {privacyStatus?.compliance === 'compliant' ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Compliant</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>At Risk</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex space-x-1">
          {['overview', 'logs', 'compliance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Compliance Score */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Privacy Compliance Score</h3>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-end space-x-6">
                <div>
                  <div className="text-5xl font-bold text-blue-600 mb-1">
                    {complianceScore?.overall || 0}
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      complianceScore?.level === 'excellent' ? 'bg-green-100 text-green-700' :
                      complianceScore?.level === 'good' ? 'bg-blue-100 text-blue-700' :
                      complianceScore?.level === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {complianceScore?.level?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${complianceScore?.overall || 0}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    {complianceScore?.overall || 0}% compliant with privacy regulations
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Data Encrypted</span>
                  <Lock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {privacyStatus?.metrics?.dataEncrypted || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total encrypted operations</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Events Anonymized</span>
                  <EyeOff className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {privacyStatus?.metrics?.eventsAnonymized || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Privacy-preserved events</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Privacy Violations</span>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {privacyStatus?.metrics?.privacyViolations || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Detected violations</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Access Denied</span>
                  <Shield className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {privacyStatus?.metrics?.accessDenied || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">Unauthorized attempts</div>
              </div>
            </div>

            {/* Features Status */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Privacy Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(privacyStatus?.features || {}).map(([feature, enabled]) => (
                  <div key={feature} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700 capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                    {enabled ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Security Logs</h3>
              <div className="text-sm text-gray-600">
                {stats?.total || 0} total logs • {stats?.recent24h || 0} in last 24h
              </div>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {securityLogs.length > 0 ? (
                securityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            log.severity === 'high' ? 'bg-red-100 text-red-700' :
                            log.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {log.severity}
                          </span>
                          <span className="text-xs text-gray-500">{log.category}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-900 font-medium">{log.message}</div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {JSON.stringify(log.details)}
                          </div>
                        )}
                      </div>
                      <div className={`ml-4 ${
                        log.status === 'success' ? 'text-green-600' :
                        log.status === 'error' || log.status === 'denied' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {log.status === 'success' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <AlertCircle className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">No security logs available</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Regulatory Compliance</h3>
            <div className="space-y-4">
              {Object.entries(privacyStatus?.regulations || {}).map(([regulation, data]) => (
                <div key={regulation} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900 uppercase">{regulation}</span>
                    </div>
                    {data.compliant ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Compliance Score</span>
                      <span className="text-sm font-semibold text-gray-900">{data.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          data.score >= 90 ? 'bg-green-600' :
                          data.score >= 75 ? 'bg-blue-600' :
                          data.score >= 60 ? 'bg-yellow-600' :
                          'bg-red-600'
                        }`}
                        style={{ width: `${data.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySecurityPanel;

