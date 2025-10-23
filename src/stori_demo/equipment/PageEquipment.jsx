import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Wrench,
  Activity,
  TrendingUp,
  Calendar,
  MapPin,
  Plus,
  X
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';
import { useAuth } from '../auth/AuthContext';

const PageEquipment = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [maintenanceEquipment, setMaintenanceEquipment] = useState(null);
  const [showMaintenanceDetailModal, setShowMaintenanceDetailModal] = useState(false);
  const [selectedMaintenanceType, setSelectedMaintenanceType] = useState('');
  const [maintenanceChecklist, setMaintenanceChecklist] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [selectedTechnicianType, setSelectedTechnicianType] = useState('internal');
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [selectedInternalTechnician, setSelectedInternalTechnician] = useState('');
  
  // Add Equipment Modal States
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    location: '',
    health: 100,
    status: 'Normal',
    runningHours: 0,
    maintenanceInterval: '1 month',
    nextMaintenanceDate: '',
    specifications: {
      model: '',
      capacity: '',
      voltage: '',
      installation: ''
    }
  });
  const [formErrors, setFormErrors] = useState({});

  // Sample data peralatan SPBU
  const [equipmentData, setEquipmentData] = useState([
    {
      id: 'EQ-001',
      name: 'Dispenser A',
      location: 'SPBU Jakarta Selatan',
      category: 'Dispenser',
      health: 95,
      status: 'Normal',
      lastCheck: '2025-08-15 08:30',
      nextMaintenance: '2025-09-15',
      technician: 'Budi Santoso',
      runningHours: 2450,
      specifications: {
        model: 'Wayne Ovation 2',
        capacity: '120 L/min',
        voltage: '220V',
        installation: '2025-03-15'
      },
      maintenanceHistory: [
        { date: '2025-08-15', type: 'Preventive', technician: 'Budi', status: 'Completed' },
        { date: '2025-07-15', type: 'Preventive', technician: 'Budi', status: 'Completed' },
        { date: '2025-06-20', type: 'Corrective', technician: 'Sari', status: 'Completed' }
      ]
    },
    {
      id: 'EQ-002',
      name: 'Genset B',
      location: 'SPBU Jakarta Selatan',
      category: 'Genset',
      health: 78,
      status: 'Warning',
      lastCheck: '2025-08-14 14:20',
      nextMaintenance: '2025-08-20',
      technician: 'Sari Wijaya',
      runningHours: 3200,
      specifications: {
        model: 'Cummins C150D5',
        power: '150 kVA',
        fuel: 'Diesel',
        installation: '2025-08-10'
      },
      maintenanceHistory: [
        { date: '2025-08-14', type: 'Corrective', technician: 'Sari', status: 'Completed' },
        { date: '2025-07-14', type: 'Preventive', technician: 'Sari', status: 'Completed' },
        { date: '2025-06-14', type: 'Preventive', technician: 'Sari', status: 'Completed' }
      ]
    },
    {
      id: 'EQ-003',
      name: 'CCTV System',
      location: 'SPBU Jakarta Selatan',
      category: 'Security',
      health: 98,
      status: 'Normal',
      lastCheck: '2025-08-15 09:15',
      nextMaintenance: '2025-10-15',
      technician: 'Andi Pratama',
      runningHours: 8760,
      specifications: {
        model: 'Hikvision DS-7608NI-K2',
        channels: '8',
        resolution: '4K',
        installation: '2025-01-20'
      },
      maintenanceHistory: [
        { date: '2025-08-15', type: 'Preventive', technician: 'Andi', status: 'Completed' },
        { date: '2025-07-15', type: 'Preventive', technician: 'Andi', status: 'Completed' }
      ]
    },
    {
      id: 'EQ-004',
      name: 'Panel Listrik',
      location: 'SPBU Jakarta Selatan',
      category: 'Electrical',
      health: 65,
      status: 'Critical',
      lastCheck: '2025-08-13 16:45',
      nextMaintenance: '2025-08-18',
      technician: 'Rudi Hermawan',
      runningHours: 8760,
      specifications: {
        model: 'Schneider Electric',
        capacity: '100A',
        voltage: '380V',
        installation: '2025-05-12'
      },
      maintenanceHistory: [
        { date: '2025-08-13', type: 'Emergency', technician: 'Rudi', status: 'In Progress' },
        { date: '2025-07-13', type: 'Preventive', technician: 'Rudi', status: 'Completed' },
        { date: '2025-06-13', type: 'Preventive', technician: 'Rudi', status: 'Completed' }
      ]
    },
    {
      id: 'EQ-005',
      name: 'ATG System',
      location: 'SPBU Jakarta Selatan',
      category: 'Tank Monitoring',
      health: 88,
      status: 'Normal',
      lastCheck: '2025-08-14 11:30',
      nextMaintenance: '2025-09-14',
      technician: 'Dedi Kurniawan',
      runningHours: 4380,
      specifications: {
        model: 'Veeder-Root TLS-350',
        tanks: '4',
        capacity: '50,000L',
        installation: '2025-11-08'
      },
      maintenanceHistory: [
        { date: '2025-08-14', type: 'Preventive', technician: 'Dedi', status: 'Completed' },
        { date: '2025-07-14', type: 'Preventive', technician: 'Dedi', status: 'Completed' }
      ]
    },
    {
      id: 'EQ-006',
      name: 'Computer System',
      location: 'SPBU Jakarta Selatan',
      category: 'IT',
      health: 92,
      status: 'Normal',
      lastCheck: '2025-08-15 10:00',
      nextMaintenance: '2025-11-15',
      technician: 'Eko Susanto',
      runningHours: 8760,
      specifications: {
        model: 'Dell OptiPlex 7090',
        os: 'Windows 10 Pro',
        ram: '8GB',
        installation: '2025-02-15'
      },
      maintenanceHistory: [
        { date: '2025-08-15', type: 'Preventive', technician: 'Eko', status: 'Completed' },
        { date: '2025-07-15', type: 'Preventive', technician: 'Eko', status: 'Completed' }
      ]
    }
  ]);

  const categories = ['All', 'Dispenser', 'Genset', 'Security', 'Electrical', 'Tank Monitoring', 'IT'];
  const statuses = ['All', 'Normal', 'Warning', 'Critical'];
  const locations = ['All', 'SPBU Jakarta Selatan', 'SPBU Jakarta Utara', 'SPBU Jakarta Barat', 'SPBU Jakarta Timur'];
  
  // Sample data teknisi dan vendor
  const internalTechnicians = [
    { id: 'TECH-001', name: 'Budi Santoso', specialty: 'Dispenser, Pump System' },
    { id: 'TECH-002', name: 'Sari Wijaya', specialty: 'Genset, Electrical' },
    { id: 'TECH-003', name: 'Andi Pratama', specialty: 'Security, IT' },
    { id: 'TECH-004', name: 'Rudi Hermawan', specialty: 'Electrical, Panel' },
    { id: 'TECH-005', name: 'Dedi Kurniawan', specialty: 'Tank Monitoring, ATG' },
    { id: 'TECH-006', name: 'Eko Susanto', specialty: 'IT, Computer System' }
  ];
  
  const vendors = [
    { id: 'VENDOR-001', name: 'PT Teknik Mandiri', specialty: 'Dispenser, Pump System' },
    { id: 'VENDOR-002', name: 'CV Genset Pro', specialty: 'Genset, Power System' },
    { id: 'VENDOR-003', name: 'PT Security Solutions', specialty: 'CCTV, Security System' },
    { id: 'VENDOR-004', name: 'CV Electrical Works', specialty: 'Panel, Electrical' },
    { id: 'VENDOR-005', name: 'PT Tank Monitoring', specialty: 'ATG, Tank System' }
  ];

  const filteredEquipment = equipmentData.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || equipment.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || equipment.status === selectedStatus;
    const matchesLocation = selectedLocation === 'All' || equipment.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-600 bg-green-100';
    if (health >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'text-green-600 bg-green-100';
      case 'Warning': return 'text-yellow-600 bg-yellow-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health) => {
    if (health >= 90) return <CheckCircle className="w-4 h-4" />;
    if (health >= 70) return <Clock className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const handleMaintenance = (equipment) => {
    setMaintenanceEquipment(equipment);
    setShowMaintenanceModal(true);
  };

  const handleHistory = (equipment) => {
    setSelectedEquipment(equipment);
    setShowHistoryModal(true);
  };

  const handleCreateWorkOrder = () => {
    // Simulate creating work order
    console.log('Creating work order for:', maintenanceEquipment);
    alert(`Work Order berhasil dibuat untuk ${maintenanceEquipment.name}!`);
    setShowMaintenanceModal(false);
    setMaintenanceEquipment(null);
  };

  const handleCloseMaintenance = () => {
    setShowMaintenanceModal(false);
    setMaintenanceEquipment(null);
  };

  const handleCloseHistory = () => {
    setShowHistoryModal(false);
  };

  const handleMaintenanceTypeSelect = (type) => {
    setSelectedMaintenanceType(type);
    setShowMaintenanceDetailModal(true);
    setShowMaintenanceModal(false);
    
    // Reset form
    setMaintenanceChecklist([]);
    setNewChecklistItem('');
    setSelectedTechnicianType('internal');
    setSelectedTechnician('');
    setSelectedVendor('');
    setSelectedInternalTechnician('');
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setMaintenanceChecklist([...maintenanceChecklist, {
        id: Date.now(),
        item: newChecklistItem.trim(),
        completed: false
      }]);
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (id) => {
    setMaintenanceChecklist(maintenanceChecklist.filter(item => item.id !== id));
  };

  const handleToggleChecklistItem = (id) => {
    setMaintenanceChecklist(maintenanceChecklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleCreateWorkOrderFromDetail = () => {
    const workOrderData = {
      equipment: maintenanceEquipment,
      maintenanceType: selectedMaintenanceType,
      checklist: maintenanceChecklist,
      technicianType: selectedTechnicianType,
      technician: selectedTechnician,
      vendor: selectedVendor,
      internalTechnician: selectedInternalTechnician
    };
    
    console.log('Creating work order:', workOrderData);
    alert(`Work Order berhasil dibuat untuk ${maintenanceEquipment.name}!\n\nTipe: ${selectedMaintenanceType}\nTeknisi: ${selectedTechnicianType === 'internal' ? selectedTechnician : selectedVendor}`);
    
    setShowMaintenanceDetailModal(false);
    setMaintenanceEquipment(null);
    setSelectedMaintenanceType('');
    setMaintenanceChecklist([]);
    setNewChecklistItem('');
    setSelectedTechnicianType('internal');
    setSelectedTechnician('');
    setSelectedVendor('');
    setSelectedInternalTechnician('');
  };

  const handleCloseMaintenanceDetail = () => {
    setShowMaintenanceDetailModal(false);
    setSelectedMaintenanceType('');
    setMaintenanceChecklist([]);
    setNewChecklistItem('');
    setSelectedTechnicianType('internal');
    setSelectedTechnician('');
    setSelectedVendor('');
    setSelectedInternalTechnician('');
  };

  // Add Equipment Functions
  const handleAddEquipment = () => {
    setShowAddEquipmentModal(true);
    setNewEquipment({
      name: '',
      location: '',
      health: 100,
      status: 'Normal',
      runningHours: 0,
      maintenanceInterval: '1 month',
      nextMaintenanceDate: '',
      specifications: {
        model: '',
        capacity: '',
        voltage: '',
        installation: ''
      }
    });
    setFormErrors({});
  };

  const handleCloseAddEquipment = () => {
    setShowAddEquipmentModal(false);
    setNewEquipment({
      name: '',
      location: '',
      health: 100,
      status: 'Normal',
      runningHours: 0,
      maintenanceInterval: '1 month',
      nextMaintenanceDate: '',
      specifications: {
        model: '',
        capacity: '',
        voltage: '',
        installation: ''
      }
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newEquipment.name.trim()) {
      errors.name = 'Nama equipment harus diisi';
    }
    
    if (!newEquipment.location) {
      errors.location = 'Lokasi harus dipilih';
    }
    
    if (!newEquipment.maintenanceInterval) {
      errors.maintenanceInterval = 'Interval maintenance harus dipilih';
    }
    
    if (!newEquipment.nextMaintenanceDate) {
      errors.nextMaintenanceDate = 'Tanggal maintenance berikutnya harus diisi';
    }
    
    if (newEquipment.health < 0 || newEquipment.health > 100) {
      errors.health = 'Health score harus antara 0-100';
    }
    
    if (newEquipment.runningHours < 0) {
      errors.runningHours = 'Running hours tidak boleh negatif';
    }
    
    if (!newEquipment.specifications.model.trim()) {
      errors.model = 'Model harus diisi';
    }
    
    if (!newEquipment.specifications.installation) {
      errors.installation = 'Tanggal instalasi harus diisi';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAddEquipment = () => {
    if (validateForm()) {
      const newId = `EQ-${String(equipmentData.length + 1).padStart(3, '0')}`;
      const today = new Date().toISOString().split('T')[0];
      
      const equipmentToAdd = {
        ...newEquipment,
        id: newId,
        category: 'General', // Default category
        technician: 'TBD', // To Be Determined
        lastCheck: `${today} 08:00`,
        nextMaintenance: newEquipment.nextMaintenanceDate,
        maintenanceHistory: []
      };
      
      setEquipmentData([...equipmentData, equipmentToAdd]);
      alert(`Equipment ${newEquipment.name} berhasil ditambahkan!`);
      handleCloseAddEquipment();
    }
  };

  const handleInputChange = (field, value) => {
    setNewEquipment(prev => ({
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

  const handleSpecificationChange = (field, value) => {
    setNewEquipment(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Equipment Management</h1>
            <p className="text-gray-600 text-lg">Kelola, pantau, dan track kesehatan peralatan SPBU dengan mudah</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-blue-600" />
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
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {equipmentData.filter(eq => eq.status === 'Normal').length}
                  </div>
                  <div className="text-sm text-gray-600">Normal</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {equipmentData.filter(eq => eq.status === 'Warning').length}
                  </div>
                  <div className="text-sm text-gray-600">Warning</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {equipmentData.filter(eq => eq.status === 'Critical').length}
                  </div>
                  <div className="text-sm text-gray-600">Critical</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Filter Equipment</h2>
              <button
                onClick={handleAddEquipment}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </button>
            </div>

            {/* Search Bar - Full Width */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Equipment</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama equipment, lokasi, atau kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
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
            </div>

            {/* Export Button & Filter Summary */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Menampilkan {filteredEquipment.length} dari {equipmentData.length} equipment
              </div>
              <div className="flex items-center space-x-4">
                {(selectedCategory !== 'All' || selectedStatus !== 'All' || selectedLocation !== 'All' || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedStatus('All');
                      setSelectedLocation('All');
                      setSearchTerm('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reset Filter
                  </button>
                )}
                {/* Export Data Button - Only for Admin */}
                {user?.role === 'admin' && (
                  <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Equipment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((equipment) => (
              <div key={equipment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{equipment.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {equipment.location}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEquipment(equipment)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Lihat Detail"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Health Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Health Score</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(equipment.health)}`}>
                      {equipment.health}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        equipment.health >= 90 ? 'bg-green-500' :
                        equipment.health >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${equipment.health}%` }}
                    ></div>
                  </div>
                </div>

                {/* Status & Category */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                    {equipment.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {equipment.category}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="font-medium">Last Check: {equipment.lastCheck}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                    <span>Next: {equipment.nextMaintenance}</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 mr-3 text-gray-400" />
                    <span>{equipment.runningHours.toLocaleString()}h</span>
                  </div>
                  <div className="flex items-center">
                    <Wrench className="w-4 h-4 mr-3 text-gray-400" />
                    <span>Last Maintenance By: {equipment.technician}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2 border-t border-gray-100">
                  {/* Maintenance Button - Only for Admin */}
                  {user?.role === 'admin' && (
                    <button 
                      onClick={() => handleMaintenance(equipment)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <Wrench className="w-4 h-4 inline mr-1" />
                      Maintenance
                    </button>
                  )}
                  <button 
                    onClick={() => handleHistory(equipment)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  >
                    <Activity className="w-4 h-4 inline mr-1" />
                    History
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Equipment Detail Modal */}
          {selectedEquipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {selectedEquipment.name} - Detail
                    </h2>
                    <button
                      onClick={() => setSelectedEquipment(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Specifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                      <div className="space-y-3">
                        {Object.entries(selectedEquipment.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-gray-800">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Maintenance History */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance History</h3>
                      <div className="space-y-3">
                        {selectedEquipment.maintenanceHistory.map((maintenance, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800">{maintenance.date}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                maintenance.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                maintenance.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {maintenance.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div>Type: {maintenance.type}</div>
                              <div>Technician: {maintenance.technician}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Health Trend */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Trend</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-center h-32 text-gray-500">
                        <TrendingUp className="w-8 h-8 mr-2" />
                        Health trend chart akan ditampilkan di sini
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Maintenance Modal - Only for Admin */}
          {showMaintenanceModal && maintenanceEquipment && user?.role === 'admin' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Maintenance - {maintenanceEquipment.name}
                    </h2>
                    <button
                      onClick={handleCloseMaintenance}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
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
                          <span className="text-gray-600">Equipment:</span>
                          <span className="ml-2 font-medium">{maintenanceEquipment.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">{maintenanceEquipment.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Health Score:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(maintenanceEquipment.health)}`}>
                            {maintenanceEquipment.health}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(maintenanceEquipment.status)}`}>
                            {maintenanceEquipment.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Check:</span>
                          <span className="ml-2 font-medium">{maintenanceEquipment.lastCheck}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Next Maintenance:</span>
                          <span className="ml-2 font-medium">{maintenanceEquipment.nextMaintenance}</span>
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Options */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Maintenance Options</h3>
                      <div className="space-y-3">
                        <div 
                          onClick={() => handleMaintenanceTypeSelect('Preventive Maintenance')}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800">Preventive Maintenance</h4>
                              <p className="text-sm text-gray-600">Jadwal maintenance rutin sesuai interval</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Due: {maintenanceEquipment.nextMaintenance}</div>
                              <div className="text-xs text-blue-600">Recommended</div>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 cursor-not-allowed opacity-60">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800">Corrective Maintenance</h4>
                              <p className="text-sm text-gray-600">Perbaikan untuk masalah yang terdeteksi</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">As needed</div>
                              <div className="text-xs text-orange-600">Coming Soon</div>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 cursor-not-allowed opacity-60">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-800">Emergency Repair</h4>
                              <p className="text-sm text-gray-600">Perbaikan darurat untuk kerusakan kritis</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Immediate</div>
                              <div className="text-xs text-red-600">Coming Soon</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          )}

          {/* History Modal */}
          {showHistoryModal && selectedEquipment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Maintenance History - {selectedEquipment.name}
                    </h2>
                    <button
                      onClick={handleCloseHistory}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Equipment Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Equipment Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Maintenance:</span>
                          <span className="ml-2 font-medium">{selectedEquipment.maintenanceHistory.length} times</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Maintenance:</span>
                          <span className="ml-2 font-medium">{selectedEquipment.maintenanceHistory[0]?.date || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Running Hours:</span>
                          <span className="ml-2 font-medium">{selectedEquipment.runningHours.toLocaleString()}h</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Health Score:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(selectedEquipment.health)}`}>
                            {selectedEquipment.health}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Timeline */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Timeline</h3>
                      <div className="space-y-4">
                        {selectedEquipment.maintenanceHistory.map((maintenance, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                            <div className="flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${
                                maintenance.status === 'Completed' ? 'bg-green-500' :
                                maintenance.status === 'In Progress' ? 'bg-yellow-500' :
                                'bg-gray-400'
                              }`}></div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-800">{maintenance.type} Maintenance</h4>
                                <span className="text-sm text-gray-500">{maintenance.date}</span>
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div>Technician: {maintenance.technician}</div>
                                <div>Status: 
                                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    maintenance.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                    maintenance.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {maintenance.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Health Trend Chart Placeholder */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Trend</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-center h-32 text-gray-500">
                          <TrendingUp className="w-8 h-8 mr-2" />
                          Health trend chart akan ditampilkan di sini
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Statistics */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedEquipment.maintenanceHistory.filter(m => m.type === 'Preventive').length}
                          </div>
                          <div className="text-sm text-blue-800">Preventive Maintenance</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedEquipment.maintenanceHistory.filter(m => m.type === 'Corrective').length}
                          </div>
                          <div className="text-sm text-orange-800">Corrective Maintenance</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4">
                          <div className="text-2xl font-bold text-red-600">
                            {selectedEquipment.maintenanceHistory.filter(m => m.type === 'Emergency').length}
                          </div>
                          <div className="text-sm text-red-800">Emergency Repair</div>
                        </div>
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

          {/* Maintenance Detail Modal - Only for Admin */}
          {showMaintenanceDetailModal && maintenanceEquipment && user?.role === 'admin' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {selectedMaintenanceType} - {maintenanceEquipment.name}
                    </h2>
                    <button
                      onClick={handleCloseMaintenanceDetail}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
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
                          <span className="text-gray-600">Equipment:</span>
                          <span className="ml-2 font-medium">{maintenanceEquipment.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">{maintenanceEquipment.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Category:</span>
                          <span className="ml-2 font-medium">{maintenanceEquipment.category}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Health Score:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getHealthColor(maintenanceEquipment.health)}`}>
                            {maintenanceEquipment.health}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Checklist */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Maintenance Checklist</h3>
                      
                      {/* Add New Checklist Item */}
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newChecklistItem}
                          onChange={(e) => setNewChecklistItem(e.target.value)}
                          placeholder="Tambahkan item checklist..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                        />
                        <button
                          onClick={handleAddChecklistItem}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>

                      {/* Checklist Items */}
                      <div className="space-y-2">
                        {maintenanceChecklist.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleToggleChecklistItem(item.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                              {item.item}
                            </span>
                            <button
                              onClick={() => handleRemoveChecklistItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        
                        {maintenanceChecklist.length === 0 && (
                          <div className="text-center text-gray-500 py-4">
                            Belum ada checklist. Tambahkan item checklist di atas.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technician Selection */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Pilih Teknisi</h3>
                      
                      {/* Technician Type Selection */}
                      <div className="mb-4">
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="internal"
                              checked={selectedTechnicianType === 'internal'}
                              onChange={(e) => setSelectedTechnicianType(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Teknisi Internal</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="vendor"
                              checked={selectedTechnicianType === 'vendor'}
                              onChange={(e) => setSelectedTechnicianType(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Vendor</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value="vendor_with_internal"
                              checked={selectedTechnicianType === 'vendor_with_internal'}
                              onChange={(e) => setSelectedTechnicianType(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Vendor + Teknisi Pendamping</span>
                          </label>
                        </div>
                      </div>

                      {/* Internal Technician Selection */}
                      {selectedTechnicianType === 'internal' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Teknisi Internal</label>
                          <select
                            value={selectedTechnician}
                            onChange={(e) => setSelectedTechnician(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Pilih teknisi...</option>
                            {internalTechnicians.map(tech => (
                              <option key={tech.id} value={tech.name}>
                                {tech.name} - {tech.specialty}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Vendor Selection */}
                      {selectedTechnicianType === 'vendor' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                          <select
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Pilih vendor...</option>
                            {vendors.map(vendor => (
                              <option key={vendor.id} value={vendor.name}>
                                {vendor.name} - {vendor.specialty}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Vendor + Internal Technician Selection */}
                      {selectedTechnicianType === 'vendor_with_internal' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                            <select
                              value={selectedVendor}
                              onChange={(e) => setSelectedVendor(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Pilih vendor...</option>
                              {vendors.map(vendor => (
                                <option key={vendor.id} value={vendor.name}>
                                  {vendor.name} - {vendor.specialty}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Teknisi Pendamping Internal</label>
                            <select
                              value={selectedInternalTechnician}
                              onChange={(e) => setSelectedInternalTechnician(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Pilih teknisi pendamping...</option>
                              {internalTechnicians.map(tech => (
                                <option key={tech.id} value={tech.name}>
                                  {tech.name} - {tech.specialty}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCloseMaintenanceDetail}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateWorkOrderFromDetail}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Wrench className="w-4 h-4 mr-2 inline" />
                      Create Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Equipment Modal */}
          {showAddEquipmentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Add New Equipment
                    </h2>
                    <button
                      onClick={handleCloseAddEquipment}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Equipment Name *
                          </label>
                          <input
                            type="text"
                            value={newEquipment.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter equipment name"
                          />
                          {formErrors.name && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                          </label>
                          <select
                            value={newEquipment.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.location ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select location</option>
                            {locations.filter(loc => loc !== 'All').map(location => (
                              <option key={location} value={location}>{location}</option>
                            ))}
                          </select>
                          {formErrors.location && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maintenance Interval *
                          </label>
                          <select
                            value={newEquipment.maintenanceInterval}
                            onChange={(e) => handleInputChange('maintenanceInterval', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.maintenanceInterval ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select interval</option>
                            <option value="1 week">1 Minggu sekali</option>
                            <option value="2 weeks">2 Minggu sekali</option>
                            <option value="1 month">1 Bulan sekali</option>
                            <option value="2 months">2 Bulan sekali</option>
                            <option value="3 months">3 Bulan sekali</option>
                            <option value="6 months">6 Bulan sekali</option>
                            <option value="1 year">1 Tahun sekali</option>
                          </select>
                          {formErrors.maintenanceInterval && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.maintenanceInterval}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Next Maintenance Date *
                          </label>
                          <input
                            type="date"
                            value={newEquipment.nextMaintenanceDate}
                            onChange={(e) => handleInputChange('nextMaintenanceDate', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.nextMaintenanceDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.nextMaintenanceDate && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.nextMaintenanceDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Health Score (0-100) *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={newEquipment.health}
                            onChange={(e) => handleInputChange('health', parseInt(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.health ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.health && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.health}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Running Hours
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={newEquipment.runningHours}
                            onChange={(e) => handleInputChange('runningHours', parseInt(e.target.value) || 0)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.runningHours ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.runningHours && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.runningHours}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Model *
                          </label>
                          <input
                            type="text"
                            value={newEquipment.specifications.model}
                            onChange={(e) => handleSpecificationChange('model', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.model ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter model"
                          />
                          {formErrors.model && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.model}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Capacity
                          </label>
                          <input
                            type="text"
                            value={newEquipment.specifications.capacity}
                            onChange={(e) => handleSpecificationChange('capacity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter capacity"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Voltage
                          </label>
                          <input
                            type="text"
                            value={newEquipment.specifications.voltage}
                            onChange={(e) => handleSpecificationChange('voltage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter voltage"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Installation Date *
                          </label>
                          <input
                            type="date"
                            value={newEquipment.specifications.installation}
                            onChange={(e) => handleSpecificationChange('installation', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.installation ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.installation && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.installation}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCloseAddEquipment}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAddEquipment}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Add Equipment
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

export default PageEquipment;
