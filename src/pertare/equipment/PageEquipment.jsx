import React, { useState } from 'react';
import { 
  Save,
  Edit,
  Trash2,
  History,
  Tag,
  Settings,
  Database,  
  Plus,
  X,
  MapPin,
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';
import { useAuth } from '../auth/AuthContext';

const PageEquipment = () => {
  const { user } = useAuth();
  
  // Equipment Form States
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create', 'update'
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [equipmentForm, setEquipmentForm] = useState({
    name: '',
    code: '',
    location: '',
    unitResponsibility: '',
    lifetime: '',
    interval: '',
    subdata: []
  });
  const [newSubdata, setNewSubdata] = useState({
    name: '',
    value: '',
    unit: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedEquipmentHistory, setSelectedEquipmentHistory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('All');
  const [unitResponsibilityFilter, setUnitResponsibilityFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Sample data equipment untuk teknisi
  const [equipmentData, setEquipmentData] = useState([
    {
      id: 'EQ-001',
      name: 'Genset A',
      code: 'GEN-001',
      location: 'Gudang Utama',
      unitResponsibility: 'SPBU Jakarta Pusat',
      lifetime: '5 tahun',
      interval: '1 bulan',
      subdata: [
        { name: 'Model', value: 'Cummins C150D5', unit: '' },
        { name: 'Power', value: '150', unit: 'kVA' },
        { name: 'Fuel Type', value: 'Diesel', unit: '' },
        { name: 'Installation Date', value: '2023-01-15', unit: '' }
      ],
      createdAt: '2024-01-15 10:00',
      createdBy: 'Budi Santoso',
      historyLog: [
        { action: 'Created', timestamp: '2024-01-15 10:00', user: 'Budi Santoso', details: 'Equipment baru ditambahkan' },
        { action: 'Updated', timestamp: '2024-06-15 14:30', user: 'Budi Santoso', details: 'Interval maintenance diubah dari 2 bulan ke 1 bulan' }
      ]
    },
    {
      id: 'EQ-002',
      name: 'Dispenser A',
      code: 'DSP-001',
      location: 'Area Pump',
      unitResponsibility: 'SPBU Bandung',
      lifetime: '10 tahun',
      interval: '2 minggu',
      subdata: [
        { name: 'Model', value: 'Wayne Ovation 2', unit: '' },
        { name: 'Flow Rate', value: '120', unit: 'L/min' },
        { name: 'Voltage', value: '220', unit: 'V' },
        { name: 'Serial Number', value: 'WO2-2024-001', unit: '' }
      ],
      createdAt: '2024-02-10 08:30',
      createdBy: 'Sari Wijaya',
      historyLog: [
        { action: 'Created', timestamp: '2024-02-10 08:30', user: 'Sari Wijaya', details: 'Equipment baru ditambahkan' },
        { action: 'Updated', timestamp: '2024-08-10 16:45', user: 'Sari Wijaya', details: 'Lokasi diubah dari Pump Station ke Area Pump' }
      ]
    },
    {
      id: 'EQ-003',
      name: 'Panel Listrik',
      code: 'PEL-001',
      location: 'Ruang Server',
      unitResponsibility: 'SPBU Surabaya',
      lifetime: '15 tahun',
      interval: '3 bulan',
      subdata: [
        { name: 'Brand', value: 'Schneider Electric', unit: '' },
        { name: 'Capacity', value: '100', unit: 'A' },
        { name: 'Voltage', value: '380', unit: 'V' },
        { name: 'Type', value: 'Main Distribution', unit: '' }
      ],
      createdAt: '2024-03-05 09:15',
      createdBy: 'Andi Pratama',
      historyLog: [
        { action: 'Created', timestamp: '2024-03-05 09:15', user: 'Andi Pratama', details: 'Equipment baru ditambahkan' }
      ]
    },
    {
      id: 'EQ-004',
      name: 'Tank Monitoring',
      code: 'TKM-001',
      location: 'Area Tank',
      unitResponsibility: 'SPBU Medan',
      lifetime: '8 tahun',
      interval: '1 bulan',
      subdata: [
        { name: 'Model', value: 'Veeder Root TLS-350', unit: '' },
        { name: 'Tank Capacity', value: '50,000', unit: 'L' },
        { name: 'Sensor Type', value: 'Ultrasonic', unit: '' },
        { name: 'Communication', value: 'Modbus RTU', unit: '' }
      ],
      createdAt: '2024-04-12 11:20',
      createdBy: 'Rudi Hermawan',
      historyLog: [
        { action: 'Created', timestamp: '2024-04-12 11:20', user: 'Rudi Hermawan', details: 'Equipment baru ditambahkan' },
        { action: 'Updated', timestamp: '2024-09-12 13:15', user: 'Rudi Hermawan', details: 'Interval maintenance diubah dari 2 minggu ke 1 bulan' }
      ]
    },
    {
      id: 'EQ-005',
      name: 'CCTV System',
      code: 'CCTV-001',
      location: 'Parking Area',
      unitResponsibility: 'SPBU Semarang',
      lifetime: '7 tahun',
      interval: '2 minggu',
      subdata: [
        { name: 'Brand', value: 'Hikvision', unit: '' },
        { name: 'Resolution', value: '4MP', unit: '' },
        { name: 'Lens Type', value: 'Varifocal', unit: '' },
        { name: 'Night Vision', value: '30m', unit: '' }
      ],
      createdAt: '2024-05-20 14:45',
      createdBy: 'Dedi Kurniawan',
      historyLog: [
        { action: 'Created', timestamp: '2024-05-20 14:45', user: 'Dedi Kurniawan', details: 'Equipment baru ditambahkan' }
      ]
    }
  ]);

  // Get unique locations and unit responsibilities for filter
  const locations = ['All', ...new Set(equipmentData.map(eq => eq.location))];
  const unitResponsibilities = ['All', ...new Set(equipmentData.map(eq => eq.unitResponsibility))];

  // Filter equipment based on search, location, and unit responsibility
  const filteredEquipment = equipmentData.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.unitResponsibility.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'All' || equipment.location === locationFilter;
    const matchesUnitResponsibility = unitResponsibilityFilter === 'All' || equipment.unitResponsibility === unitResponsibilityFilter;
    
    return matchesSearch && matchesLocation && matchesUnitResponsibility;
  });

  // Equipment Form Functions
  const handleOpenForm = (mode = 'create', equipmentId = null) => {
    setFormMode(mode);
    setSelectedEquipmentId(equipmentId);
    
    if (mode === 'update' && equipmentId) {
      const equipment = equipmentData.find(eq => eq.id === equipmentId);
      if (equipment) {
        setEquipmentForm({
          name: equipment.name,
          code: equipment.code,
          location: equipment.location,
          unitResponsibility: equipment.unitResponsibility,
          lifetime: equipment.lifetime,
          interval: equipment.interval,
          subdata: [...equipment.subdata]
        });
      }
      
      // For admin users, show edit modal instead of inline form
      if (user?.role === 'admin') {
        setShowEditModal(true);
        return;
      }
    } else {
      setEquipmentForm({
        name: '',
        code: '',
        location: '',
        unitResponsibility: '',
        lifetime: '',
        interval: '',
        subdata: []
      });
    }
    
    setFormErrors({});
    setShowEquipmentForm(true);
  };

  const handleCloseForm = () => {
    setShowEquipmentForm(false);
    setFormMode('create');
    setSelectedEquipmentId(null);
    setEquipmentForm({
      name: '',
      code: '',
      location: '',
      unitResponsibility: '',
      lifetime: '',
      interval: '',
      subdata: []
    });
    setNewSubdata({ name: '', value: '', unit: '' });
    setFormErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormMode('create');
    setSelectedEquipmentId(null);
    setEquipmentForm({
      name: '',
      code: '',
      location: '',
      unitResponsibility: '',
      lifetime: '',
      interval: '',
      subdata: []
    });
    setNewSubdata({ name: '', value: '', unit: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!equipmentForm.name.trim()) {
      errors.name = 'Nama equipment harus diisi';
    }
    
    if (!equipmentForm.code.trim()) {
      errors.code = 'Kode equipment harus diisi';
    }
    
    if (!equipmentForm.location.trim()) {
      errors.location = 'Lokasi harus diisi';
    }
    
    if (!equipmentForm.unitResponsibility.trim()) {
      errors.unitResponsibility = 'Unit Responsibility (SPBU) harus diisi';
    }
    
    if (!equipmentForm.lifetime.trim()) {
      errors.lifetime = 'Lifetime harus diisi';
    }
    
    if (!equipmentForm.interval.trim()) {
      errors.interval = 'Interval maintenance harus diisi';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEquipment = () => {
    if (validateForm()) {
      const currentUser = user?.name || 'Teknisi';
      const timestamp = new Date().toLocaleString('id-ID');
      
      if (formMode === 'create') {
        const newId = `EQ-${String(equipmentData.length + 1).padStart(3, '0')}`;
        const newEquipment = {
          id: newId,
          ...equipmentForm,
          createdAt: timestamp,
          createdBy: currentUser,
          historyLog: [
            { action: 'Created', timestamp, user: currentUser, details: 'Equipment baru ditambahkan' }
          ]
        };
        
        setEquipmentData([...equipmentData, newEquipment]);
        alert(`Equipment ${equipmentForm.name} berhasil ditambahkan!`);
      } else {
        // Update mode
        setEquipmentData(prevData => 
          prevData.map(eq => {
            if (eq.id === selectedEquipmentId) {
              const updatedHistory = [
                ...eq.historyLog,
                { action: 'Updated', timestamp, user: currentUser, details: 'Data equipment diperbarui' }
              ];
              
              return {
                ...eq,
                ...equipmentForm,
                historyLog: updatedHistory
              };
            }
            return eq;
          })
        );
        alert(`Equipment ${equipmentForm.name} berhasil diperbarui!`);
      }
      
      if (user?.role === 'admin' && formMode === 'update') {
        handleCloseEditModal();
      } else {
        handleCloseForm();
      }
    }
  };

  const handleDeleteEquipment = (equipmentId) => {
    const equipment = equipmentData.find(eq => eq.id === equipmentId);
    if (equipment && window.confirm(`Apakah Anda yakin ingin menghapus equipment "${equipment.name}"?`)) {
      const currentUser = user?.name || 'Teknisi';
      const timestamp = new Date().toLocaleString('id-ID');
      
      // Add delete log before removing
      const deleteLog = {
        action: 'Deleted',
        timestamp,
        user: currentUser,
        details: `Equipment ${equipment.name} dihapus`
      };
      
      setEquipmentData(prevData => prevData.filter(eq => eq.id !== equipmentId));
      alert(`Equipment ${equipment.name} berhasil dihapus!`);
    }
  };

  const handleInputChange = (field, value) => {
    setEquipmentForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddSubdata = () => {
    if (newSubdata.name.trim() && newSubdata.value.trim()) {
      setEquipmentForm(prev => ({
        ...prev,
        subdata: [...prev.subdata, { ...newSubdata }]
      }));
      setNewSubdata({ name: '', value: '', unit: '' });
    }
  };

  const handleRemoveSubdata = (index) => {
    setEquipmentForm(prev => ({
      ...prev,
      subdata: prev.subdata.filter((_, i) => i !== index)
    }));
  };

  const handleViewHistory = (equipmentId) => {
    const equipment = equipmentData.find(eq => eq.id === equipmentId);
    if (equipment) {
      setSelectedEquipmentHistory(equipment);
      setShowHistoryModal(true);
    }
  };

  const handleCloseHistory = () => {
    setShowHistoryModal(false);
    setSelectedEquipmentHistory(null);
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
          {/* Welcome Banner for Admin */}
          <div className="mb-6">
            <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'rgb(0, 108, 184)' }}>
              <h1 className="text-xl font-semibold" style={{ color: '#fff' }}>Selamat datang, Admin!</h1>
              <p className="text-sm mt-1" style={{ color: '#f0f8ff' }}>Kelola dan monitor seluruh equipment dengan mudah</p>
            </div>
          </div>

          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Equipment Management</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">{equipmentData.length}</div>
                  <div className="text-sm text-gray-600">Total Equipment</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {equipmentData.reduce((total, eq) => total + eq.subdata.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Subdata</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <History className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {equipmentData.reduce((total, eq) => total + eq.historyLog.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total History Log</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">{locations.length - 1}</div>
                  <div className="text-sm text-gray-600">Lokasi Berbeda</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pencarian Equipment
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama, kode, lokasi, atau unit responsibility..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Unit Responsibility Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Unit Responsibility (SPBU)
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={unitResponsibilityFilter}
                      onChange={(e) => setUnitResponsibilityFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      {unitResponsibilities.map(unit => (
                        <option key={unit} value={unit}>
                          {unit === 'All' ? 'Semua SPBU' : unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter Lokasi Equipment
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>
                          {location === 'All' ? 'Semua Lokasi' : location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {(unitResponsibilityFilter !== 'All' || locationFilter !== 'All') && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active Filters:</span>
                  {unitResponsibilityFilter !== 'All' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      {unitResponsibilityFilter}
                      <button
                        onClick={() => setUnitResponsibilityFilter('All')}
                        className="ml-2 hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {locationFilter !== 'All' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Filter className="w-3 h-3 mr-1" />
                      {locationFilter}
                      <button
                        onClick={() => setLocationFilter('All')}
                        className="ml-2 hover:text-green-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setUnitResponsibilityFilter('All');
                      setLocationFilter('All');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Equipment Grid Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Equipment</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Total: {filteredEquipment.length} equipment
                  </div>
                  
                  {/* View Toggle Buttons */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === 'grid' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      title="Grid View"
                    >
                      <Grid3X3 className="w-4 h-4 mr-1" />
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center px-3 py-1 rounded-md text-sm transition-colors ${
                        viewMode === 'list' 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4 mr-1" />
                      List
                    </button>
                  </div>

                  {user?.role === 'teknisi' && (
                    <button
                      onClick={() => handleOpenForm('create')}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Baru
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Equipment Content */}
            <div className="p-6">
              {filteredEquipment.length > 0 ? (
                <>
                  {/* Grid View */}
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredEquipment.map((equipment) => (
                        <div key={equipment.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200">
                          {/* Equipment Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-800 mb-1">{equipment.name}</h3>
                              <p className="text-sm text-gray-600">{equipment.code}</p>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleOpenForm('update', equipment.id)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleViewHistory(equipment.id)}
                                className="text-purple-600 hover:text-purple-900 p-1"
                                title="History"
                              >
                                <History className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEquipment(equipment.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Equipment Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                              <span className="text-gray-700 font-medium">{equipment.unitResponsibility}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-700">{equipment.location}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-700">Lifetime: {equipment.lifetime}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-700">Interval: {equipment.interval}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Settings className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-gray-700">{equipment.subdata.length} subdata</span>
                            </div>
                          </div>

                          {/* Subdata Preview */}
                          {equipment.subdata.length > 0 && (
                            <div className="border-t pt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Subdata:</h4>
                              <div className="space-y-1">
                                {equipment.subdata.slice(0, 3).map((subdata, index) => (
                                  <div key={index} className="flex items-center text-xs">
                                    <Tag className="w-3 h-3 text-gray-400 mr-1" />
                                    <span className="text-gray-600">{subdata.name}: {subdata.value}</span>
                                    {subdata.unit && <span className="text-gray-500 ml-1">({subdata.unit})</span>}
                                  </div>
                                ))}
                                {equipment.subdata.length > 3 && (
                                  <p className="text-xs text-gray-500">+{equipment.subdata.length - 3} more...</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Created Info */}
                          <div className="border-t pt-3 mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                <span>{equipment.createdBy}</span>
                              </div>
                              <span>{equipment.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* List View */}
                  {viewMode === 'list' && (
                    <div className="space-y-4">
                      {filteredEquipment.map((equipment) => (
                        <div key={equipment.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            {/* Equipment Info */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-800">{equipment.name}</h3>
                                  <p className="text-sm text-gray-600">{equipment.code}</p>
                                  <div className="flex items-center mt-1">
                                    <MapPin className="w-4 h-4 text-blue-500 mr-1" />
                                    <span className="text-sm text-blue-600 font-medium">{equipment.unitResponsibility}</span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{equipment.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>{equipment.lifetime}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{equipment.interval}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Settings className="w-4 h-4 mr-2" />
                                    <span>{equipment.subdata.length} subdata</span>
                                  </div>
                                </div>
                              </div>

                              {/* Subdata List */}
                              {equipment.subdata.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Subdata:</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {equipment.subdata.map((subdata, index) => (
                                      <div key={index} className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-xs">
                                        <Tag className="w-3 h-3 text-gray-400 mr-1" />
                                        <span className="text-gray-600">{subdata.name}: {subdata.value}</span>
                                        {subdata.unit && <span className="text-gray-500 ml-1">({subdata.unit})</span>}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Created Info */}
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  <span>Created by {equipment.createdBy}</span>
                                </div>
                                <span>{equipment.createdAt}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleOpenForm('update', equipment.id)}
                                className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleViewHistory(equipment.id)}
                                className="flex items-center px-3 py-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                                title="History"
                              >
                                <History className="w-4 h-4 mr-1" />
                                History
                              </button>
                              <button
                                onClick={() => handleDeleteEquipment(equipment.id)}
                                className="flex items-center text-red-600 hover:text-red-900 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* History Log Modal */}
          {showHistoryModal && selectedEquipmentHistory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      History Log - {selectedEquipmentHistory.name}
                    </h2>
                    <button
                      onClick={handleCloseHistory}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Equipment Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Equipment Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{selectedEquipmentHistory.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Code:</span>
                          <span className="ml-2 font-medium">{selectedEquipmentHistory.code}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">{selectedEquipmentHistory.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Created By:</span>
                          <span className="ml-2 font-medium">{selectedEquipmentHistory.createdBy}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Created At:</span>
                          <span className="ml-2 font-medium">{selectedEquipmentHistory.createdAt}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Logs:</span>
                          <span className="ml-2 font-medium">{selectedEquipmentHistory.historyLog.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* History Timeline */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">History Timeline</h3>
                      <div className="space-y-4">
                        {selectedEquipmentHistory.historyLog.map((log, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                            <div className="flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${
                                log.action === 'Created' ? 'bg-green-500' :
                                log.action === 'Updated' ? 'bg-blue-500' :
                                log.action === 'Deleted' ? 'bg-red-500' :
                                'bg-gray-400'
                              }`}></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-800">{log.action}</h4>
                                <span className="text-sm text-gray-500">{log.timestamp}</span>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>User: {log.user}</div>
                                <div>Details: {log.details}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subdata Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Subdata Equipment</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedEquipmentHistory.subdata.map((subdata, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Tag className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-800">{subdata.name}:</span>
                              <span className="text-gray-600">{subdata.value}</span>
                              {subdata.unit && <span className="text-gray-500">({subdata.unit})</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleCloseHistory}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Equipment Form Modal - For teknisi */}
          {showEquipmentForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {formMode === 'create' ? 'Tambah Equipment Baru' : 'Edit Equipment'}
                    </h2>
                    <button
                      onClick={handleCloseForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {/* Nama Equipment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Equipment *
                      </label>
                      <input
                        type="text"
                        value={equipmentForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan nama equipment"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Kode Equipment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kode Equipment *
                      </label>
                      <input
                        type="text"
                        value={equipmentForm.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.code ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan kode equipment"
                      />
                      {formErrors.code && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>
                      )}
                    </div>

                    {/* Unit Responsibility */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Responsibility (SPBU) *
                      </label>
                      <select
                        value={equipmentForm.unitResponsibility}
                        onChange={(e) => handleInputChange('unitResponsibility', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.unitResponsibility ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Pilih SPBU</option>
                        {unitResponsibilities.filter(u => u !== 'All').map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                      {formErrors.unitResponsibility && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.unitResponsibility}</p>
                      )}
                    </div>

                    {/* Lokasi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi *
                      </label>
                      <input
                        type="text"
                        value={equipmentForm.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan lokasi equipment"
                      />
                      {formErrors.location && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                      )}
                    </div>

                    {/* Lifetime & Interval */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lifetime *
                        </label>
                        <input
                          type="text"
                          value={equipmentForm.lifetime}
                          onChange={(e) => handleInputChange('lifetime', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.lifetime ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Contoh: 5 tahun"
                        />
                        {formErrors.lifetime && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.lifetime}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interval *
                        </label>
                        <input
                          type="text"
                          value={equipmentForm.interval}
                          onChange={(e) => handleInputChange('interval', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.interval ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Contoh: 1 bulan"
                        />
                        {formErrors.interval && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.interval}</p>
                        )}
                      </div>
                    </div>

                    {/* Subdata Equipment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subdata Equipment
                      </label>
                      
                      {/* Add Subdata Form */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <input
                          type="text"
                          value={newSubdata.name}
                          onChange={(e) => setNewSubdata(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nama"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          value={newSubdata.value}
                          onChange={(e) => setNewSubdata(prev => ({ ...prev, value: e.target.value }))}
                          placeholder="Value"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          value={newSubdata.unit}
                          onChange={(e) => setNewSubdata(prev => ({ ...prev, unit: e.target.value }))}
                          placeholder="Unit"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      
                      <button
                        onClick={handleAddSubdata}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm mb-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Subdata
                      </button>

                      {/* Subdata List */}
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {equipmentForm.subdata.map((subdata, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 text-sm">
                              <Tag className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{subdata.name}:</span>
                              <span>{subdata.value}</span>
                              {subdata.unit && <span className="text-gray-500">({subdata.unit})</span>}
                            </div>
                            <button
                              onClick={() => handleRemoveSubdata(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSaveEquipment}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {formMode === 'create' ? 'Simpan' : 'Update'}
                      </button>
                      <button
                        onClick={handleCloseForm}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Equipment Modal - Only for admin */}
          {showEditModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Equipment</h2>
                    <button
                      onClick={handleCloseEditModal}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {/* Nama Equipment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Equipment *
                      </label>
                      <input
                        type="text"
                        value={equipmentForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan nama equipment"
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Kode Equipment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kode Equipment *
                      </label>
                      <input
                        type="text"
                        value={equipmentForm.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.code ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan kode equipment"
                      />
                      {formErrors.code && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>
                      )}
                    </div>

                    {/* Unit Responsibility */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit Responsibility (SPBU) *
                      </label>
                      <select
                        value={equipmentForm.unitResponsibility}
                        onChange={(e) => handleInputChange('unitResponsibility', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.unitResponsibility ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Pilih SPBU</option>
                        {unitResponsibilities.filter(u => u !== 'All').map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                      {formErrors.unitResponsibility && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.unitResponsibility}</p>
                      )}
                    </div>

                    {/* Lokasi */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi *
                      </label>
                      <input
                        type="text"
                        value={equipmentForm.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Masukkan lokasi equipment"
                      />
                      {formErrors.location && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                      )}
                    </div>

                    {/* Lifetime & Interval */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lifetime *
                        </label>
                        <input
                          type="text"
                          value={equipmentForm.lifetime}
                          onChange={(e) => handleInputChange('lifetime', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.lifetime ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Contoh: 5 tahun"
                        />
                        {formErrors.lifetime && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.lifetime}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interval *
                        </label>
                        <input
                          type="text"
                          value={equipmentForm.interval}
                          onChange={(e) => handleInputChange('interval', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            formErrors.interval ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Contoh: 1 bulan"
                        />
                        {formErrors.interval && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.interval}</p>
                        )}
                      </div>
                    </div>

                    {/* Subdata Equipment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subdata Equipment
                      </label>
                      
                      {/* Add Subdata Form */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <input
                          type="text"
                          value={newSubdata.name}
                          onChange={(e) => setNewSubdata(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nama"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          value={newSubdata.value}
                          onChange={(e) => setNewSubdata(prev => ({ ...prev, value: e.target.value }))}
                          placeholder="Value"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        <input
                          type="text"
                          value={newSubdata.unit}
                          onChange={(e) => setNewSubdata(prev => ({ ...prev, unit: e.target.value }))}
                          placeholder="Unit"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      
                      <button
                        onClick={handleAddSubdata}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm mb-3"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Subdata
                      </button>

                      {/* Subdata List */}
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {equipmentForm.subdata.map((subdata, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2 text-sm">
                              <Tag className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">{subdata.name}:</span>
                              <span>{subdata.value}</span>
                              {subdata.unit && <span className="text-gray-500">({subdata.unit})</span>}
                            </div>
                            <button
                              onClick={() => handleRemoveSubdata(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSaveEquipment}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Update
                      </button>
                      <button
                        onClick={handleCloseEditModal}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
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

export default PageEquipment;