import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Users,
  MapPin,
  Calendar,
  FileText,
  Camera,
  Upload,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageWorkOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedTechnician, setSelectedTechnician] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list

  // Add Work Order form states
  const [newWorkOrder, setNewWorkOrder] = useState({
    title: '',
    type: 'Preventive',
    equipment: '',
    location: '',
    technician: '',
    priority: 'Medium',
    dueDate: '',
    estimatedHours: 4,
    description: '',
    technicianType: 'internal',
    selectedInternalTechnician: '',
    selectedVendor: '',
    selectedInternalTechnicianForVendor: ''
  });

  // Sample data work orders
  const workOrdersData = [
    {
      id: 'WO-2025-001',
      title: 'Genset A Preventive Maintenance',
      type: 'Preventive',
      equipment: 'Genset A',
      location: 'SPBU Jakarta Selatan',
      technician: 'Sari Wijaya',
      priority: 'High',
      status: 'In Progress',
      createdDate: '2025-08-15 08:30:00',
      dueDate: '2025-08-20 16:00:00',
      startDate: '2025-08-15 09:00:00',
      completedDate: null,
      estimatedHours: 4,
      actualHours: 2.5,
      description: 'Rutin maintenance genset setiap 250 jam operasi. Cek oli, filter udara, test beban, dan sistem pendingin.',
      checklist: [
        { item: 'Cek level oli', completed: true, notes: 'Level normal' },
        { item: 'Cek filter udara', completed: true, notes: 'Bersih, tidak perlu ganti' },
        { item: 'Test beban', completed: false, notes: '' },
        { item: 'Cek sistem pendingin', completed: false, notes: '' }
      ],
      attachments: [
        { name: 'before_photo_1.jpg', type: 'image', size: '2.1 MB' },
        { name: 'oil_check.jpg', type: 'image', size: '1.8 MB' }
      ],
      history: [
        { date: '2025-08-15 08:30:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-15 09:00:00', action: 'Assigned to Sari Wijaya', user: 'Admin' },
        { date: '2025-08-15 09:15:00', action: 'Work Started', user: 'Sari Wijaya' },
        { date: '2025-08-15 10:30:00', action: 'Oil check completed', user: 'Sari Wijaya' }
      ],
      sla: {
        target: 4, // hours
        remaining: 1.5,
        status: 'On Track'
      }
    },
    {
      id: 'WO-2025-002',
      title: 'Panel Listrik Emergency Repair',
      type: 'Emergency',
      equipment: 'Panel Listrik',
      location: 'SPBU Jakarta Selatan',
      technician: 'Rudi Hermawan',
      priority: 'Critical',
      status: 'Open',
      createdDate: '2025-08-15 14:30:00',
      dueDate: '2025-08-15 18:30:00',
      startDate: null,
      completedDate: null,
      estimatedHours: 2,
      actualHours: 0,
      description: 'Panel listrik trip dan tidak bisa direset. Perlu pengecekan MCB dan grounding.',
      checklist: [
        { item: 'Cek MCB utama', completed: false, notes: '' },
        { item: 'Cek grounding', completed: false, notes: '' },
        { item: 'Test emergency stop', completed: false, notes: '' },
        { item: 'Reset panel', completed: false, notes: '' }
      ],
      attachments: [],
      history: [
        { date: '2025-08-15 14:30:00', action: 'Emergency Work Order Created', user: 'System' },
        { date: '2025-08-15 14:35:00', action: 'Assigned to Rudi Hermawan', user: 'Admin' }
      ],
      sla: {
        target: 4, // hours
        remaining: 4,
        status: 'At Risk'
      }
    },
    {
      id: 'WO-2025-003',
      title: 'CCTV System Maintenance',
      type: 'Preventive',
      equipment: 'CCTV System',
      location: 'SPBU Jakarta Selatan',
      technician: 'Andi Pratama',
      priority: 'Medium',
      status: 'Completed',
      createdDate: '2025-08-14 10:00:00',
      dueDate: '2025-08-15 14:00:00',
      startDate: '2025-08-15 10:00:00',
      completedDate: '2025-08-15 13:30:00',
      estimatedHours: 3,
      actualHours: 3.5,
      description: 'Maintenance kamera CCTV dan DVR. Bersihkan lensa, cek kabel, test recording.',
      checklist: [
        { item: 'Bersihkan lensa kamera', completed: true, notes: 'Semua kamera dibersihkan' },
        { item: 'Cek kabel koneksi', completed: true, notes: 'Kabel dalam kondisi baik' },
        { item: 'Test recording', completed: true, notes: 'Recording berfungsi normal' },
        { item: 'Update firmware', completed: true, notes: 'Firmware terbaru sudah diinstall' }
      ],
      attachments: [
        { name: 'camera_cleaning.jpg', type: 'image', size: '1.5 MB' },
        { name: 'recording_test.mp4', type: 'video', size: '15.2 MB' },
        { name: 'firmware_update.log', type: 'document', size: '0.5 MB' }
      ],
      history: [
        { date: '2025-08-14 10:00:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-15 10:00:00', action: 'Work Started', user: 'Andi Pratama' },
        { date: '2025-08-15 13:30:00', action: 'Work Completed', user: 'Andi Pratama' },
        { date: '2025-08-15 13:35:00', action: 'Work Order Closed', user: 'Supervisor' }
      ],
      sla: {
        target: 4, // hours
        remaining: 0,
        status: 'Completed'
      }
    },
    {
      id: 'WO-2025-004',
      title: 'Dispenser A Calibration',
      type: 'Calibration',
      equipment: 'Dispenser A',
      location: 'SPBU Jakarta Selatan',
      technician: 'Budi Santoso',
      priority: 'Medium',
      status: 'Scheduled',
      createdDate: '2025-08-14 16:00:00',
      dueDate: '2025-08-25 10:00:00',
      startDate: null,
      completedDate: null,
      estimatedHours: 3,
      actualHours: 0,
      description: 'Kalibrasi dispenser untuk akurasi pengukuran. Test flow rate, kalibrasi sensor, cek seal.',
      checklist: [
        { item: 'Test flow rate', completed: false, notes: '' },
        { item: 'Kalibrasi sensor', completed: false, notes: '' },
        { item: 'Cek seal', completed: false, notes: '' },
        { item: 'Test display', completed: false, notes: '' }
      ],
      attachments: [],
      history: [
        { date: '2025-08-14 16:00:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-14 16:05:00', action: 'Scheduled for 2025-08-25', user: 'Admin' }
      ],
      sla: {
        target: 4, // hours
        remaining: 4,
        status: 'On Track'
      }
    },
    {
      id: 'WO-2025-005',
      title: 'ATG System Check',
      type: 'Preventive',
      equipment: 'ATG System',
      location: 'SPBU Jakarta Selatan',
      technician: 'Dedi Kurniawan',
      priority: 'Low',
      status: 'Pending',
      createdDate: '2025-08-13 14:00:00',
      dueDate: '2025-08-28 11:30:00',
      startDate: null,
      completedDate: null,
      estimatedHours: 3,
      actualHours: 0,
      description: 'Pengecekan sistem monitoring tangki. Cek sensor level, test alarm, cek koneksi.',
      checklist: [
        { item: 'Cek sensor level', completed: false, notes: '' },
        { item: 'Test alarm', completed: false, notes: '' },
        { item: 'Cek koneksi', completed: false, notes: '' },
        { item: 'Update software', completed: false, notes: '' }
      ],
      attachments: [],
      history: [
        { date: '2025-08-13 14:00:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-13 14:05:00', action: 'Assigned to Dedi Kurniawan', user: 'Admin' }
      ],
      sla: {
        target: 4, // hours
        remaining: 4,
        status: 'On Track'
      }
    }
  ];

  const statuses = ['All', 'Open', 'Scheduled', 'In Progress', 'Pending', 'Completed', 'Cancelled'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const technicians = ['All', 'Budi Santoso', 'Sari Wijaya', 'Andi Pratama', 'Rudi Hermawan', 'Dedi Kurniawan'];
  const locations = ['All', 'SPBU Jakarta Selatan', 'SPBU Jakarta Utara', 'SPBU Jakarta Barat', 'SPBU Jakarta Timur'];
  
  // Sample data for technicians and vendors
  const internalTechnicians = [
    'Budi Santoso',
    'Sari Wijaya', 
    'Andi Pratama',
    'Rudi Hermawan',
    'Dedi Kurniawan'
  ];
  
  const vendors = [
    'PT Teknik Mandiri',
    'CV Jaya Abadi',
    'PT Sumber Daya Teknik',
    'CV Mitra Sejahtera',
    'PT Prima Teknik'
  ];

  const filteredWorkOrders = workOrdersData.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || wo.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || wo.priority === selectedPriority;
    const matchesTechnician = selectedTechnician === 'All' || wo.technician === selectedTechnician;
    const matchesLocation = selectedLocation === 'All' || wo.location === selectedLocation;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTechnician && matchesLocation;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'text-blue-600 bg-blue-100';
      case 'Scheduled': return 'text-purple-600 bg-purple-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-orange-600 bg-orange-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Preventive': return 'text-blue-600 bg-blue-100';
      case 'Emergency': return 'text-red-600 bg-red-100';
      case 'Calibration': return 'text-purple-600 bg-purple-100';
      case 'Corrective': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSLAStatusColor = (status) => {
    switch (status) {
      case 'On Track': return 'text-green-600 bg-green-100';
      case 'At Risk': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      case 'Completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = (checklist) => {
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const handleEditWorkOrder = (workOrder) => {
    setEditingWorkOrder(workOrder);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // Simulate saving edited work order
    console.log('Saving edited work order:', editingWorkOrder);
    alert('Work Order berhasil diupdate!');
    setShowEditModal(false);
    setEditingWorkOrder(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingWorkOrder(null);
  };

  const handleAddWorkOrder = () => {
    // Simulate creating new work order
    console.log('Creating new work order:', newWorkOrder);
    alert('Work Order berhasil dibuat!');
    setShowAddModal(false);
    setNewWorkOrder({
      title: '',
      type: 'Preventive',
      equipment: '',
      location: '',
      technician: '',
      priority: 'Medium',
      dueDate: '',
      estimatedHours: 4,
      description: '',
      technicianType: 'internal',
      selectedInternalTechnician: '',
      selectedVendor: '',
      selectedInternalTechnicianForVendor: ''
    });
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewWorkOrder({
      title: '',
      type: 'Preventive',
      equipment: '',
      location: '',
      technician: '',
      priority: 'Medium',
      dueDate: '',
      estimatedHours: 4,
      description: '',
      technicianType: 'internal',
      selectedInternalTechnician: '',
      selectedVendor: '',
      selectedInternalTechnicianForVendor: ''
    });
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Work Orders Management</h1>
            <p className="text-gray-600 text-lg">Kelola, pantau, dan track semua work orders maintenance dengan mudah</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">{workOrdersData.length}</div>
                  <div className="text-sm text-gray-600">Total Work Orders</div>
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
                    {workOrdersData.filter(wo => wo.status === 'In Progress').length}
                  </div>
                  <div className="text-sm text-gray-600">Sedang Berjalan</div>
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
                    {workOrdersData.filter(wo => wo.status === 'Completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Selesai</div>
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
                    {workOrdersData.filter(wo => wo.priority === 'Critical').length}
                  </div>
                  <div className="text-sm text-gray-600">Prioritas Kritis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Filter Work Orders</h2>
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'grid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    List
                  </button>
                </div>

                {/* Add Work Order Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Work Order
                </button>
              </div>
            </div>

            {/* Search Bar - Full Width */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Work Order</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan ID, judul, equipment, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* Technician Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Teknisi</label>
                <select
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {technicians.map(technician => (
                    <option key={technician} value={technician}>{technician}</option>
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
                Menampilkan {filteredWorkOrders.length} dari {workOrdersData.length} work orders
              </div>
              <div className="flex items-center space-x-4">
                {(selectedStatus !== 'All' || selectedPriority !== 'All' || selectedTechnician !== 'All' || selectedLocation !== 'All' || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedStatus('All');
                      setSelectedPriority('All');
                      setSelectedTechnician('All');
                      setSelectedLocation('All');
                      setSearchTerm('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reset Filter
                  </button>
                )}
                <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Work Orders Display */}
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkOrders.map((wo) => (
                <div key={wo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{wo.id}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{wo.title}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => setSelectedWorkOrder(wo)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditWorkOrder(wo)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Work Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status & Priority */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(wo.status)}`}>
                      {wo.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(wo.type)}`}>
                      {wo.type}
                    </span>
                  </div>

                  {/* Equipment & Location */}
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Wrench className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="font-medium">{wo.equipment}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{wo.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{wo.technician}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {wo.status === 'In Progress' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className="text-sm font-semibold">{calculateProgress(wo.checklist)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(wo.checklist)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* SLA Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SLA Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSLAStatusColor(wo.sla.status)}`}>
                        {wo.sla.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {wo.sla.remaining}h remaining
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Due: {formatDate(wo.dueDate)}
                    </div>
                    {wo.startDate && (
                      <div className="flex items-center">
                        <Play className="w-4 h-4 mr-2" />
                        Started: {formatDate(wo.startDate)}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2 border-t border-gray-100">
                    {wo.status === 'Open' && (
                      <button className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        <Play className="w-4 h-4 inline mr-1" />
                        Mulai
                      </button>
                    )}
                    {wo.status === 'In Progress' && (
                      <button className="flex-1 px-3 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                        <Pause className="w-4 h-4 inline mr-1" />
                        Pause
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedWorkOrder(wo)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <FileText className="w-4 h-4 inline mr-1" />
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Work Order</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teknisi</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prioritas</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWorkOrders.map((wo) => (
                      <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{wo.id}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{wo.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{wo.equipment}</div>
                          <div className="text-sm text-gray-500">{wo.location}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {wo.technician}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(wo.status)}`}>
                            {wo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                            {wo.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(wo.dueDate)}
                        </td>
                        <td className="px-6 py-4">
                          {wo.status === 'In Progress' ? (
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${calculateProgress(wo.checklist)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600">{calculateProgress(wo.checklist)}%</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedWorkOrder(wo)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditWorkOrder(wo)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Work Order"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Work Order Detail Modal */}
          {selectedWorkOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{selectedWorkOrder.id}</h2>
                      <p className="text-gray-600">{selectedWorkOrder.title}</p>
                    </div>
                    <button
                      onClick={() => setSelectedWorkOrder(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{selectedWorkOrder.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Equipment:</span>
                          <span className="font-medium">{selectedWorkOrder.equipment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{selectedWorkOrder.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Technician:</span>
                          <span className="font-medium">{selectedWorkOrder.technician}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedWorkOrder.priority)}`}>
                            {selectedWorkOrder.priority}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWorkOrder.status)}`}>
                            {selectedWorkOrder.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{formatDate(selectedWorkOrder.createdDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">{formatDate(selectedWorkOrder.dueDate)}</span>
                        </div>
                        {selectedWorkOrder.startDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Started:</span>
                            <span className="font-medium">{formatDate(selectedWorkOrder.startDate)}</span>
                          </div>
                        )}
                        {selectedWorkOrder.completedDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completed:</span>
                            <span className="font-medium">{formatDate(selectedWorkOrder.completedDate)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Hours:</span>
                          <span className="font-medium">{selectedWorkOrder.estimatedHours}h</span>
                        </div>
                        {selectedWorkOrder.actualHours > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual Hours:</span>
                            <span className="font-medium">{selectedWorkOrder.actualHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                      <p className="text-gray-700">{selectedWorkOrder.description}</p>
                    </div>

                    {/* Checklist */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Checklist</h3>
                      <div className="space-y-2">
                        {selectedWorkOrder.checklist.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              item.completed ? 'bg-green-500' : 'bg-gray-300'
                            }`}>
                              {item.completed && <CheckCircle className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {item.item}
                              </span>
                              {item.notes && (
                                <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attachments */}
                    {selectedWorkOrder.attachments.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h3>
                        <div className="space-y-2">
                          {selectedWorkOrder.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-800">{attachment.name}</span>
                              </div>
                              <span className="text-xs text-gray-500">{attachment.size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* History */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">History</h3>
                      <div className="space-y-2">
                        {selectedWorkOrder.history.map((entry, index) => (
                          <div key={index} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">{entry.action}</p>
                              <p className="text-xs text-gray-500">{entry.date} by {entry.user}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button 
                      onClick={() => handleEditWorkOrder(selectedWorkOrder)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2 inline" />
                      Edit
                    </button>
                    {selectedWorkOrder.status === 'Open' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Play className="w-4 h-4 mr-2 inline" />
                        Start Work
                      </button>
                    )}
                    {selectedWorkOrder.status === 'In Progress' && (
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        <Pause className="w-4 h-4 mr-2 inline" />
                        Pause Work
                      </button>
                    )}
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="w-4 h-4 mr-2 inline" />
                      Upload Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Work Order Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Add New Work Order</h2>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={newWorkOrder.title}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter work order title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select 
                          value={newWorkOrder.type}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Preventive">Preventive</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Calibration">Calibration</option>
                          <option value="Corrective">Corrective</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                        <input
                          type="text"
                          value={newWorkOrder.equipment}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, equipment: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter equipment name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                        <input
                          type="number"
                          value={newWorkOrder.estimatedHours}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, estimatedHours: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="4"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select 
                          value={newWorkOrder.priority}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <select 
                          value={newWorkOrder.location}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Lokasi</option>
                          <option value="SPBU Jakarta Selatan">SPBU Jakarta Selatan</option>
                          <option value="SPBU Jakarta Utara">SPBU Jakarta Utara</option>
                          <option value="SPBU Jakarta Barat">SPBU Jakarta Barat</option>
                          <option value="SPBU Jakarta Timur">SPBU Jakarta Timur</option>
                        </select>
                      </div>
                    </div>

                    {/* Technician Type Selection */}
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Tipe Teknisi</label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                        <input
                            type="radio"
                            id="internal"
                            name="technicianType"
                            value="internal"
                            checked={newWorkOrder.technicianType === 'internal'}
                            onChange={(e) => setNewWorkOrder({...newWorkOrder, technicianType: e.target.value})}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="internal" className="ml-2 text-sm text-gray-700">
                            Teknisi Internal
                          </label>
                      </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="vendor"
                            name="technicianType"
                            value="vendor"
                            checked={newWorkOrder.technicianType === 'vendor'}
                            onChange={(e) => setNewWorkOrder({...newWorkOrder, technicianType: e.target.value})}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="vendor" className="ml-2 text-sm text-gray-700">
                            Vendor
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="vendor-internal"
                            name="technicianType"
                            value="vendor-internal"
                            checked={newWorkOrder.technicianType === 'vendor-internal'}
                            onChange={(e) => setNewWorkOrder({...newWorkOrder, technicianType: e.target.value})}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="vendor-internal" className="ml-2 text-sm text-gray-700">
                            Vendor + Teknisi Pendamping
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Technician Selection based on type */}
                    {newWorkOrder.technicianType === 'internal' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Teknisi Internal</label>
                        <select 
                          value={newWorkOrder.selectedInternalTechnician}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, selectedInternalTechnician: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Teknisi Internal</option>
                          {internalTechnicians.map(technician => (
                            <option key={technician} value={technician}>{technician}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {newWorkOrder.technicianType === 'vendor' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                        <select 
                          value={newWorkOrder.selectedVendor}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, selectedVendor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Vendor</option>
                          {vendors.map(vendor => (
                            <option key={vendor} value={vendor}>{vendor}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {newWorkOrder.technicianType === 'vendor-internal' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                          <select 
                            value={newWorkOrder.selectedVendor}
                            onChange={(e) => setNewWorkOrder({...newWorkOrder, selectedVendor: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Pilih Vendor</option>
                            {vendors.map(vendor => (
                              <option key={vendor} value={vendor}>{vendor}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Teknisi Pendamping</label>
                          <select 
                            value={newWorkOrder.selectedInternalTechnicianForVendor}
                            onChange={(e) => setNewWorkOrder({...newWorkOrder, selectedInternalTechnicianForVendor: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Pilih Teknisi Pendamping</option>
                            {internalTechnicians.map(technician => (
                              <option key={technician} value={technician}>{technician}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                        type="datetime-local"
                        value={newWorkOrder.dueDate}
                        onChange={(e) => setNewWorkOrder({...newWorkOrder, dueDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={3}
                        value={newWorkOrder.description}
                        onChange={(e) => setNewWorkOrder({...newWorkOrder, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter work order description"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelAdd}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddWorkOrder}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Work Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Work Order Modal */}
          {showEditModal && editingWorkOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Work Order</h2>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={editingWorkOrder.title}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select 
                          value={editingWorkOrder.type}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Preventive">Preventive</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Calibration">Calibration</option>
                          <option value="Corrective">Corrective</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                        <input
                          type="text"
                          value={editingWorkOrder.equipment}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, equipment: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={editingWorkOrder.location}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technician</label>
                        <select 
                          value={editingWorkOrder.technician}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, technician: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Budi Santoso">Budi Santoso</option>
                          <option value="Sari Wijaya">Sari Wijaya</option>
                          <option value="Andi Pratama">Andi Pratama</option>
                          <option value="Rudi Hermawan">Rudi Hermawan</option>
                          <option value="Dedi Kurniawan">Dedi Kurniawan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select 
                          value={editingWorkOrder.priority}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                          value={editingWorkOrder.status}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Open">Open</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                          type="datetime-local"
                          value={editingWorkOrder.dueDate ? editingWorkOrder.dueDate.slice(0, 16) : ''}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, dueDate: e.target.value + ':00'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                        <input
                          type="number"
                          value={editingWorkOrder.estimatedHours}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, estimatedHours: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Actual Hours</label>
                        <input
                          type="number"
                          value={editingWorkOrder.actualHours}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, actualHours: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={3}
                        value={editingWorkOrder.description}
                        onChange={(e) => setEditingWorkOrder({...editingWorkOrder, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Checklist Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Checklist</label>
                      <div className="space-y-2">
                        {editingWorkOrder.checklist.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={(e) => {
                                const newChecklist = [...editingWorkOrder.checklist];
                                newChecklist[index].completed = e.target.checked;
                                setEditingWorkOrder({...editingWorkOrder, checklist: newChecklist});
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              value={item.item}
                              onChange={(e) => {
                                const newChecklist = [...editingWorkOrder.checklist];
                                newChecklist[index].item = e.target.value;
                                setEditingWorkOrder({...editingWorkOrder, checklist: newChecklist});
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="text"
                              value={item.notes}
                              onChange={(e) => {
                                const newChecklist = [...editingWorkOrder.checklist];
                                newChecklist[index].notes = e.target.value;
                                setEditingWorkOrder({...editingWorkOrder, checklist: newChecklist});
                              }}
                              placeholder="Notes..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
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

export default PageWorkOrders;
