import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  X,
  Wrench,
  Activity,
  FileText,
  UserPlus,
  Eye,
  Play,
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Download,
  Grid3X3,
  List
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageNotificationsTeknisi = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionData, setActionData] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Sample data notifikasi untuk teknisi
  const notificationsData = [
    {
      id: 'NOT-TEK-TEST',
      type: 'new_task',
      title: 'Test Notifikasi',
      message: 'Ini adalah notifikasi test untuk memastikan tampilan berfungsi',
      equipment: 'Test Equipment',
      location: 'Test Location',
      priority: 'High',
      timestamp: '2025-01-15 14:30:25',
      status: 'Unread',
      category: 'task',
      workOrder: 'TA-TEST-001',
      dueDate: '2025-01-20',
      actions: ['Start Task', 'View Detail']
    },
    {
      id: 'NOT-TEK-001',
      type: 'new_task',
      title: 'Pekerjaan Baru',
      message: 'Task maintenance Genset A telah ditugaskan kepada Anda',
      equipment: 'Genset A',
      location: 'Gudang Utama',
      priority: 'Medium',
      timestamp: '2025-01-15 14:30:25',
      status: 'Unread',
      category: 'task',
      workOrder: 'TA-2025-001',
      dueDate: '2025-01-20',
      actions: ['Start Task', 'View Detail']
    },
    {
      id: 'NOT-TEK-002',
      type: 'deadline',
      title: 'Deadline Mendekat',
      message: 'Task Dispenser A akan jatuh tempo dalam 2 jam',
      equipment: 'Dispenser A',
      location: 'Area Pump',
      priority: 'High',
      timestamp: '2025-01-15 10:15:42',
      status: 'Unread',
      category: 'deadline',
      workOrder: 'TA-2025-002',
      dueDate: '2025-01-15',
      actions: ['View Task', 'Update Progress']
    },
    {
      id: 'NOT-TEK-003',
      type: 'report_approved',
      title: 'Laporan Disetujui',
      message: 'Laporan maintenance Panel Listrik telah disetujui oleh ABH',
      equipment: 'Panel Listrik',
      location: 'Ruang Server',
      priority: 'Low',
      timestamp: '2025-01-15 12:45:30',
      status: 'Read',
      category: 'approval',
      workOrder: 'TA-2025-003',
      dueDate: '2025-01-10',
      actions: ['View Report', 'Download']
    },
    {
      id: 'NOT-TEK-004',
      type: 'report_rejected',
      title: 'Laporan Ditolak',
      message: 'Laporan maintenance Tank Monitoring ditolak - perlu revisi',
      equipment: 'Tank Monitoring',
      location: 'Area Tank',
      priority: 'High',
      timestamp: '2025-01-15 09:30:15',
      status: 'Unread',
      category: 'rejection',
      workOrder: 'TA-2025-004',
      dueDate: '2025-01-08',
      actions: ['View Task', 'Resubmit Report']
    }
  ];

  const [notifications, setNotifications] = useState(notificationsData);

  const notificationTypes = ['All', 'new_task', 'deadline', 'report_approved', 'report_rejected', 'maintenance_reminder', 'equipment_alert', 'task_completed'];
  const statuses = ['All', 'Unread', 'Read'];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.equipment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || notification.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || notification.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Mark as read functions
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: 'Read' }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, status: 'Read' }))
    );
  };

  const unreadCount = notifications.filter(notif => notif.status === 'Unread').length;

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'task': return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'deadline': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'approval': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejection': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'reminder': return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'completion': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'task': return 'border-l-blue-500 bg-blue-50';
      case 'deadline': return 'border-l-orange-500 bg-orange-50';
      case 'approval': return 'border-l-green-500 bg-green-50';
      case 'rejection': return 'border-l-orange-500 bg-orange-50';
      case 'reminder': return 'border-l-yellow-500 bg-yellow-50';
      case 'alert': return 'border-l-red-500 bg-red-50';
      case 'completion': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
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
      case 'Start Task':
        navigate('/pertare/task');
        break;
      case 'View Detail':
        setSelectedNotification(notification);
        break;
      case 'View Task':
        navigate('/pertare/task');
        break;
      case 'Update Progress':
        navigate('/pertare/task');
        break;
      case 'View Report':
        setShowActionModal(true);
        break;
      case 'Download':
        handleDownloadReport(notification);
        break;
      case 'Resubmit Report':
        navigate('/pertare/maintenance-report');
        break;
      default:
        console.log(`Action ${action} not implemented yet`);
    }
  };

  const handleDownloadReport = (notification) => {
    // Simulate download functionality
    const data = {
      notification: notification,
      timestamp: new Date().toISOString(),
      downloadedBy: 'Teknisi'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${notification.id}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const confirmAction = () => {
    alert(`Action "${actionType}" confirmed untuk notifikasi ${actionData.id}`);
    setShowActionModal(false);
    setActionType('');
    setActionData(null);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'Start Task': return <Play className="w-4 h-4" />;
      case 'View Detail': return <Eye className="w-4 h-4" />;
      case 'View Task': return <FileText className="w-4 h-4" />;
      case 'Update Progress': return <Activity className="w-4 h-4" />;
      case 'View Report': return <FileText className="w-4 h-4" />;
      case 'Download': return <Download className="w-4 h-4" />;
      case 'Resubmit Report': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'Start Task':
        return 'bg-green-50 text-green-600 hover:bg-green-100';
      case 'Update Progress':
      case 'Resubmit Report':
        return 'bg-blue-50 text-blue-600 hover:bg-blue-100';
      case 'View Detail':
      case 'View Task':
      case 'View Report':
        return 'bg-gray-50 text-gray-600 hover:bg-gray-100';
      case 'Download':
        return 'bg-purple-50 text-purple-600 hover:bg-purple-100';
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
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notifikasi Teknisi</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {notifications.filter(n => n.type === 'new_task').length}
                  </div>
                  <div className="text-sm text-gray-600">Task Baru</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {notifications.filter(n => n.type === 'deadline').length}
                  </div>
                  <div className="text-sm text-gray-600">Deadline</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {unreadCount}
                  </div>
                  <div className="text-sm text-gray-600">Belum Dibaca</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {notifications.filter(n => n.type === 'task_completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Selesai</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="order-3 md:order-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pencarian Notifikasi
                </label>
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
              </div>

              {/* Type Filter */}
              <div className="order-1 md:order-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Jenis Notifikasi
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {notificationTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'new_task' ? 'Task Baru' :
                       type === 'deadline' ? 'Deadline' :
                       type === 'report_approved' ? 'Laporan Disetujui' :
                       type === 'report_rejected' ? 'Laporan Ditolak' :
                       type === 'maintenance_reminder' ? 'Pengingat Maintenance' :
                       type === 'equipment_alert' ? 'Alert Equipment' :
                       type === 'task_completed' ? 'Task Selesai' : type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="order-2 md:order-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status Notifikasi
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'Unread' ? 'Belum Dibaca' :
                       status === 'Read' ? 'Sudah Dibaca' : status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mark All as Read Button */}
              <div className="order-4 md:order-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tindakan
                </label>
                <button 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className={`w-full md:w-auto flex items-center justify-center px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    unreadCount === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Tandai Semua Dibaca ({unreadCount})
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Notifikasi</h2>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Total: {filteredNotifications.length} notifikasi
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
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {filteredNotifications.length > 0 ? (
                <>
                  {/* Grid View */}
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 cursor-pointer ${getCategoryColor(notification.category)} ${
                            notification.status === 'Unread' ? 'border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => {
                            if (notification.status === 'Unread') {
                              markAsRead(notification.id);
                            }
                            setSelectedNotification(notification);
                          }}
                        >
                          {/* Notification Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getCategoryIcon(notification.category)}
                                <h3 className={`text-lg font-semibold ${
                                  notification.status === 'Unread' ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </h3>
                              </div>
                              {notification.status === 'Unread' && (
                                <div className="flex items-center space-x-1 mb-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                    NEW
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.status === 'Unread' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.status === 'Unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
                            </span>
                          </div>

                          {/* Notification Content */}
                          <p className="text-gray-700 mb-3 text-sm line-clamp-3">{notification.message}</p>
                          
                          {/* Notification Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-xs">
                              <Calendar className="w-3 h-3 text-gray-400 mr-2" />
                              <span className="text-gray-600">{formatTimestamp(notification.timestamp)}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <MapPin className="w-3 h-3 text-gray-400 mr-2" />
                              <span className="text-gray-600">{notification.location}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Wrench className="w-3 h-3 text-gray-400 mr-2" />
                              <span className="text-gray-600">{notification.equipment}</span>
                            </div>
                            <div className="flex items-center text-xs">
                              <Clock className="w-3 h-3 text-gray-400 mr-2" />
                              <span className="text-gray-600">Due: {notification.dueDate}</span>
                            </div>
                          </div>

                          {/* Priority and Work Order */}
                          <div className="flex flex-wrap items-center gap-2 mb-4">
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
                          <div className="flex flex-wrap gap-2 pt-3 border-t">
                            {notification.status === 'Unread' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                className="px-2 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Mark Read
                              </button>
                            )}
                            {notification.actions.slice(0, 2).map((action, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAction(action, notification);
                                }}
                                className={`px-2 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 ${getActionColor(action)}`}
                              >
                                {getActionIcon(action)}
                                {action}
                              </button>
                            ))}
                            {notification.actions.length > 2 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{notification.actions.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* List View */}
                  {viewMode === 'list' && (
                    <div className="divide-y divide-gray-200">
                      {filteredNotifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${getCategoryColor(notification.category)} ${
                            notification.status === 'Unread' ? 'border-l-4 border-l-blue-500' : ''
                          }`}
                          onClick={() => {
                            if (notification.status === 'Unread') {
                              markAsRead(notification.id);
                            }
                            setSelectedNotification(notification);
                          }}
                        >
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
                                    <h3 className={`text-lg font-semibold ${
                                      notification.status === 'Unread' ? 'text-gray-900' : 'text-gray-700'
                                    }`}>
                                      {notification.title}
                                    </h3>
                                    {notification.status === 'Unread' && (
                                      <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                          NEW
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <p className="text-gray-700 mb-3">{notification.message}</p>
                                  
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                      <Calendar className="w-4 h-4 mr-1" />
                                      {formatTimestamp(notification.timestamp)}
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="w-4 h-4 mr-1" />
                                      {notification.location}
                                    </div>
                                    <div className="flex items-center">
                                      <Wrench className="w-4 h-4 mr-1" />
                                      {notification.equipment}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="w-4 h-4 mr-1" />
                                      Due: {notification.dueDate}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2 mb-4">
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
                                    {notification.status === 'Unread' && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markAsRead(notification.id);
                                        }}
                                        className="px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Mark as Read
                                      </button>
                                    )}
                                    {notification.actions.map((action, index) => (
                                      <button
                                        key={index}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAction(action, notification);
                                        }}
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
                                    {notification.status === 'Unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada notifikasi</h3>
                  <p className="text-gray-500">Coba ubah filter pencarian Anda.</p>
                </div>
              )}
            </div>
          </div>

          {/* Notification Detail Modal */}
          {selectedNotification && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Detail Notifikasi
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
                        <label className="text-sm font-medium text-gray-600">Equipment</label>
                        <p className="text-gray-800">{selectedNotification.equipment}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <p className="text-gray-800">{selectedNotification.location}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Priority</label>
                        <p className="text-gray-800">{selectedNotification.priority}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Due Date</label>
                        <p className="text-gray-800">{selectedNotification.dueDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Work Order</label>
                        <p className="text-gray-800">{selectedNotification.workOrder}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <p className="text-gray-800">{selectedNotification.status === 'Unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-gray-800 mb-2">Available Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedNotification.status === 'Unread' && (
                          <button
                            onClick={() => {
                              markAsRead(selectedNotification.id);
                              setSelectedNotification({...selectedNotification, status: 'Read'});
                            }}
                            className="px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 bg-green-50 text-green-600 hover:bg-green-100"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark as Read
                          </button>
                        )}
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
                      <p><strong>Work Order:</strong> {actionData?.workOrder}</p>
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      {getActionIcon(actionType)}
                      Confirm {actionType}
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

export default PageNotificationsTeknisi;