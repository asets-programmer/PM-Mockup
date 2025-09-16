import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Info,
  X,
  Bell,
  BellRing,
  Calendar,
  Wrench,
  Activity,
  FileText,
  UserPlus,
  Eye,
  Play,
  RotateCcw,
  BarChart3,
  Upload,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageNotifications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionData, setActionData] = useState(null);
  const [showCreateWorkOrderModal, setShowCreateWorkOrderModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [workOrderData, setWorkOrderData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    technicianType: 'internal',
    selectedInternalTechnician: '',
    selectedVendor: '',
    selectedInternalTechnicianForVendor: '',
    estimatedHours: 4,
    scheduledDate: '',
    scheduledTime: ''
  });
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });

  // Sample data notifikasi
  const notificationsData = [
    {
      id: 'NOT-001',
      type: 'High Priority Alert',
      category: 'alert',
      title: 'Genset A Temperature Exceeded',
      message: 'Temperature sensor detected 85°C on Genset A at SPBU Jakarta Selatan. Immediate attention required.',
      location: 'SPBU Jakarta Selatan',
      equipment: 'Genset A',
      severity: 'High',
      timestamp: '2025-08-15 14:30:25',
      status: 'Unread',
      priority: 'Critical',
      workOrder: 'WO-2025-001',
      actions: ['Create Work Order', 'View Equipment']
    },
    {
      id: 'NOT-002',
      type: 'Maintenance Due',
      category: 'warning',
      title: 'Panel Listrik Scheduled Maintenance',
      message: 'Panel Listrik at SPBU Jakarta Selatan requires preventive maintenance today. Checklist ready.',
      location: 'SPBU Jakarta Selatan',
      equipment: 'Panel Listrik',
      severity: 'Medium',
      timestamp: '2025-08-15 08:00:00',
      status: 'Read',
      priority: 'Medium',
      technician: 'Rudi Hermawan',
      workOrder: 'WO-2025-002',
      actions: ['View Work Order', 'Reschedule']
    },
    {
      id: 'NOT-003',
      type: 'Task Completed',
      category: 'success',
      title: 'CCTV Maintenance Completed',
      message: 'CCTV System maintenance completed successfully by Andi Pratama. All cameras operational.',
      location: 'SPBU Jakarta Selatan',
      equipment: 'CCTV System',
      severity: 'Low',
      timestamp: '2025-08-15 12:45:30',
      status: 'Read',
      priority: 'Low',
      technician: 'Andi Pratama',
      workOrder: 'WO-2025-003',
      actions: ['View Report', 'Verify Work', 'Close Work Order']
    },
    {
      id: 'NOT-005',
      type: 'High Priority Alert',
      category: 'alert',
      title: 'Dispenser A Flow Rate Anomaly',
      message: 'Dispenser A showing irregular flow rate pattern. Possible pump issue detected.',
      location: 'SPBU Jakarta Selatan',
      equipment: 'Dispenser A',
      severity: 'High',
      timestamp: '2025-08-15 10:15:42',
      status: 'Unread',
      priority: 'High',
      technician: 'Budi Santoso',
      workOrder: 'WO-2025-004',
      actions: ['Create Work Order', 'View Equipment']
    },
    {
      id: 'NOT-006',
      type: 'Maintenance Due',
      category: 'warning',
      title: 'ATG System Calibration Due',
      message: 'ATG System requires monthly calibration. Scheduled for tomorrow morning.',
      location: 'SPBU Jakarta Selatan',
      equipment: 'ATG System',
      severity: 'Medium',
      timestamp: '2025-08-14 16:30:00',
      status: 'Read',
      priority: 'Medium',
      technician: 'Dedi Kurniawan',
      workOrder: 'WO-2025-005',
      actions: ['View Work Order', 'Reschedule']
    },
    {
      id: 'NOT-007',
      type: 'Task Completed',
      category: 'success',
      title: 'Computer System Update Completed',
      message: 'Software update completed successfully on Computer System. All applications running normally.',
      location: 'SPBU Jakarta Selatan',
      equipment: 'Computer System',
      severity: 'Low',
      timestamp: '2025-08-14 15:30:20',
      status: 'Read',
      priority: 'Low',
      technician: 'Eko Susanto',
      workOrder: 'WO-2025-006',
      actions: ['View Report', 'Verify Work', 'Close Work Order']
    },
  ];

  const notificationTypes = ['All', 'High Priority Alert', 'Maintenance Due', 'Task Completed'];
  const statuses = ['All', 'Unread', 'Read'];
  const locations = ['All', 'SPBU Jakarta Selatan', 'SPBU Jakarta Utara', 'SPBU Jakarta Barat', 'SPBU Jakarta Timur'];
  
  // Sample data untuk teknisi dan vendor
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

  const filteredNotifications = notificationsData.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || notification.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || notification.status === selectedStatus;
    const matchesLocation = selectedLocation === 'All' || notification.location === selectedLocation;
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'alert': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} hari yang lalu`;
    }
  };

  // Action handlers
  const handleAction = (action, notification) => {
    setActionData(notification);
    setActionType(action);
    
    switch (action) {
      case 'Create Work Order':
        setWorkOrderData({
          title: notification.title,
          description: notification.message,
          priority: notification.priority,
          technicianType: 'internal',
          selectedInternalTechnician: '',
          selectedVendor: '',
          selectedInternalTechnicianForVendor: '',
          estimatedHours: 4,
          scheduledDate: '',
          scheduledTime: ''
        });
        setShowCreateWorkOrderModal(true);
        break;
      case 'View Equipment':
        navigate('/equipment');
        break;
      case 'View Work Order':
        navigate('/work-orders');
        break;
      case 'Reschedule':
        setRescheduleData({
          newDate: '',
          newTime: '',
          reason: ''
        });
        setShowRescheduleModal(true);
        break;
      case 'View Dashboard':
        navigate('/dashboard');
        break;
      case 'Export Report':
        handleExportReport(notification);
        break;
      case 'View Report':
        setReportData({
          workOrderId: notification.workOrder,
          title: notification.title,
          equipment: notification.equipment,
          location: notification.location,
          technician: notification.technician,
          completedDate: '2025-08-15 12:45:30',
          checklist: [
            { item: 'Cek kondisi kamera', status: 'completed', notes: 'Semua kamera berfungsi normal' },
            { item: 'Bersihkan lensa kamera', status: 'completed', notes: 'Lensa sudah dibersihkan dengan baik' },
            { item: 'Test recording', status: 'completed', notes: 'Recording berfungsi dengan baik' },
            { item: 'Cek koneksi jaringan', status: 'completed', notes: 'Koneksi stabil' },
            { item: 'Update firmware', status: 'completed', notes: 'Firmware sudah diupdate ke versi terbaru' }
          ],
          photos: [
            { id: 1, name: 'camera_condition.jpg', url: '/photos/camera_condition.jpg' },
            { id: 2, name: 'lens_cleaning.jpg', url: '/photos/lens_cleaning.jpg' },
            { id: 3, name: 'recording_test.jpg', url: '/photos/recording_test.jpg' }
          ],
          notes: 'Maintenance CCTV System berhasil diselesaikan. Semua kamera berfungsi normal dan recording berjalan dengan baik. Tidak ada masalah yang ditemukan.',
          status: 'Completed'
        });
        setShowReportModal(true);
        break;
      case 'Verify Work':
        setShowActionModal(true);
        break;
      case 'Close Work Order':
        setShowActionModal(true);
        break;
      case 'View Log':
        setShowActionModal(true);
        break;
      case 'Verify Backup':
        setShowActionModal(true);
        break;
      default:
        console.log(`Action ${action} not implemented yet`);
    }
  };

  const handleExportReport = (notification) => {
    // Simulate export functionality
    const data = {
      notification: notification,
      timestamp: new Date().toISOString(),
      exportedBy: 'Admin'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notification-${notification.id}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const confirmAction = () => {
    // Simulate action confirmation
    alert(`Action "${actionType}" confirmed for notification ${actionData.id}`);
    setShowActionModal(false);
    setActionType('');
    setActionData(null);
  };

  const handleCreateWorkOrder = () => {
    // Simulate creating work order
    console.log('Creating work order:', workOrderData);
    alert('Work Order berhasil dibuat!');
    setShowCreateWorkOrderModal(false);
    setWorkOrderData({
      title: '',
      description: '',
      priority: 'Medium',
      technicianType: 'internal',
      selectedInternalTechnician: '',
      selectedVendor: '',
      selectedInternalTechnicianForVendor: '',
      estimatedHours: 4,
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  const handleCancelCreateWorkOrder = () => {
    setShowCreateWorkOrderModal(false);
    setWorkOrderData({
      title: '',
      description: '',
      priority: 'Medium',
      technicianType: 'internal',
      selectedInternalTechnician: '',
      selectedVendor: '',
      selectedInternalTechnicianForVendor: '',
      estimatedHours: 4,
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  const handleReschedule = () => {
    // Simulate rescheduling
    console.log('Rescheduling:', rescheduleData);
    alert('Maintenance berhasil di-reschedule!');
    setShowRescheduleModal(false);
    setRescheduleData({
      newDate: '',
      newTime: '',
      reason: ''
    });
  };

  const handleCancelReschedule = () => {
    setShowRescheduleModal(false);
    setRescheduleData({
      newDate: '',
      newTime: '',
      reason: ''
    });
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
    setReportData(null);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'Create Work Order': return <FileText className="w-4 h-4" />;
      case 'View Equipment': return <Eye className="w-4 h-4" />;
      case 'View Work Order': return <FileText className="w-4 h-4" />;
      case 'Reschedule': return <RotateCcw className="w-4 h-4" />;
      case 'View Dashboard': return <BarChart3 className="w-4 h-4" />;
      case 'Export Report': return <Upload className="w-4 h-4" />;
      case 'View Report': return <BarChart3 className="w-4 h-4" />;
      case 'Verify Work': return <CheckCircle2 className="w-4 h-4" />;
      case 'Close Work Order': return <XCircle className="w-4 h-4" />;
      case 'View Log': return <FileCheck className="w-4 h-4" />;
      case 'Verify Backup': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'Create Work Order':
      case 'Verify Work':
      case 'Verify Backup':
        return 'bg-green-50 text-green-600 hover:bg-green-100';
      case 'Reschedule':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-100';
      case 'View Equipment':
      case 'View Work Order':
      case 'View Dashboard':
      case 'View Report':
      case 'View Log':
        return 'bg-gray-50 text-gray-600 hover:bg-gray-100';
      case 'Export Report':
        return 'bg-purple-50 text-purple-600 hover:bg-purple-100';
      case 'Close Work Order':
        return 'bg-red-50 text-red-600 hover:bg-red-100';
      default:
        return 'bg-blue-50 text-blue-600 hover:bg-blue-100';
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
            <p className="text-gray-600">Kelola dan pantau semua notifikasi sistem</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">3</div>
                  <div className="text-sm text-gray-600">High Priority</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">2</div>
                  <div className="text-sm text-gray-600">Maintenance Due</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">2</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">6</div>
                  <div className="text-sm text-gray-600">Total Notifications</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari notifikasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {notificationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              {/* Export Button */}
              <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">All Notifications</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className={`p-6 hover:bg-gray-50 transition-colors ${getCategoryColor(notification.category)}`}>
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getCategoryIcon(notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {notification.title}
                            </h3>
                            {notification.status === 'Unread' && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-3">{notification.message}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatTimestamp(notification.timestamp)}
                            </div>
                            <div className="flex items-center">
                              <Activity className="w-4 h-4 mr-1" />
                              {notification.location}
                            </div>
                            <div className="flex items-center">
                              <Wrench className="w-4 h-4 mr-1" />
                              {notification.equipment}
                            </div>
                            {notification.type === 'Maintenance Due' && notification.technician && (
                              <div className="flex items-center">
                                <UserPlus className="w-4 h-4 mr-1" />
                                Technician: {notification.technician}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(notification.severity)}`}>
                              {notification.severity}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {notification.workOrder && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {notification.workOrder}
                              </span>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-2">
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleAction(action, notification)}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 ${getActionColor(action)}`}
                              >
                                {getActionIcon(action)}
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex-shrink-0 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            notification.status === 'Unread' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Detail Modal */}
          {selectedNotification && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Notification Detail
                    </h2>
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {selectedNotification.title}
                      </h3>
                      <p className="text-gray-700">{selectedNotification.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <p className="text-gray-800">{selectedNotification.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Equipment</label>
                        <p className="text-gray-800">{selectedNotification.equipment}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Severity</label>
                        <p className="text-gray-800">{selectedNotification.severity}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Priority</label>
                        <p className="text-gray-800">{selectedNotification.priority}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-800 mb-2">Available Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNotification.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => handleAction(action, selectedNotification)}
                            className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${getActionColor(action)}`}
                          >
                            {getActionIcon(action)}
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Confirmation Modal */}
          {showActionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Confirm Action</h2>
                    <button
                      onClick={() => setShowActionModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getActionColor(actionType).split(' ')[0]}`}>
                      {getActionIcon(actionType)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{actionType}</h3>
                      <p className="text-sm text-gray-600">Notification: {actionData?.title}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">Action Details:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Equipment:</strong> {actionData?.equipment}</p>
                      <p><strong>Location:</strong> {actionData?.location}</p>
                      <p><strong>Priority:</strong> {actionData?.priority}</p>
                      {actionData?.type === 'Maintenance Due' && actionData?.technician && (
                        <p><strong>Technician:</strong> {actionData.technician}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowActionModal(false)}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmAction}
                      className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                        actionType.includes('Close') || actionType.includes('Verify')
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {getActionIcon(actionType)}
                      Confirm {actionType}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Work Order Modal */}
          {showCreateWorkOrderModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Create Work Order</h2>
                    <button
                      onClick={handleCancelCreateWorkOrder}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={workOrderData.title}
                        onChange={(e) => setWorkOrderData({...workOrderData, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter work order title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={3}
                        value={workOrderData.description}
                        onChange={(e) => setWorkOrderData({...workOrderData, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter work order description"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select 
                          value={workOrderData.priority}
                          onChange={(e) => setWorkOrderData({...workOrderData, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                        <input
                          type="number"
                          value={workOrderData.estimatedHours}
                          onChange={(e) => setWorkOrderData({...workOrderData, estimatedHours: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="4"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Jadwal</label>
                        <input
                          type="date"
                          value={workOrderData.scheduledDate}
                          onChange={(e) => setWorkOrderData({...workOrderData, scheduledDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Jadwal</label>
                        <input
                          type="time"
                          value={workOrderData.scheduledTime}
                          onChange={(e) => setWorkOrderData({...workOrderData, scheduledTime: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Technician Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Tipe Teknisi</label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="internal-notif"
                            name="technicianType"
                            value="internal"
                            checked={workOrderData.technicianType === 'internal'}
                            onChange={(e) => setWorkOrderData({...workOrderData, technicianType: e.target.value})}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="internal-notif" className="ml-2 text-sm text-gray-700">
                            Teknisi Internal
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="vendor-notif"
                            name="technicianType"
                            value="vendor"
                            checked={workOrderData.technicianType === 'vendor'}
                            onChange={(e) => setWorkOrderData({...workOrderData, technicianType: e.target.value})}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="vendor-notif" className="ml-2 text-sm text-gray-700">
                            Vendor
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="vendor-internal-notif"
                            name="technicianType"
                            value="vendor-internal"
                            checked={workOrderData.technicianType === 'vendor-internal'}
                            onChange={(e) => setWorkOrderData({...workOrderData, technicianType: e.target.value})}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="vendor-internal-notif" className="ml-2 text-sm text-gray-700">
                            Vendor + Teknisi Pendamping
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Technician Selection based on type */}
                    {workOrderData.technicianType === 'internal' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Teknisi Internal</label>
                        <select 
                          value={workOrderData.selectedInternalTechnician}
                          onChange={(e) => setWorkOrderData({...workOrderData, selectedInternalTechnician: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Teknisi Internal</option>
                          {internalTechnicians.map(technician => (
                            <option key={technician} value={technician}>{technician}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {workOrderData.technicianType === 'vendor' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                        <select 
                          value={workOrderData.selectedVendor}
                          onChange={(e) => setWorkOrderData({...workOrderData, selectedVendor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Vendor</option>
                          {vendors.map(vendor => (
                            <option key={vendor} value={vendor}>{vendor}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {workOrderData.technicianType === 'vendor-internal' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                          <select 
                            value={workOrderData.selectedVendor}
                            onChange={(e) => setWorkOrderData({...workOrderData, selectedVendor: e.target.value})}
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
                            value={workOrderData.selectedInternalTechnicianForVendor}
                            onChange={(e) => setWorkOrderData({...workOrderData, selectedInternalTechnicianForVendor: e.target.value})}
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
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelCreateWorkOrder}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleCreateWorkOrder}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Work Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reschedule Modal */}
          {showRescheduleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Reschedule Maintenance</h2>
                    <button
                      onClick={handleCancelReschedule}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Baru</label>
                      <input
                        type="date"
                        value={rescheduleData.newDate}
                        onChange={(e) => setRescheduleData({...rescheduleData, newDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Baru</label>
                      <input
                        type="time"
                        value={rescheduleData.newTime}
                        onChange={(e) => setRescheduleData({...rescheduleData, newTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alasan Reschedule</label>
                      <textarea
                        rows={3}
                        value={rescheduleData.reason}
                        onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan alasan reschedule..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelReschedule}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleReschedule}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Confirm Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Report Modal */}
          {showReportModal && reportData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Work Order Report</h2>
                    <button
                      onClick={handleCloseReport}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{reportData.title}</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Work Order ID:</strong> {reportData.workOrderId}</p>
                          <p><strong>Equipment:</strong> {reportData.equipment}</p>
                          <p><strong>Location:</strong> {reportData.location}</p>
                          <p><strong>Technician:</strong> {reportData.technician}</p>
                          <p><strong>Completed:</strong> {reportData.completedDate}</p>
                          <p><strong>Status:</strong> <span className="text-green-600 font-medium">{reportData.status}</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Checklist</h4>
                      <div className="space-y-3">
                        {reportData.checklist.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                              {item.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.item}</p>
                              {item.notes && (
                                <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Photos Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Photos</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {reportData.photos.map((photo) => (
                          <div key={photo.id} className="relative group">
                            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                              <div className="text-center">
                                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600">{photo.name}</p>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all">
                              <button className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 rounded-full p-2 transition-all">
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">Notes</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{reportData.notes}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <button
                        onClick={handleCloseReport}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Report
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

export default PageNotifications;
