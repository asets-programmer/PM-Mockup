import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  Filter,
  BarChart3,
  PieChart,
  MapPin,
  Settings,
  ChevronDown,
  Bot,
  Send
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PreventiveMaintenanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedEquipmentType, setSelectedEquipmentType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Halo! Saya AI Assistant untuk Preventive Maintenance. Saya bisa membantu Anda dengan informasi tentang status equipment, jadwal maintenance, work orders, dan lainnya. Apa yang ingin Anda tanyakan?',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Sample data for maintenance dashboard
  const maintenanceTasks = [
    {
      id: 'MT-2024-001',
      title: 'Genset A Preventive Maintenance',
      equipment: 'Genset A',
      location: 'SPBU Jakarta Pusat',
      type: 'Preventive',
      status: 'Scheduled',
      dueDate: '2024-12-19',
      technician: 'Budi Santoso',
      priority: 'HIGH'
    },
    {
      id: 'MT-2024-002',
      title: 'Dispenser B Corrective Repair',
      equipment: 'Dispenser B',
      location: 'SPBU Bandung',
      type: 'Corrective',
      status: 'In Progress',
      dueDate: '2024-12-18',
      technician: 'Sari Wijaya',
      priority: 'MEDIUM'
    },
    {
      id: 'MT-2024-003',
      title: 'Panel Listrik Inspection',
      equipment: 'Panel Listrik',
      location: 'SPBU Surabaya',
      type: 'Preventive',
      status: 'Done',
      dueDate: '2024-12-17',
      technician: 'Andi Pratama',
      priority: 'LOW'
    },
    {
      id: 'MT-2024-004',
      title: 'CCTV System Maintenance',
      equipment: 'CCTV System',
      location: 'SPBU Medan',
      type: 'Preventive',
      status: 'Scheduled',
      dueDate: '2024-12-20',
      technician: 'Rudi Hermawan',
      priority: 'MEDIUM'
    },
    {
      id: 'MT-2024-005',
      title: 'Tank Monitoring Repair',
      equipment: 'Tank Monitoring',
      location: 'SPBU Semarang',
      type: 'Corrective',
      status: 'In Progress',
      dueDate: '2024-12-18',
      technician: 'Dedi Kurniawan',
      priority: 'HIGH'
    },
    {
      id: 'MT-2024-006',
      title: 'Genset B Preventive Check',
      equipment: 'Genset B',
      location: 'SPBU Jakarta Selatan',
      type: 'Preventive',
      status: 'Scheduled',
      dueDate: '2024-12-21',
      technician: 'Budi Santoso',
      priority: 'MEDIUM'
    },
    {
      id: 'MT-2024-007',
      title: 'Dispenser C Calibration',
      equipment: 'Dispenser C',
      location: 'SPBU Bandung',
      type: 'Preventive',
      status: 'Scheduled',
      dueDate: '2024-12-22',
      technician: 'Sari Wijaya',
      priority: 'LOW'
    },
  ];

  // Upcoming maintenance (3 days ahead)
  const upcomingMaintenance = maintenanceTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    return dueDate <= threeDaysFromNow && dueDate >= today && task.status === 'Scheduled';
  });

  // Chart data
  const taskStatusData = {
    'Scheduled': maintenanceTasks.filter(t => t.status === 'Scheduled').length,
    'In Progress': maintenanceTasks.filter(t => t.status === 'In Progress').length,
    'Done': maintenanceTasks.filter(t => t.status === 'Done').length,
    'Overdue': maintenanceTasks.filter(t => {
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return dueDate < today && t.status !== 'Done';
    }).length
  };

  const maintenanceTypeData = {
    'Preventive': maintenanceTasks.filter(t => t.type === 'Preventive').length,
    'Corrective': maintenanceTasks.filter(t => t.type === 'Corrective').length
  };

  // Summary data
  const summaryData = {
    totalEquipment: 25,
    scheduled: taskStatusData.Scheduled,
    inProgress: taskStatusData['In Progress'],
    done: taskStatusData.Done
  };


  // Filter functions
  const filteredTasks = maintenanceTasks.filter(task => {
    const locationMatch = selectedLocation === 'All' || task.location.includes(selectedLocation);
    const typeMatch = selectedEquipmentType === 'All' || task.equipment.includes(selectedEquipmentType);
    const statusMatch = selectedStatus === 'All' || task.status === selectedStatus;
    return locationMatch && typeMatch && statusMatch;
  });

  // Get unique values for filters
  const locations = ['All', ...new Set(maintenanceTasks.map(task => task.location))];
  const equipmentTypes = ['All', ...new Set(maintenanceTasks.map(task => task.equipment.split(' ')[0]))];
  const statuses = ['All', ...new Set(maintenanceTasks.map(task => task.status))];

  // AI Chat functions
  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      type: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMessage]);

    // Simulate AI response
    const aiResponse = generateAIResponse(chatMessage);
    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: aiResponse,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);

    setChatMessage('');
  };

  const generateAIResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('status') || lowerMessage.includes('kondisi')) {
      return `Status Equipment saat ini:\n• Total Equipment: ${summaryData.totalEquipment}\n• Scheduled: ${summaryData.scheduled} tasks\n• In Progress: ${summaryData.inProgress} tasks\n• Done: ${summaryData.done} tasks\n\nUpcoming Maintenance: ${upcomingMaintenance.length} tasks dalam 3 hari ke depan`;
    }
    
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('jadwal')) {
      return `Jadwal Maintenance:\n• Scheduled: ${taskStatusData.Scheduled} tasks\n• In Progress: ${taskStatusData['In Progress']} tasks\n• Done: ${taskStatusData.Done} tasks\n• Overdue: ${taskStatusData.Overdue} tasks\n\nUpcoming dalam 3 hari: ${upcomingMaintenance.length} tasks`;
    }
    
    if (lowerMessage.includes('preventive') || lowerMessage.includes('corrective')) {
      return `Maintenance Type Distribution:\n• Preventive: ${maintenanceTypeData.Preventive} tasks (${Math.round((maintenanceTypeData.Preventive / (maintenanceTypeData.Preventive + maintenanceTypeData.Corrective)) * 100)}%)\n• Corrective: ${maintenanceTypeData.Corrective} tasks (${Math.round((maintenanceTypeData.Corrective / (maintenanceTypeData.Preventive + maintenanceTypeData.Corrective)) * 100)}%)\n\nTotal Tasks: ${maintenanceTypeData.Preventive + maintenanceTypeData.Corrective}`;
    }
    
    if (lowerMessage.includes('lokasi') || lowerMessage.includes('spbu')) {
      const locationCounts = maintenanceTasks.reduce((acc, task) => {
        acc[task.location] = (acc[task.location] || 0) + 1;
        return acc;
      }, {});
      
      const locationList = Object.entries(locationCounts)
        .map(([location, count]) => `• ${location}: ${count} tasks`)
        .join('\n');
      
      return `Distribusi Task per Lokasi:\n${locationList}`;
    }
    
    if (lowerMessage.includes('upcoming') || lowerMessage.includes('mendatang')) {
      if (upcomingMaintenance.length === 0) {
        return 'Tidak ada maintenance yang akan datang dalam 3 hari ke depan.';
      }
      
      const upcomingList = upcomingMaintenance
        .map(task => `• ${task.title} - ${task.location} (Due: ${task.dueDate})`)
        .join('\n');
      
      return `Upcoming Maintenance (3 hari ke depan):\n${upcomingList}`;
    }
    
    return `Saya bisa membantu dengan:\n• Status equipment dan summary data\n• Jadwal maintenance dan task distribution\n• Preventive vs Corrective analysis\n• Distribusi per lokasi SPBU\n• Upcoming maintenance alerts\n\nCoba tanyakan hal spesifik seperti "status equipment" atau "upcoming maintenance"`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <Navbar />

        {/* Summary Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Equipment */}
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow" style={{ borderColor: '#006cb8' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#006cb8' }}>
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm flex items-center" style={{ color: '#acc42a' }}>
                  ↗ 5%
                </span>
              </div>
              <div className="text-3xl font-bold" style={{ color: '#000' }}>{summaryData.totalEquipment}</div>
              <div className="text-sm" style={{ color: '#666' }}>Total Equipment</div>
              <div className="text-xs mt-1" style={{ color: '#006cb8' }}>Active Systems</div>
            </div>

            {/* Scheduled */}
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow" style={{ borderColor: '#006cb8' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#acc42a' }}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm flex items-center" style={{ color: '#006cb8' }}>
                  {summaryData.scheduled}
                </span>
              </div>
              <div className="text-3xl font-bold" style={{ color: '#000' }}>{summaryData.scheduled}</div>
              <div className="text-sm" style={{ color: '#666' }}>Scheduled</div>
              <div className="text-xs mt-1" style={{ color: '#acc42a' }}>Pending Tasks</div>
            </div>

            {/* In Progress */}
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow" style={{ borderColor: '#006cb8' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fd0017' }}>
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm flex items-center" style={{ color: '#fd0017' }}>
                  {summaryData.inProgress}
                </span>
              </div>
              <div className="text-3xl font-bold" style={{ color: '#000' }}>{summaryData.inProgress}</div>
              <div className="text-sm" style={{ color: '#666' }}>In Progress</div>
              <div className="text-xs mt-1" style={{ color: '#fd0017' }}>Active Tasks</div>
            </div>

            {/* Done */}
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow" style={{ borderColor: '#006cb8' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#acc42a' }}>
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm flex items-center" style={{ color: '#acc42a' }}>
                  {summaryData.done}
                </span>
              </div>
              <div className="text-3xl font-bold" style={{ color: '#000' }}>{summaryData.done}</div>
              <div className="text-sm" style={{ color: '#666' }}>Done</div>
              <div className="text-xs mt-1" style={{ color: '#acc42a' }}>Completed Tasks</div>
            </div>
          </div>

          {/* Dashboard Description (moved below the cards) */}
          <div className="px-0 py-4 border-t" style={{ backgroundColor: '#f8f9fa', borderColor: '#006cb8' }}>
            <div className="px-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: '#000' }}>Maintenance Dashboard</h1>
              <p style={{ color: '#006cb8' }}>Kontrol & Overview Seluruh Aktivitas Maintenance</p>
            </div>
          </div>

          {/* Upcoming Maintenance Reminder */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-800">Upcoming Maintenance (3 Hari Ke Depan)</h3>
              <span className="px-2 py-1 text-xs font-medium bg-orange-200 text-orange-800 rounded-full">
                {upcomingMaintenance.length} tasks
              </span>
                  </div>
            {upcomingMaintenance.length > 0 ? (
                <div className="space-y-3">
                {upcomingMaintenance.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 hover:shadow-sm transition-shadow">
                          <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div>
                        <p className="font-medium text-gray-800">{task.title}</p>
                        <p className="text-sm text-gray-600">{task.location} • Due: {task.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                        {task.priority}
                          </span>
                      <span className="text-sm text-gray-600">{task.technician}</span>
                    </div>
                    </div>
                  ))}
                </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <p className="text-orange-600 font-medium">Tidak ada maintenance yang akan datang dalam 3 hari ke depan</p>
                <p className="text-orange-500 text-sm mt-1">Semua maintenance terjadwal dengan baik!</p>
              </div>
            )}
            </div>

          {/* Filter Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Filter Panel</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi (SPBU)</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                          </div>

                {/* Equipment Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Equipment</label>
                  <select
                    value={selectedEquipmentType}
                    onChange={(e) => setSelectedEquipmentType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {equipmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                        </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Bar Chart - Task per Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Jumlah Task per Status</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(taskStatusData).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          status === 'Scheduled' ? 'bg-yellow-500' :
                          status === 'In Progress' ? 'bg-orange-500' :
                          status === 'Done' ? 'bg-green-500' :
                          'bg-red-500'
                        }`}></div>
                        <span className="text-sm font-medium text-gray-700">{status}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              status === 'Scheduled' ? 'bg-yellow-500' :
                              status === 'In Progress' ? 'bg-orange-500' :
                              status === 'Done' ? 'bg-green-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${(count / Math.max(...Object.values(taskStatusData))) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-800 w-8 text-right">{count}</span>
                      </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Pie Chart - Preventive vs Corrective */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Preventive vs Corrective</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    {/* Simple pie chart representation */}
                    <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                    <div 
                      className="absolute inset-0 rounded-full border-8 border-blue-500"
                      style={{ 
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * maintenanceTypeData.Preventive / (maintenanceTypeData.Preventive + maintenanceTypeData.Corrective))}% ${50 - 50 * Math.sin(2 * Math.PI * maintenanceTypeData.Preventive / (maintenanceTypeData.Preventive + maintenanceTypeData.Corrective))}%)` 
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-800">
                        {maintenanceTypeData.Preventive + maintenanceTypeData.Corrective}
                      </span>
                    </div>
                        </div>
                      </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-700">Preventive</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{maintenanceTypeData.Preventive}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span className="text-sm text-gray-700">Corrective</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800">{maintenanceTypeData.Corrective}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Tasks Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Tabel Tugas Terakhir</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.equipment}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.type === 'Preventive' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {task.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          task.status === 'In Progress' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.technician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unit Responsibility Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-800">Unit Responsibility</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">Daftar SPBU yang menjadi tanggung jawab unit Anda</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* SPBU Cards */}
                {locations.filter(loc => loc !== 'All').map((location, index) => {
                  const taskCount = maintenanceTasks.filter(t => t.location === location).length;
                  const activeTaskCount = maintenanceTasks.filter(t => t.location === location && (t.status === 'In Progress' || t.status === 'Scheduled')).length;
                  
                  return (
                    <div key={location} className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm">{location}</h4>
                            <p className="text-xs text-gray-500">Unit {String.fromCharCode(65 + index)}</p>
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${activeTaskCount > 0 ? 'bg-green-500' : 'bg-gray-300'}`} title={activeTaskCount > 0 ? 'Active' : 'Inactive'}></div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Total Tasks:</span>
                          <span className="font-medium text-gray-800">{taskCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Active:</span>
                          <span className="font-medium text-blue-600">{activeTaskCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Completed:</span>
                          <span className="font-medium text-green-600">
                            {maintenanceTasks.filter(t => t.location === location && t.status === 'Done').length}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">View Details</span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Statistics */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{locations.length - 1}</div>
                    <div className="text-sm text-gray-600">Total SPBU</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {maintenanceTasks.filter(t => t.status === 'In Progress' || t.status === 'Scheduled').length}
                    </div>
                    <div className="text-sm text-gray-600">Active Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {maintenanceTasks.filter(t => t.status === 'Done').length}
                    </div>
                    <div className="text-sm text-gray-600">Completed Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">
                      {Math.round((maintenanceTasks.filter(t => t.status === 'Done').length / maintenanceTasks.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreventiveMaintenanceDashboard;