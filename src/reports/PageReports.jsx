import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Users,
  Wrench,
  Eye,
  RefreshCw
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('month');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);

  // Chart data
  const slaData = [
    { month: 'Jan', sla: 85, target: 90 },
    { month: 'Feb', sla: 92, target: 90 },
    { month: 'Mar', sla: 88, target: 90 },
    { month: 'Apr', sla: 94, target: 90 },
    { month: 'May', sla: 87, target: 90 },
    { month: 'Jun', sla: 94.2, target: 90 },
  ];

  const workOrderTrend = [
    { month: 'Jan', PM: 25, CM: 8, Emergency: 3 },
    { month: 'Feb', PM: 28, CM: 6, Emergency: 2 },
    { month: 'Mar', PM: 30, CM: 10, Emergency: 4 },
    { month: 'Apr', PM: 32, CM: 7, Emergency: 1 },
    { month: 'May', PM: 29, CM: 9, Emergency: 3 },
    { month: 'Jun', PM: 26, CM: 5, Emergency: 2 },
  ];

  const downtimeData = [
    { name: 'Dispenser A', downtime: 2.5, type: 'Dispenser' },
    { name: 'Dispenser B', downtime: 1.8, type: 'Dispenser' },
    { name: 'Dispenser C', downtime: 1.2, type: 'Dispenser' },
    { name: 'Genset A', downtime: 3.2, type: 'Genset' },
    { name: 'Genset B', downtime: 2.1, type: 'Genset' },
    { name: 'CCTV System', downtime: 1.0, type: 'CCTV' },
    { name: 'ATG System', downtime: 0.8, type: 'ATG' },
    { name: 'Panel Listrik', downtime: 4.5, type: 'Electrical' },
    { name: 'Computer System', downtime: 1.5, type: 'IT' },
    { name: 'Backup System', downtime: 2.8, type: 'Backup' },
  ];

  const equipmentHealthData = [
    { name: 'Dispenser', value: 12, color: '#22c55e' },
    { name: 'Genset', value: 8, color: '#f59e0b' },
    { name: 'CCTV', value: 16, color: '#3b82f6' },
    { name: 'Panel Listrik', value: 4, color: '#ef4444' },
    { name: 'ATG', value: 6, color: '#8b5cf6' },
    { name: 'IT System', value: 3, color: '#06b6d4' },
  ];

  const technicianPerformanceData = [
    { name: 'Budi Santoso', completed: 45, rating: 4.8, efficiency: 96.2 },
    { name: 'Sari Wijaya', completed: 38, rating: 4.6, efficiency: 94.1 },
    { name: 'Andi Pratama', completed: 42, rating: 4.7, efficiency: 95.3 },
    { name: 'Rudi Hermawan', completed: 35, rating: 4.4, efficiency: 91.8 },
  ];

  // Sample data laporan
  const reportTypes = [
    {
      id: 'sla-compliance',
      title: 'SLA Compliance Report',
      description: 'Laporan kepatuhan Service Level Agreement',
      icon: CheckCircle,
      color: 'bg-green-500',
      metrics: {
        overall: 94.2,
        target: 95.0,
        trend: 'up',
        change: '+2.1%'
      },
      data: [
        { location: 'SPBU Jakarta Selatan', compliance: 96.5, total: 45, completed: 43 },
        { location: 'SPBU Jakarta Utara', compliance: 92.8, total: 38, completed: 35 },
        { location: 'SPBU Jakarta Barat', compliance: 93.1, total: 42, completed: 39 },
        { location: 'SPBU Jakarta Timur', compliance: 94.7, total: 40, completed: 38 }
      ]
    },
    {
      id: 'work-orders',
      title: 'Work Orders Report',
      description: 'Laporan detail work orders dan status',
      icon: FileText,
      color: 'bg-blue-500',
      metrics: {
        total: 156,
        open: 24,
        completed: 132,
        trend: 'up',
        change: '+15.3%'
      },
      data: [
        { status: 'Open', count: 24, percentage: 15.4, color: 'bg-blue-500' },
        { status: 'In Progress', count: 12, percentage: 7.7, color: 'bg-yellow-500' },
        { status: 'Pending', count: 3, percentage: 1.9, color: 'bg-orange-500' },
        { status: 'Completed', count: 117, percentage: 75.0, color: 'bg-green-500' }
      ]
    },
    {
      id: 'downtime',
      title: 'Downtime Report',
      description: 'Analisis downtime peralatan dan dampaknya',
      icon: Clock,
      color: 'bg-red-500',
      metrics: {
        total: 8.5,
        target: 5.0,
        trend: 'down',
        change: '-12.3%'
      },
      data: [
        { equipment: 'Dispenser A', downtime: 2.5, incidents: 3, impact: 'High' },
        { equipment: 'Genset B', downtime: 3.2, incidents: 2, impact: 'High' },
        { equipment: 'Panel Listrik', downtime: 1.8, incidents: 4, impact: 'Medium' },
        { equipment: 'CCTV System', downtime: 1.0, incidents: 1, impact: 'Low' }
      ]
    },
    {
      id: 'equipment-health',
      title: 'Equipment Health Report',
      description: 'Status kesehatan peralatan dan trend',
      icon: Activity,
      color: 'bg-purple-500',
      metrics: {
        overall: 87.3,
        excellent: 45,
        good: 32,
        warning: 8,
        critical: 3
      },
      data: [
        { category: 'Dispenser', health: 92.5, count: 12, status: 'Good' },
        { category: 'Genset', health: 78.2, count: 8, status: 'Warning' },
        { category: 'CCTV', health: 98.1, count: 16, status: 'Excellent' },
        { category: 'Panel Listrik', health: 65.4, count: 4, status: 'Critical' }
      ]
    },
    {
      id: 'technician-performance',
      title: 'Technician Performance',
      description: 'Kinerja teknisi dan vendor',
      icon: Users,
      color: 'bg-indigo-500',
      metrics: {
        total: 12,
        active: 10,
        average: 4.2,
        trend: 'up',
        change: '+8.7%'
      },
      data: [
        { name: 'Budi Santoso', completed: 45, rating: 4.8, efficiency: 96.2 },
        { name: 'Sari Wijaya', completed: 38, rating: 4.6, efficiency: 94.1 },
        { name: 'Andi Pratama', completed: 42, rating: 4.7, efficiency: 95.3 },
        { name: 'Rudi Hermawan', completed: 35, rating: 4.4, efficiency: 91.8 }
      ]
    }
  ];

  const locations = ['All', 'SPBU Jakarta Selatan', 'SPBU Jakarta Utara', 'SPBU Jakarta Barat', 'SPBU Jakarta Timur'];
  const dateRanges = [
    { value: 'week', label: 'Minggu Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'quarter', label: 'Kuartal Ini' },
    { value: 'year', label: 'Tahun Ini' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Warning': return 'text-yellow-600 bg-yellow-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleGenerateReport = (report) => {
    setIsGenerating(true);
    setSelectedReport(report);
    
    // Simulasi generate report
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleGenerateAllReports = () => {
    setIsGenerating(true);
    
    // Simulasi generate semua laporan
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Semua laporan berhasil di-generate untuk periode ${dateRanges.find(r => r.value === dateRange)?.label} dan lokasi ${selectedLocation}`);
    }, 3000);
  };

  // Filter data berdasarkan periode dan lokasi
  const getFilteredData = (report) => {
    let filteredData = [...report.data];
    
    // Filter berdasarkan lokasi
    if (selectedLocation !== 'All') {
      filteredData = filteredData.filter(item => {
        if (item.location) {
          return item.location === selectedLocation;
        }
        return true; // Jika tidak ada field location, tetap tampilkan
      });
    }
    
    // Filter berdasarkan periode (simulasi)
    if (dateRange !== 'month') {
      // Simulasi data yang berbeda berdasarkan periode
      filteredData = filteredData.map(item => {
        const multiplier = dateRange === 'week' ? 0.25 : 
                          dateRange === 'quarter' ? 3 : 
                          dateRange === 'year' ? 12 : 1;
        
        if (item.compliance) {
          return { ...item, compliance: Math.min(100, item.compliance * (1 + (multiplier - 1) * 0.1)) };
        }
        if (item.count) {
          return { ...item, count: Math.round(item.count * multiplier) };
        }
        if (item.downtime) {
          return { ...item, downtime: item.downtime * multiplier };
        }
        if (item.completed) {
          return { ...item, completed: Math.round(item.completed * multiplier) };
        }
        return item;
      });
    }
    
    return filteredData;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <Navbar />

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Laporan dan analisis performa preventive maintenance</p>
            {(dateRange !== 'month' || selectedLocation !== 'All') && (
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm text-blue-600 font-medium">Filter Aktif:</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {dateRanges.find(r => r.value === dateRange)?.label}
                </span>
                {selectedLocation !== 'All' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {selectedLocation}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Periode</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {dateRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Generate All Reports */}
              <div className="flex items-end">
                <button 
                  onClick={handleGenerateAllReports}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? 'Generating...' : 'Generate All Reports'}
                </button>
              </div>
            </div>
          </div>

          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <div key={report.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${report.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(report.metrics).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-2xl font-bold text-gray-800">
                            {typeof value === 'number' ? 
                              (key.includes('cost') ? formatCurrency(value) : 
                               key.includes('percentage') ? `${value}%` : 
                               formatNumber(value)) : 
                              value}
                          </div>
                          <div className="text-xs text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trend */}
                  {report.metrics.trend && (
                    <div className="flex items-center justify-center mb-4">
                      <div className={`flex items-center text-sm ${getTrendColor(report.metrics.trend)}`}>
                        {getTrendIcon(report.metrics.trend)}
                        <span className="ml-1">{report.metrics.change}</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleGenerateReport(report)}
                      disabled={isGenerating}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <BarChart3 className="w-4 h-4 mr-2" />
                      )}
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Detail Modal */}
          {selectedReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${selectedReport.color}`}>
                        <selectedReport.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{selectedReport.title}</h2>
                        <p className="text-gray-600">{selectedReport.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Summary Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {Object.entries(selectedReport.metrics).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-800 mb-1">
                          {typeof value === 'number' ? 
                            (key.includes('cost') ? formatCurrency(value) : 
                             key.includes('percentage') ? `${value}%` : 
                             formatNumber(value)) : 
                            value}
                        </div>
                        <div className="text-sm text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Data Table */}
                  <div className="bg-white rounded-lg border">
                    <div className="p-4 border-b">
                       <h3 className="text-lg font-semibold text-gray-800">
                         Detail Data - {dateRanges.find(r => r.value === dateRange)?.label} - {selectedLocation}
                       </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                             {Object.keys(getFilteredData(selectedReport)[0] || {}).map((key) => (
                              <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                           {getFilteredData(selectedReport).map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {Object.entries(row).map(([key, value]) => (
                                <td key={key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {key === 'status' ? (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
                                      {value}
                                    </span>
                                  ) : key === 'impact' ? (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(value)}`}>
                                      {value}
                                    </span>
                                  ) : key === 'color' ? (
                                    <div className={`w-4 h-4 rounded ${value}`}></div>
                                  ) : key.includes('cost') ? (
                                    formatCurrency(value)
                                  ) : key.includes('percentage') ? (
                                    `${value}%`
                                  ) : key.includes('rating') ? (
                                    `${value}/5.0`
                                  ) : key.includes('efficiency') ? (
                                    `${value}%`
                                  ) : (
                                    value
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                   {/* Chart Visualization */}
                   <div className="mt-6">
                     {selectedReport.id === 'sla-compliance' && (
                       <div className="bg-white rounded-lg border p-6">
                         <h4 className="text-lg font-semibold text-gray-800 mb-4">Trend Kepatuhan SLA</h4>
                         <ResponsiveContainer width="100%" height={300}>
                           <LineChart data={slaData}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="month" />
                             <YAxis domain={[70, 100]} />
                             <Tooltip />
                             <Legend />
                             <Line type="monotone" dataKey="sla" stroke="#3b82f6" strokeWidth={2} name="SLA %" />
                             <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target" />
                           </LineChart>
                         </ResponsiveContainer>
                       </div>
                     )}

                     {selectedReport.id === 'work-orders' && (
                       <div className="bg-white rounded-lg border p-6">
                         <h4 className="text-lg font-semibold text-gray-800 mb-4">Trend Work Orders</h4>
                         <ResponsiveContainer width="100%" height={300}>
                           <BarChart data={workOrderTrend}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="month" />
                             <YAxis />
                             <Tooltip />
                             <Legend />
                             <Bar dataKey="PM" fill="#22c55e" name="Preventive" />
                             <Bar dataKey="CM" fill="#f59e0b" name="Corrective" />
                             <Bar dataKey="Emergency" fill="#ef4444" name="Emergency" />
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     )}

                     {selectedReport.id === 'downtime' && (
                       <div className="bg-white rounded-lg border p-6">
                         <h4 className="text-lg font-semibold text-gray-800 mb-4">Analisis Downtime Equipment</h4>
                         <ResponsiveContainer width="100%" height={400}>
                           <BarChart data={downtimeData} layout="horizontal">
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis type="number" />
                             <YAxis dataKey="name" type="category" width={120} />
                             <Tooltip />
                             <Bar dataKey="downtime" fill="#f97316" name="Downtime (hours)" />
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     )}

                     {selectedReport.id === 'equipment-health' && (
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <div className="bg-white rounded-lg border p-6">
                           <h4 className="text-lg font-semibold text-gray-800 mb-4">Distribusi Equipment</h4>
                           <ResponsiveContainer width="100%" height={300}>
                             <RechartsPieChart>
                               <Pie
                                 data={equipmentHealthData}
                                 cx="50%"
                                 cy="50%"
                                 labelLine={false}
                                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                 outerRadius={80}
                                 fill="#8884d8"
                                 dataKey="value"
                               >
                                 {equipmentHealthData.map((entry, index) => (
                                   <Cell key={`cell-${index}`} fill={entry.color} />
                                 ))}
                               </Pie>
                               <Tooltip />
                             </RechartsPieChart>
                           </ResponsiveContainer>
                         </div>
                         <div className="bg-white rounded-lg border p-6">
                           <h4 className="text-lg font-semibold text-gray-800 mb-4">Status Equipment</h4>
                           <div className="space-y-4">
                             {equipmentHealthData.map((item, index) => (
                               <div key={index} className="flex items-center justify-between">
                                 <div className="flex items-center">
                                   <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                                   <span className="text-sm font-medium">{item.name}</span>
                                 </div>
                                 <span className="text-sm font-semibold">{item.value} unit</span>
                               </div>
                             ))}
                      </div>
                    </div>
                       </div>
                     )}

                     {selectedReport.id === 'technician-performance' && (
                       <div className="bg-white rounded-lg border p-6">
                         <h4 className="text-lg font-semibold text-gray-800 mb-4">Performa Teknisi</h4>
                         <ResponsiveContainer width="100%" height={300}>
                           <BarChart data={technicianPerformanceData}>
                             <CartesianGrid strokeDasharray="3 3" />
                             <XAxis dataKey="name" />
                             <YAxis />
                             <Tooltip />
                             <Legend />
                             <Bar dataKey="completed" fill="#3b82f6" name="Work Orders Completed" />
                             <Bar dataKey="efficiency" fill="#22c55e" name="Efficiency %" />
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                     )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      <Eye className="w-4 h-4 mr-2 inline" />
                      Preview
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download PDF
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="w-4 h-4 mr-2 inline" />
                      Download Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageReports;
