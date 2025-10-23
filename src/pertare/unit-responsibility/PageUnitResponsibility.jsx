import React, { useState } from 'react';
import { 
  MapPin,
  Search,
  Filter,
  ChevronRight,
  Building2,
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageUnitResponsibility = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Sample data SPBU
  const spbuData = [
    {
      id: 'SPBU-001',
      name: 'SPBU Jakarta Pusat',
      code: 'JKT-001',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
      manager: 'Budi Santoso',
      phone: '021-12345678',
      status: 'Active',
      totalEquipment: 12,
      activeTasks: 5,
      completedTasks: 23,
      overdueTasks: 1,
      lastMaintenance: '2024-12-10',
      performance: 92
    },
    {
      id: 'SPBU-002',
      name: 'SPBU Bandung',
      code: 'BDG-001',
      address: 'Jl. Asia Afrika No. 45, Bandung',
      manager: 'Sari Wijaya',
      phone: '022-87654321',
      status: 'Active',
      totalEquipment: 10,
      activeTasks: 3,
      completedTasks: 18,
      overdueTasks: 0,
      lastMaintenance: '2024-12-12',
      performance: 95
    },
    {
      id: 'SPBU-003',
      name: 'SPBU Surabaya',
      code: 'SBY-001',
      address: 'Jl. Pemuda No. 67, Surabaya',
      manager: 'Andi Pratama',
      phone: '031-23456789',
      status: 'Active',
      totalEquipment: 15,
      activeTasks: 7,
      completedTasks: 31,
      overdueTasks: 2,
      lastMaintenance: '2024-12-08',
      performance: 88
    },
    {
      id: 'SPBU-004',
      name: 'SPBU Medan',
      code: 'MDN-001',
      address: 'Jl. Gatot Subroto No. 89, Medan',
      manager: 'Rudi Hermawan',
      phone: '061-34567890',
      status: 'Active',
      totalEquipment: 11,
      activeTasks: 4,
      completedTasks: 20,
      overdueTasks: 0,
      lastMaintenance: '2024-12-11',
      performance: 93
    },
    {
      id: 'SPBU-005',
      name: 'SPBU Semarang',
      code: 'SMG-001',
      address: 'Jl. Pandanaran No. 12, Semarang',
      manager: 'Dedi Kurniawan',
      phone: '024-45678901',
      status: 'Active',
      totalEquipment: 9,
      activeTasks: 2,
      completedTasks: 15,
      overdueTasks: 1,
      lastMaintenance: '2024-12-09',
      performance: 90
    },
    {
      id: 'SPBU-006',
      name: 'SPBU Jakarta Selatan',
      code: 'JKT-002',
      address: 'Jl. TB Simatupang No. 34, Jakarta Selatan',
      manager: 'Eko Susanto',
      phone: '021-98765432',
      status: 'Active',
      totalEquipment: 13,
      activeTasks: 6,
      completedTasks: 25,
      overdueTasks: 0,
      lastMaintenance: '2024-12-13',
      performance: 96
    }
  ];

  // Filter SPBU
  const filteredSPBU = spbuData.filter(spbu => {
    const matchesSearch = spbu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spbu.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         spbu.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || spbu.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate summary
  const summary = {
    totalSPBU: spbuData.length,
    totalEquipment: spbuData.reduce((sum, spbu) => sum + spbu.totalEquipment, 0),
    totalActiveTasks: spbuData.reduce((sum, spbu) => sum + spbu.activeTasks, 0),
    totalOverdue: spbuData.reduce((sum, spbu) => sum + spbu.overdueTasks, 0),
    avgPerformance: Math.round(spbuData.reduce((sum, spbu) => sum + spbu.performance, 0) / spbuData.length)
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 95) return 'text-green-600 bg-green-100';
    if (performance >= 85) return 'text-blue-600 bg-blue-100';
    if (performance >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceIcon = (performance) => {
    if (performance >= 90) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (performance >= 75) return <Activity className="w-4 h-4 text-blue-600" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
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
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Unit Responsibility</h1>
            <p className="text-gray-600 mt-1">Kelola dan monitor seluruh SPBU yang menjadi tanggung jawab Anda</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{summary.totalSPBU}</div>
                  <div className="text-sm text-gray-600">Total SPBU</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{summary.totalEquipment}</div>
                  <div className="text-sm text-gray-600">Total Equipment</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{summary.totalActiveTasks}</div>
                  <div className="text-sm text-gray-600">Active Tasks</div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{summary.totalOverdue}</div>
                  <div className="text-sm text-gray-600">Overdue Tasks</div>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{summary.avgPerformance}%</div>
                  <div className="text-sm text-gray-600">Avg Performance</div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari SPBU
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, kode, atau alamat SPBU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="All">Semua Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SPBU Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSPBU.map((spbu) => (
              <div key={spbu.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all">
                {/* Card Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{spbu.name}</h3>
                        <p className="text-sm text-gray-600">{spbu.code}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {spbu.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{spbu.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Manager: {spbu.manager}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Statistics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Equipment</div>
                      <div className="text-xl font-bold text-gray-800">{spbu.totalEquipment}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Active Tasks</div>
                      <div className="text-xl font-bold text-blue-600">{spbu.activeTasks}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Completed</div>
                      <div className="text-xl font-bold text-green-600">{spbu.completedTasks}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 mb-1">Overdue</div>
                      <div className="text-xl font-bold text-red-600">{spbu.overdueTasks}</div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Performance</span>
                      <div className="flex items-center space-x-2">
                        {getPerformanceIcon(spbu.performance)}
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getPerformanceColor(spbu.performance)}`}>
                          {spbu.performance}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          spbu.performance >= 90 ? 'bg-green-500' :
                          spbu.performance >= 75 ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${spbu.performance}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Last Maintenance */}
                  <div className="text-xs text-gray-500 mb-4">
                    Last Maintenance: {spbu.lastMaintenance}
                  </div>

                  {/* Action Button */}
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredSPBU.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No SPBU found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageUnitResponsibility;