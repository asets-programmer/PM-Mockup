import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Play, 
  Eye, 
  Edit, 
  Calendar, 
  MapPin, 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Upload,
  Plus,
  X,
  Save,
  Camera,
  FileText,
  CheckSquare,
  User,
  Settings,
  Grid3X3,
  List
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';
import { useAuth } from '../auth/AuthContext';

const PageTeknisi = () => {
  const { user } = useAuth();
  
  // Task List States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Task Detail States
  const [taskProgress, setTaskProgress] = useState({});
  const [taskNotes, setTaskNotes] = useState('');
  const [beforePhotos, setBeforePhotos] = useState([]);
  const [afterPhotos, setAfterPhotos] = useState([]);
  const [completedChecklist, setCompletedChecklist] = useState({});

  // Sample data tugas untuk teknisi
  const [tasks, setTasks] = useState([
    {
      id: 'TASK-001',
      equipmentName: 'Genset A',
      location: 'Gudang Utama',
      dueDate: '2024-12-15',
      status: 'Scheduled',
      priority: 'Medium',
      description: 'Maintenance rutin genset - cek oli, filter udara, dan test running',
      assignedTo: 'Budi Santoso',
      createdAt: '2024-12-10 08:00',
      checklist: [
        { id: 'CHK-001', item: 'Cek level oli mesin', completed: false },
        { id: 'CHK-002', item: 'Ganti filter udara', completed: false },
        { id: 'CHK-003', item: 'Test running 30 menit', completed: false },
        { id: 'CHK-004', item: 'Cek tegangan output', completed: false }
      ],
      progress: 0
    },
    {
      id: 'TASK-002',
      equipmentName: 'Dispenser A',
      location: 'Area Pump',
      dueDate: '2024-12-12',
      status: 'In Progress',
      priority: 'High',
      description: 'Perbaikan dispenser yang tidak mengalir dengan lancar',
      assignedTo: 'Sari Wijaya',
      createdAt: '2024-12-08 14:30',
      checklist: [
        { id: 'CHK-005', item: 'Cek selang dan fitting', completed: true },
        { id: 'CHK-006', item: 'Bersihkan nozzle', completed: true },
        { id: 'CHK-007', item: 'Test flow rate', completed: false },
        { id: 'CHK-008', item: 'Kalibrasi meter', completed: false }
      ],
      progress: 50
    },
    {
      id: 'TASK-003',
      equipmentName: 'Panel Listrik',
      location: 'Ruang Server',
      dueDate: '2024-12-10',
      status: 'Overdue',
      priority: 'Critical',
      description: 'Inspeksi panel listrik - cek koneksi dan grounding',
      assignedTo: 'Andi Pratama',
      createdAt: '2024-12-05 10:15',
      checklist: [
        { id: 'CHK-009', item: 'Cek koneksi kabel', completed: false },
        { id: 'CHK-010', item: 'Test grounding', completed: false },
        { id: 'CHK-011', item: 'Cek MCB dan RCD', completed: false }
      ],
      progress: 0
    },
    {
      id: 'TASK-004',
      equipmentName: 'Tank Monitoring',
      location: 'Area Tank',
      dueDate: '2024-12-08',
      status: 'Done',
      priority: 'Low',
      description: 'Kalibrasi sensor level tank dan test alarm',
      assignedTo: 'Rudi Hermawan',
      createdAt: '2024-12-03 09:00',
      checklist: [
        { id: 'CHK-012', item: 'Kalibrasi sensor level', completed: true },
        { id: 'CHK-013', item: 'Test alarm high level', completed: true },
        { id: 'CHK-014', item: 'Test alarm low level', completed: true },
        { id: 'CHK-015', item: 'Update dokumentasi', completed: true }
      ],
      progress: 100
    },
    {
      id: 'TASK-005',
      equipmentName: 'CCTV System',
      location: 'Parking Area',
      dueDate: '2024-12-18',
      status: 'Scheduled',
      priority: 'Medium',
      description: 'Pembersihan lensa kamera dan test recording',
      assignedTo: 'Dedi Kurniawan',
      createdAt: '2024-12-12 11:20',
      checklist: [
        { id: 'CHK-016', item: 'Bersihkan lensa kamera', completed: false },
        { id: 'CHK-017', item: 'Test recording function', completed: false },
        { id: 'CHK-018', item: 'Cek storage capacity', completed: false }
      ],
      progress: 0
    },
    {
      id: 'TASK-006',
      equipmentName: 'Pompa BBM',
      location: 'Area Pump',
      dueDate: '2024-12-20',
      status: 'Scheduled',
      priority: 'High',
      description: 'Maintenance pompa BBM - cek seal, bearing, dan motor',
      assignedTo: 'Eko Susanto',
      createdAt: '2024-12-13 16:45',
      checklist: [
        { id: 'CHK-019', item: 'Cek kondisi seal pompa', completed: false },
        { id: 'CHK-020', item: 'Lubrikasi bearing', completed: false },
        { id: 'CHK-021', item: 'Test motor dan coupling', completed: false },
        { id: 'CHK-022', item: 'Cek tekanan dan flow', completed: false }
      ],
      progress: 0
    }
  ]);

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Done':
        return { emoji: '🟢', color: 'text-green-600 bg-green-100', text: 'Done' };
      case 'In Progress':
        return { emoji: '🟡', color: 'text-yellow-600 bg-yellow-100', text: 'In Progress' };
      case 'Scheduled':
        return { emoji: '🔵', color: 'text-blue-600 bg-blue-100', text: 'Scheduled' };
      case 'Overdue':
        return { emoji: '⚠️', color: 'text-white', text: 'Overdue' };
      default:
        return { emoji: '⚪', color: 'text-gray-600 bg-gray-100', text: status };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'text-white';
      case 'High':
        return 'text-orange-600 bg-orange-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Handle task actions
  const handleStartTask = (taskId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'In Progress' }
          : task
      )
    );
    alert('Task started! Status changed to In Progress.');
  };

  const handleViewDetail = (task) => {
    setSelectedTask(task);
    setTaskProgress(task.progress);
    setTaskNotes('');
    setCompletedChecklist({});
    setBeforePhotos([]);
    setAfterPhotos([]);
    setShowTaskDetail(true);
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setTaskProgress(task.progress);
    setTaskNotes('');
    setCompletedChecklist({});
    setBeforePhotos([]);
    setAfterPhotos([]);
    setShowUpdateModal(true);
  };

  const handleCloseDetail = () => {
    setShowTaskDetail(false);
    setShowUpdateModal(false);
    setSelectedTask(null);
    setTaskProgress({});
    setTaskNotes('');
    setCompletedChecklist({});
    setBeforePhotos([]);
    setAfterPhotos([]);
  };

  const handleChecklistToggle = (checklistId) => {
    setCompletedChecklist(prev => ({
      ...prev,
      [checklistId]: !prev[checklistId]
    }));
  };

  const handlePhotoUpload = (type, files) => {
    const fileList = Array.from(files);
    if (type === 'before') {
      setBeforePhotos(prev => [...prev, ...fileList]);
    } else {
      setAfterPhotos(prev => [...prev, ...fileList]);
    }
  };

  const handleRemovePhoto = (type, index) => {
    if (type === 'before') {
      setBeforePhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setAfterPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleMarkAsDone = () => {
    if (selectedTask) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === selectedTask.id 
            ? { ...task, status: 'Done', progress: 100 }
            : task
        )
      );
      alert('Task marked as done! Great work!');
      handleCloseDetail();
    }
  };

  const handleSubmitReport = () => {
    if (selectedTask) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === selectedTask.id 
            ? { ...task, status: 'Done', progress: 100 }
            : task
        )
      );
      alert('Report submitted successfully!');
      handleCloseDetail();
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
            <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {tasks.filter(t => t.status === 'Scheduled').length}
                  </div>
                  <div className="text-sm text-gray-600">Scheduled</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {tasks.filter(t => t.status === 'In Progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fd0017' }}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {tasks.filter(t => t.status === 'Overdue').length}
                  </div>
                  <div className="text-sm text-gray-600">Overdue</div>
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
                    {tasks.filter(t => t.status === 'Done').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1 h-4">
                  Pencarian Pekerjaan Teknisi
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama alat, lokasi, atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-64">
                <label className="block text-xs font-medium text-gray-600 mb-1 h-4">
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
                    <option value="Scheduled">🔵 Scheduled</option>
                    <option value="In Progress">🟡 In Progress</option>
                    <option value="Overdue">🔴 Overdue</option>
                    <option value="Done">🟢 Done</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Pekerjaan Teknisi</h2>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Total: {filteredTasks.length} tugas
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

            {/* Tasks Content */}
            <div className="p-6">
              {filteredTasks.length > 0 ? (
                <>
                  {/* Grid View */}
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredTasks.map((task) => {
                        const statusDisplay = getStatusDisplay(task.status);
                        const priorityColor = getPriorityColor(task.priority);
                        
                        return (
                          <div key={task.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200">
                            {/* Task Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.equipmentName}</h3>
                                <p className="text-sm text-gray-600">{task.id}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`} style={task.status === 'Overdue' ? { backgroundColor: '#fd0017' } : {}}>
                                  {statusDisplay.emoji} {statusDisplay.text}
                                </span>
                              </div>
                            </div>

                            {/* Task Details */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm">
                                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-700">{task.location}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-700">Due: {task.dueDate}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColor} mr-2`} style={task.priority === 'Critical' ? { backgroundColor: '#fd0017' } : {}}>
                                  {task.priority}
                                </span>
                                <span className="text-gray-700">Priority</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="text-gray-800 font-medium">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              {task.status === 'Scheduled' && (
                                <button
                                  onClick={() => handleStartTask(task.id)}
                                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex-1"
                                  title="Start Task"
                                >
                                  <Play className="w-4 h-4 mr-1" />
                                  Start
                                </button>
                              )}
                              <button
                                onClick={() => handleViewDetail(task)}
                                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex-1"
                                title="View Detail"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Detail
                              </button>
                              <button
                                onClick={() => handleUpdateTask(task)}
                                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm flex-1"
                                title="Update Task"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Update
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* List View */}
                  {viewMode === 'list' && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nama Alat
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lokasi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Due Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Progress
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredTasks.map((task) => {
                            const statusDisplay = getStatusDisplay(task.status);
                            const priorityColor = getPriorityColor(task.priority);
                            
                            return (
                              <tr key={task.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Wrench className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{task.equipmentName}</div>
                                      <div className="text-sm text-gray-500">{task.id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-900">{task.location}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-900">{task.dueDate}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`} style={task.status === 'Overdue' ? { backgroundColor: '#fd0017' } : {}}>
                                    {statusDisplay.emoji} {statusDisplay.text}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                      <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ width: `${task.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm text-gray-900">{task.progress}%</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColor}`} style={task.priority === 'Critical' ? { backgroundColor: '#fd0017' } : {}}>
                                    {task.priority}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    {task.status === 'Scheduled' && (
                                      <button
                                        onClick={() => handleStartTask(task.id)}
                                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs"
                                        title="Start Task"
                                      >
                                        <Play className="w-3 h-3 mr-1" />
                                        Start
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleViewDetail(task)}
                                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                                      title="View Detail"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      Detail
                                    </button>
                                    <button
                                      onClick={() => handleUpdateTask(task)}
                                      className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs"
                                      title="Update Progress"
                                    >
                                      <Edit className="w-3 h-3 mr-1" />
                                      Update
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>

          {/* Task Detail Modal */}
          {(showTaskDetail || showUpdateModal) && selectedTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {showUpdateModal ? 'Update Progress' : 'Task Detail'} - {selectedTask.equipmentName}
                    </h2>
                    <button
                      onClick={handleCloseDetail}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Task Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Task Information</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Equipment:</span>
                          <span className="ml-2 font-medium">{selectedTask.equipmentName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">{selectedTask.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Due Date:</span>
                          <span className="ml-2 font-medium">{selectedTask.dueDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Priority:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTask.priority)}`} style={selectedTask.priority === 'Critical' ? { backgroundColor: '#fd0017' } : {}}>
                            {selectedTask.priority}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Assigned To:</span>
                          <span className="ml-2 font-medium">{selectedTask.assignedTo}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Current Progress:</span>
                          <span className="ml-2 font-medium">{selectedTask.progress}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Task Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedTask.description}
                      </p>
                    </div>

                    {/* Checklist */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Work Checklist</h3>
                      <div className="space-y-3">
                        {selectedTask.checklist.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="checkbox"
                              checked={completedChecklist[item.id] || item.completed}
                              onChange={() => handleChecklistToggle(item.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className={`flex-1 text-sm ${(completedChecklist[item.id] || item.completed) ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                              {item.item}
                            </span>
                            {(completedChecklist[item.id] || item.completed) && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Update */}
                    {showUpdateModal && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Update Progress</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Progress Percentage
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={taskProgress}
                              onChange={(e) => setTaskProgress(e.target.value)}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-600 mt-1">
                              <span>0%</span>
                              <span className="font-medium">{taskProgress}%</span>
                              <span>100%</span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Additional Notes
                            </label>
                            <textarea
                              value={taskNotes}
                              onChange={(e) => setTaskNotes(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Add notes about the work done..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Photo Upload */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Photo Documentation</h3>
                      
                      {/* Before Photos */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Before Photos
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload('before', e.target.files)}
                            className="hidden"
                            id="before-photos"
                          />
                          <label
                            htmlFor="before-photos"
                            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Upload Before Photos
                          </label>
                        </div>
                        {beforePhotos.length > 0 && (
                          <div className="mt-2 grid grid-cols-4 gap-2">
                            {beforePhotos.map((photo, index) => (
                              <div key={index} className="relative">
                                <div className="bg-gray-100 p-2 rounded-lg text-center">
                                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-600 truncate">{photo.name}</p>
                                </div>
                                <button
                                  onClick={() => handleRemovePhoto('before', index)}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* After Photos */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          After Photos
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload('after', e.target.files)}
                            className="hidden"
                            id="after-photos"
                          />
                          <label
                            htmlFor="after-photos"
                            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Upload After Photos
                          </label>
                        </div>
                        {afterPhotos.length > 0 && (
                          <div className="mt-2 grid grid-cols-4 gap-2">
                            {afterPhotos.map((photo, index) => (
                              <div key={index} className="relative">
                                <div className="bg-gray-100 p-2 rounded-lg text-center">
                                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                  <p className="text-xs text-gray-600 truncate">{photo.name}</p>
                                </div>
                                <button
                                  onClick={() => handleRemovePhoto('after', index)}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCloseDetail}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    {showUpdateModal ? (
                      <button
                        onClick={handleSubmitReport}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Submit Report
                      </button>
                    ) : (
                      <button
                        onClick={handleMarkAsDone}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Done
                      </button>
                    )}
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

export default PageTeknisi;