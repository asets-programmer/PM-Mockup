import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  Clock,
  AlertTriangle,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Edit,
  Eye,
  Plus,
  Wrench,
  CheckCircle
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [listView, setListView] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  
  // Form state for create task modal
  const [taskForm, setTaskForm] = useState({
    title: '',
    type: 'Preventive',
    equipment: '',
    estimatedHours: 4,
    priority: 'Medium',
    location: '',
    technicianType: 'Teknisi Internal',
    technician: '',
    dueDate: '',
    dueTime: '',
    description: ''
  });

  // Form state for add schedule modal
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    type: 'Emergency',
    equipment: '',
    location: '',
    technician: '',
    startDate: '',
    endDate: '',
    startTime: '08:00',
    endTime: '12:00',
    priority: 'High',
    description: '',
    reason: 'Breakdown',
    createTask: true
  });

  // Sample data equipment (diambil dari PageEquipment)
  const equipmentData = [
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
    }
  ];

  // Sample data for dropdowns
  const locations = [
    'SPBU Jakarta Selatan',
    'SPBU Jakarta Utara', 
    'SPBU Jakarta Timur',
    'SPBU Jakarta Barat',
    'SPBU Jakarta Pusat'
  ];

  const technicians = [
    'Budi Santoso',
    'Sari Wijaya', 
    'Andi Pratama',
    'Rudi Hermawan',
    'Dedi Kurniawan',
    'Eko Susanto'
  ];

  // Generate schedule data dari equipment data
  const scheduleData = equipmentData.map(equipment => {
    const nextMaintenanceDate = new Date(equipment.nextMaintenance);
    const isOverdue = nextMaintenanceDate < new Date();
    const isDueSoon = nextMaintenanceDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari ke depan
    
    let priority = 'Low';
    if (isOverdue) priority = 'High';
    else if (isDueSoon) priority = 'Medium';
    
    let status = 'Scheduled';
    if (isOverdue) status = 'Overdue';
    else if (isDueSoon) status = 'Due Soon';

    return {
      id: `SCH-${equipment.id}`,
      title: `${equipment.name} Preventive Maintenance`,
      type: 'Preventive',
      equipment: equipment.name,
      location: equipment.location,
      technician: equipment.technician,
      startDate: equipment.nextMaintenance,
      endDate: equipment.nextMaintenance,
      startTime: '08:00',
      endTime: '12:00',
      priority: priority,
      status: status,
      description: `Rutin maintenance ${equipment.name} sesuai interval yang ditentukan`,
      health: equipment.health,
      category: equipment.category,
      specifications: equipment.specifications,
      checklist: [
        'Cek kondisi umum equipment',
        'Cek performa sistem',
        'Cek koneksi dan wiring',
        'Test fungsi utama',
        'Update log maintenance'
      ]
    };
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      case 'Due Soon': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Preventive': return 'text-blue-600 bg-blue-100';
      case 'Inspection': return 'text-yellow-600 bg-yellow-100';
      case 'Calibration': return 'text-purple-600 bg-purple-100';
      case 'Maintenance': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getSchedulesForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return scheduleData.filter(schedule => schedule.startDate === dateString);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleCreateTask = (schedule) => {
    setSelectedSchedule(schedule);
    // Initialize form with schedule data
    setTaskForm({
      title: schedule.title,
      type: schedule.type,
      equipment: schedule.equipment,
      estimatedHours: 4,
      priority: schedule.priority,
      location: schedule.location,
      technicianType: 'Teknisi Internal',
      technician: schedule.technician,
      dueDate: schedule.startDate,
      dueTime: schedule.startTime,
      description: schedule.description
    });
    setShowCreateTaskModal(true);
  };

  const handleCloseCreateTask = () => {
    setShowCreateTaskModal(false);
    setSelectedSchedule(null);
    // Reset form
    setTaskForm({
      title: '',
      type: 'Preventive',
      equipment: '',
      estimatedHours: 4,
      priority: 'Medium',
      location: '',
      technicianType: 'Teknisi Internal',
      technician: '',
      dueDate: '',
      dueTime: '',
      description: ''
    });
  };

  const handleFormChange = (field, value) => {
    setTaskForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitCreateTask = () => {
    // Simulate creating work order from form data
    console.log('Creating work order from form:', taskForm);
    alert(`Task berhasil dibuat!\n\nTitle: ${taskForm.title}\nEquipment: ${taskForm.equipment}\nTechnician: ${taskForm.technician}\nDue Date: ${taskForm.dueDate} ${taskForm.dueTime}`);
    handleCloseCreateTask();
  };

  // Add Schedule Functions
  const handleAddSchedule = () => {
    setScheduleForm({
      title: '',
      type: 'Emergency',
      equipment: '',
      location: '',
      technician: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '12:00',
      priority: 'High',
      description: '',
      reason: 'Breakdown',
      createTask: true
    });
    setShowAddScheduleModal(true);
  };

  const handleCloseAddSchedule = () => {
    setShowAddScheduleModal(false);
    setScheduleForm({
      title: '',
      type: 'Emergency',
      equipment: '',
      location: '',
      technician: '',
      startDate: '',
      endDate: '',
      startTime: '08:00',
      endTime: '12:00',
      priority: 'High',
      description: '',
      reason: 'Breakdown',
      createTask: true
    });
  };

  const handleScheduleFormChange = (field, value) => {
    setScheduleForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitAddSchedule = () => {
    // Simulate adding new schedule
    console.log('Adding new schedule:', scheduleForm);
    
    let message = `Schedule berhasil ditambahkan!\n\nTitle: ${scheduleForm.title}\nEquipment: ${scheduleForm.equipment}\nType: ${scheduleForm.type}\nPriority: ${scheduleForm.priority}\nDate: ${scheduleForm.startDate}`;
    
    if (scheduleForm.createTask) {
      message += `\n\nTask juga berhasil dibuat untuk schedule ini!`;
    }
    
    alert(message);
    handleCloseAddSchedule();
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Schedule Management</h1>
            <p className="text-gray-600">Kelola jadwal preventive maintenance dan inspeksi</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'month' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'week' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setViewMode('day')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'day' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Day
                  </button>
                </div>

                {/* List View Toggle */}
                <button
                  onClick={() => setListView(!listView)}
                  className={`p-2 rounded-lg ${
                    listView ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {listView ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Add Schedule Button */}
                <button 
                  onClick={handleAddSchedule}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Emergency Schedule
                </button>
                
                {/* Export Button */}
                <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {listView ? (
            /* List View */
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Schedule List</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {scheduleData.map((schedule) => (
                  <div key={schedule.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{schedule.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(schedule.type)}`}>
                            {schedule.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(schedule.priority)}`}>
                            {schedule.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                            {schedule.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(schedule.startDate)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {schedule.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Last Maintenance By: {schedule.technician}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-2">{schedule.description}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedSchedule(schedule)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCreateTask(schedule)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Wrench className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Calendar View */
            <div className="bg-white rounded-lg shadow-sm">
              {/* Calendar Header */}
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const schedules = getSchedulesForDate(day);
                    const isToday = day && day.toDateString() === new Date().toDateString();
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border border-gray-200 ${
                          day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                        } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                      >
                        {day && (
                          <>
                            <div className={`text-sm font-medium mb-2 ${
                              isToday ? 'text-blue-600' : 'text-gray-800'
                            }`}>
                              {day.getDate()}
                            </div>
                            
                            <div className="space-y-1">
                              {schedules.slice(0, 3).map((schedule) => (
                                <div
                                  key={schedule.id}
                                  onClick={() => setSelectedSchedule(schedule)}
                                  className={`p-1 text-xs rounded cursor-pointer hover:opacity-80 transition-opacity ${
                                    schedule.priority === 'High' ? 'bg-red-100 text-red-800' :
                                    schedule.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }`}
                                >
                                  <div className="truncate">{schedule.title}</div>
                                </div>
                              ))}
                              {schedules.length > 3 && (
                                <div className="text-xs text-gray-500 text-center">
                                  +{schedules.length - 3} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Schedule Detail Modal */}
          {selectedSchedule && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Schedule Detail</h2>
                    <button
                      onClick={() => setSelectedSchedule(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Title</label>
                          <p className="text-gray-800">{selectedSchedule.title}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Type</label>
                          <p className="text-gray-800">{selectedSchedule.type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Equipment</label>
                          <p className="text-gray-800">{selectedSchedule.equipment}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Location</label>
                          <p className="text-gray-800">{selectedSchedule.location}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Last Maintenance By</label>
                          <p className="text-gray-800">{selectedSchedule.technician}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Priority</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedSchedule.priority)}`}>
                            {selectedSchedule.priority}
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Health Score</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedSchedule.health >= 90 ? 'text-green-600 bg-green-100' :
                            selectedSchedule.health >= 70 ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100'
                          }`}>
                            {selectedSchedule.health}%
                          </span>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Category</label>
                          <p className="text-gray-800">{selectedSchedule.category}</p>
                        </div>
                      </div>
                    </div>

                    {/* Next Maintenance Schedule */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Maintenance Schedule</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Scheduled Date</label>
                          <p className="text-gray-800">{formatDate(selectedSchedule.startDate)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Status</label>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSchedule.status)}`}>
                            {selectedSchedule.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Equipment Specifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Equipment Specifications</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedSchedule.specifications).map(([key, value]) => (
                          <div key={key}>
                            <label className="text-sm font-medium text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </label>
                            <p className="text-gray-800">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setSelectedSchedule(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleCreateTask(selectedSchedule)}
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

          {/* Create Task Modal */}
          {showCreateTaskModal && selectedSchedule && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Create Task</h2>
                    <button
                      onClick={handleCloseCreateTask}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Task Form */}
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={taskForm.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          placeholder="Enter task title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={taskForm.type}
                          onChange={(e) => handleFormChange('type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Preventive">Preventive</option>
                          <option value="Inspection">Inspection</option>
                          <option value="Calibration">Calibration</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </div>

                      {/* Equipment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                        <input
                          type="text"
                          value={taskForm.equipment}
                          onChange={(e) => handleFormChange('equipment', e.target.value)}
                          placeholder="Enter equipment name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Estimated Hours */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                        <input
                          type="number"
                          min="1"
                          max="24"
                          value={taskForm.estimatedHours}
                          onChange={(e) => handleFormChange('estimatedHours', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select
                          value={taskForm.priority}
                          onChange={(e) => handleFormChange('priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <select
                          value={taskForm.location}
                          onChange={(e) => handleFormChange('location', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Lokasi</option>
                          {locations.map((location) => (
                            <option key={location} value={location}>{location}</option>
                          ))}
                        </select>
                      </div>

                      {/* Technician Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Tipe Teknisi</label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="technicianType"
                              value="Teknisi Internal"
                              checked={taskForm.technicianType === 'Teknisi Internal'}
                              onChange={(e) => handleFormChange('technicianType', e.target.value)}
                              className="mr-2"
                            />
                            <span className="text-sm">Teknisi Internal</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="technicianType"
                              value="Vendor"
                              checked={taskForm.technicianType === 'Vendor'}
                              onChange={(e) => handleFormChange('technicianType', e.target.value)}
                              className="mr-2"
                              disabled
                            />
                            <span className="text-sm text-gray-400">Vendor <span className="text-xs">Coming Soon</span></span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="technicianType"
                              value="Vendor + Teknisi Pendamping"
                              checked={taskForm.technicianType === 'Vendor + Teknisi Pendamping'}
                              onChange={(e) => handleFormChange('technicianType', e.target.value)}
                              className="mr-2"
                              disabled
                            />
                            <span className="text-sm text-gray-400">Vendor + Teknisi Pendamping <span className="text-xs">Coming Soon</span></span>
                          </label>
                        </div>
                      </div>

                      {/* Technician Selection */}
                      {taskForm.technicianType === 'Teknisi Internal' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Teknisi Internal</label>
                          <select
                            value={taskForm.technician}
                            onChange={(e) => handleFormChange('technician', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Pilih Teknisi Internal</option>
                            {technicians.map((technician) => (
                              <option key={technician} value={technician}>{technician}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Due Date and Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                          <input
                            type="date"
                            value={taskForm.dueDate}
                            onChange={(e) => handleFormChange('dueDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Due Time</label>
                          <input
                            type="time"
                            value={taskForm.dueTime}
                            onChange={(e) => handleFormChange('dueTime', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={taskForm.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          rows={4}
                          placeholder="Enter task description..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCloseCreateTask}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitCreateTask}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Create Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Emergency Schedule Modal */}
          {showAddScheduleModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Add Emergency Schedule</h2>
                    <button
                      onClick={handleCloseAddSchedule}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">Tambahkan schedule emergency untuk equipment yang rusak</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={scheduleForm.title}
                        onChange={(e) => handleScheduleFormChange('title', e.target.value)}
                        placeholder="Enter emergency schedule title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={scheduleForm.type}
                        onChange={(e) => handleScheduleFormChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="Emergency">Emergency</option>
                        <option value="Breakdown">Breakdown</option>
                        <option value="Repair">Repair</option>
                        <option value="Corrective">Corrective</option>
                      </select>
                    </div>

                    {/* Equipment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                      <select
                        value={scheduleForm.equipment}
                        onChange={(e) => handleScheduleFormChange('equipment', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Pilih Equipment</option>
                        {equipmentData.map((equipment) => (
                          <option key={equipment.id} value={equipment.name}>{equipment.name} - {equipment.location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <select
                        value={scheduleForm.location}
                        onChange={(e) => handleScheduleFormChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Pilih Lokasi</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    {/* Technician */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Technician</label>
                      <select
                        value={scheduleForm.technician}
                        onChange={(e) => handleScheduleFormChange('technician', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Pilih Teknisi</option>
                        {technicians.map((technician) => (
                          <option key={technician} value={technician}>{technician}</option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                      <select
                        value={scheduleForm.priority}
                        onChange={(e) => handleScheduleFormChange('priority', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>

                    {/* Reason */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                      <select
                        value={scheduleForm.reason}
                        onChange={(e) => handleScheduleFormChange('reason', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="Breakdown">Breakdown</option>
                        <option value="Malfunction">Malfunction</option>
                        <option value="Safety Issue">Safety Issue</option>
                        <option value="Performance Issue">Performance Issue</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={scheduleForm.startDate}
                          onChange={(e) => handleScheduleFormChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          type="date"
                          value={scheduleForm.endDate}
                          onChange={(e) => handleScheduleFormChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <input
                          type="time"
                          value={scheduleForm.startTime}
                          onChange={(e) => handleScheduleFormChange('startTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <input
                          type="time"
                          value={scheduleForm.endTime}
                          onChange={(e) => handleScheduleFormChange('endTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={scheduleForm.description}
                        onChange={(e) => handleScheduleFormChange('description', e.target.value)}
                        rows={3}
                        placeholder="Describe the emergency situation and required actions..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Create Task Option */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="createTask"
                          checked={scheduleForm.createTask}
                          onChange={(e) => handleScheduleFormChange('createTask', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="createTask" className="ml-2 text-sm text-blue-800">
                          Langsung buat task untuk schedule ini
                        </label>
                      </div>
                      <p className="text-xs text-blue-600 mt-1">
                        Jika dicentang, task akan otomatis dibuat setelah schedule disimpan
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCloseAddSchedule}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitAddSchedule}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2 inline" />
                      Add Emergency Schedule
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

export default PageSchedule;
