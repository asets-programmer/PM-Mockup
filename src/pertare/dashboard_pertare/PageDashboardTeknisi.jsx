import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Activity,
  Bot,
  Send,
  Play,
  FileText,
  Plus,
  Calendar,
  MapPin,
  Zap
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const DashboardTeknisi = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Halo! Saya AI Assistant untuk Teknisi. Saya bisa membantu Anda dengan informasi tentang tugas maintenance, status equipment, dan panduan teknis. Apa yang ingin Anda tanyakan?',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Sample data untuk teknisi
  const allTasks = [
    {
      id: 'TASK-001',
      title: 'Maintenance Genset A',
      equipment: 'Genset A',
      location: 'Gudang Utama',
      due: '2024-01-15 16:00',
      dueDate: 'Hari ini 16:00',
      priority: 'HIGH',
      status: 'in_progress',
      progress: 60,
      estimatedTime: '2 jam'
    },
    {
      id: 'TASK-002',
      title: 'Check Panel Listrik',
      equipment: 'Panel Listrik',
      location: 'Ruang Server',
      due: '2024-01-16 09:00',
      dueDate: 'Besok 09:00',
      priority: 'MEDIUM',
      status: 'pending',
      progress: 0,
      estimatedTime: '1 jam'
    },
    {
      id: 'TASK-003',
      title: 'CCTV Maintenance',
      equipment: 'CCTV System',
      location: 'Lantai 1-3',
      due: '2024-01-17 14:00',
      dueDate: 'Lusa 14:00',
      priority: 'LOW',
      status: 'pending',
      progress: 0,
      estimatedTime: '3 jam'
    },
    {
      id: 'TASK-004',
      title: 'Maintenance Dispenser',
      equipment: 'Dispenser A',
      location: 'Area Kantin',
      due: '2024-01-14 10:00',
      dueDate: 'Kemarin 10:00',
      priority: 'HIGH',
      status: 'overdue',
      progress: 0,
      estimatedTime: '1.5 jam'
    },
    {
      id: 'TASK-005',
      title: 'Check ATG System',
      equipment: 'ATG System',
      location: 'Tangki BBM',
      due: '2024-01-18 08:00',
      dueDate: '3 hari lagi 08:00',
      priority: 'MEDIUM',
      status: 'pending',
      progress: 0,
      estimatedTime: '2 jam'
    }
  ];

  // Filter tasks berdasarkan status
  const todayTasks = allTasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    return task.due.startsWith(today);
  });

  const overdueTasks = allTasks.filter(task => {
    const today = new Date();
    const dueDate = new Date(task.due);
    return dueDate < today && task.status !== 'completed';
  });

  const upcomingTasks = allTasks.filter(task => {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);
    const dueDate = new Date(task.due);
    return dueDate >= today && dueDate <= threeDaysFromNow && task.status === 'pending';
  });

  const equipmentAssigned = [
    { name: 'Genset A', status: 'Warning', health: 78, lastCheck: '2 jam lalu', nextMaintenance: 'Hari ini 16:00' },
    { name: 'Dispenser A', status: 'Good', health: 95, lastCheck: '1 jam lalu', nextMaintenance: 'Minggu depan' },
    { name: 'Panel Listrik', status: 'Critical', health: 65, lastCheck: '3 jam lalu', nextMaintenance: 'Besok 09:00' },
    { name: 'CCTV System', status: 'Good', health: 98, lastCheck: '30 menit lalu', nextMaintenance: 'Lusa 14:00' }
  ];

  const recentActivities = [
    {
      type: 'completed',
      title: 'Maintenance Dispenser B selesai',
      time: '2 jam lalu',
      description: 'Penggantian filter dan cleaning sistem'
    },
    {
      type: 'started',
      title: 'Memulai maintenance Genset A',
      time: '3 jam lalu',
      description: 'Pemeriksaan awal dan persiapan alat'
    },
    {
      type: 'alert',
      title: 'Alert: Panel Listrik temperature tinggi',
      time: '4 jam lalu',
      description: 'Perlu pengecekan segera'
    },
    {
      type: 'assigned',
      title: 'Tugas baru: CCTV Maintenance',
      time: '1 hari lalu',
      description: 'Dijadwalkan untuk lusa'
    }
  ];


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
    
    if (lowerMessage.includes('tugas') || lowerMessage.includes('task')) {
      return `Ringkasan Tugas Anda:\n• Total Task: ${allTasks.length}\n• Task Hari Ini: ${todayTasks.length}\n• Overdue Task: ${overdueTasks.length}\n• Pekerjaan Aktif: ${allTasks.filter(task => task.status === 'in_progress').length}\n\nTugas Hari Ini:\n${todayTasks.map(task => `• ${task.title} (${task.priority}) - ${task.dueDate}`).join('\n')}`;
    }
    
    if (lowerMessage.includes('equipment') || lowerMessage.includes('alat')) {
      return `Equipment yang Anda tangani:\n• Genset A: Warning (78%) - Perlu perhatian\n• Dispenser A: Good (95%) - Kondisi baik\n• Panel Listrik: Critical (65%) - Segera diperbaiki\n• CCTV System: Good (98%) - Kondisi baik\n\nAda 1 equipment yang perlu perhatian segera`;
    }
    
    if (lowerMessage.includes('panduan') || lowerMessage.includes('cara')) {
      return `Panduan Maintenance:\n• Genset A: Cek oli, filter, dan temperature\n• Panel Listrik: Periksa koneksi dan grounding\n• CCTV: Bersihkan lensa dan cek kabel\n• Dispenser: Ganti filter dan cek pressure\n\nButuh panduan detail untuk equipment tertentu?`;
    }
    
    if (lowerMessage.includes('laporan') || lowerMessage.includes('report')) {
      return `Format Laporan Harian:\n• Nama Equipment\n• Jenis Maintenance\n• Waktu Mulai & Selesai\n• Spare Part yang Digunakan\n• Kondisi Sebelum & Sesudah\n• Foto Sebelum & Sesudah\n• Catatan Khusus\n\nGunakan form laporan di menu Task untuk input detail`;
    }
    
    if (lowerMessage.includes('reminder') || lowerMessage.includes('jadwal mendekat')) {
      return `Reminder Jadwal Mendekat (3 hari):\n${upcomingTasks.length > 0 ? upcomingTasks.map(task => `• ${task.title} - ${task.dueDate} (${task.priority})`).join('\n') : 'Tidak ada jadwal mendekat dalam 3 hari ke depan'}\n\nSemua jadwal masih aman dan terkelola dengan baik.`;
    }
    
    return `Saya bisa membantu dengan:\n• Informasi tugas dan jadwal\n• Status equipment yang Anda tangani\n• Panduan teknis maintenance\n• Format laporan harian\n• Troubleshooting masalah\n• Reminder jadwal mendekat\n\nCoba tanyakan "tugas hari ini", "status equipment", atau "reminder jadwal"`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <Navbar />

        {/* Preventive Maintenance Dashboard Title */}
        <div className="px-6 pt-6 pb-0">
          <h1 className="text-2xl font-bold" style={{ color: '#000' }}>Preventive Maintenance Dashboard</h1>
        </div>

        {/* Welcome Section */}
        <div className="px-6 pt-0 mt-4 mb-4">
          <div className="rounded-lg px-4 py-3" style={{ backgroundColor: 'rgb(0, 108, 184)' }}>
            <h1 className="text-xl font-semibold" style={{ color: '#fff' }}>Selamat datang, Teknisi!</h1>
            <p className="text-sm mt-1" style={{ color: '#f0f8ff' }}>Dashboard khusus untuk monitoring tugas dan equipment Anda</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-6 pt-4 pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            {/* Total Task Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800">{allTasks.length}</div>
                  <div className="text-sm text-gray-600">Total Task</div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-blue-600 font-medium">
                  {allTasks.filter(task => task.status === 'in_progress').length} Aktif
                </span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-500">
                  {allTasks.filter(task => task.status === 'pending').length} Pending
                </span>
              </div>
            </div>

            {/* Task Today Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-800">{todayTasks.length}</div>
                  <div className="text-sm text-gray-600">Task Today</div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-green-600 font-medium">
                  {todayTasks.filter(task => task.status === 'in_progress').length} Berjalan
                </span>
                <span className="text-gray-400 mx-2">•</span>
                <span className="text-gray-500">
                  {todayTasks.filter(task => task.status === 'pending').length} Menunggu
                </span>
              </div>
            </div>

            {/* Overdue Task Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-red-600">{overdueTasks.length}</div>
                  <div className="text-sm text-gray-600">Overdue Task</div>
                </div>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fd0017' }}>
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <span className="text-red-600 font-medium">
                  Perhatian: {overdueTasks.length} tugas terlambat
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Form */}
        <div className="px-6 pt-2 pb-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">AI Assistant untuk Teknisi</h3>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tanyakan tentang tugas, equipment, atau panduan teknis..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Response Buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setChatMessage('Tugas hari ini apa saja?')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Tugas Hari Ini
              </button>
              <button
                onClick={() => setChatMessage('Status equipment saya')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Status Equipment
              </button>
              <button
                onClick={() => setChatMessage('Panduan maintenance genset')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Panduan Teknis
              </button>
              <button
                onClick={() => setChatMessage('Format laporan harian')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Format Laporan
              </button>
              <button
                onClick={() => setChatMessage('Reminder jadwal mendekat')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Reminder Jadwal
              </button>
            </div>
          </div>
        </div>

        {/* AI Response Display */}
        {chatHistory.length > 1 && (
          <div className="px-6 pb-4">
            <div className="rounded-lg p-4 border" style={{ backgroundColor: '#f8f9fa', borderColor: '#006cb8' }}>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#006cb8' }}>
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm whitespace-pre-line" style={{ color: '#000' }}>
                    {chatHistory[chatHistory.length - 1].message}
                  </div>
                  <div className="text-xs mt-2" style={{ color: '#666' }}>
                    {chatHistory[chatHistory.length - 1].time}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar Pekerjaan Aktif */}
        <div className="px-6 pt-4 pb-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Progress Pekerjaan Aktif</h3>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  {allTasks.filter(task => task.status === 'in_progress').length} pekerjaan berjalan
                </span>
              </div>
            </div>
            
            {allTasks.filter(task => task.status === 'in_progress').length > 0 ? (
              <div className="space-y-4">
                {allTasks.filter(task => task.status === 'in_progress').map((task) => (
                  <div key={task.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="font-medium text-gray-800">{task.title}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          task.priority === 'HIGH' ? 'text-white' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`} style={task.priority === 'HIGH' ? { backgroundColor: '#fd0017' } : {}}>
                          {task.priority}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">Est: {task.estimatedTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>{task.equipment} • {task.location}</span>
                      <span>{task.progress}% selesai</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${task.progress}%`, backgroundColor: '#006cb8' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Tidak ada pekerjaan aktif saat ini</p>
                <p className="text-sm text-gray-400 mt-1">Mulai pekerjaan baru untuk melihat progress</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List Task Hari Ini */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">List Task Hari Ini</h2>
                  <Link to="/task" className="text-blue-600 text-sm hover:underline font-medium">Lihat Semua</Link>
                </div>
              </div>
              
              <div className="p-6">
                {todayTasks.length > 0 ? (
                  <div className="space-y-4">
                    {todayTasks.map((task) => (
                      <div key={task.id} className={`p-4 rounded-lg border-l-4 ${
                        task.priority === 'HIGH' ? 'border-l-red-500 bg-red-50' :
                        task.priority === 'MEDIUM' ? 'border-l-yellow-500 bg-yellow-50' :
                        'border-l-green-500 bg-green-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-2 h-2 rounded-full ${
                                task.status === 'in_progress' ? 'bg-green-500' :
                                task.status === 'overdue' ? 'bg-red-500' :
                                'bg-yellow-500'
                              }`}></div>
                              <span className="font-medium text-gray-800">{task.id}</span>
                              <span className="text-sm text-gray-600">-</span>
                              <span className="font-medium text-gray-800">{task.title}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Wrench className="w-4 h-4" />
                                <span>{task.equipment}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{task.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Due: {task.dueDate}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Activity className="w-4 h-4" />
                                <span className={`font-medium ${
                                  task.status === 'in_progress' ? 'text-green-600' :
                                  task.status === 'overdue' ? 'text-red-600' :
                                  'text-yellow-600'
                                }`}>
                                  {task.status === 'in_progress' ? 'Berjalan' :
                                   task.status === 'overdue' ? 'Terlambat' :
                                   'Menunggu'}
                                </span>
                              </div>
                            </div>
                            
                            {task.status === 'in_progress' && (
                              <div className="mt-3">
                                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                  <span>Progress</span>
                                  <span>{task.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${task.progress}%`, backgroundColor: '#006cb8' }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              task.priority === 'HIGH' ? 'text-white' :
                              task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`} style={task.priority === 'HIGH' ? { backgroundColor: '#fd0017' } : {}}>
                              {task.priority}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600 text-sm">
                              →
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Tidak ada tugas hari ini</p>
                    <p className="text-sm text-gray-400 mt-1">Semua tugas telah selesai atau belum dijadwalkan</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Kanan */}
            <div className="space-y-6">
              {/* Reminder Box */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">Reminder</h3>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Jadwal mendekat 3 hari</p>
                </div>
                
                <div className="p-6">
                  {upcomingTasks.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingTasks.map((task) => (
                        <div key={task.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-gray-800 text-sm mb-1">{task.title}</div>
                              <div className="text-xs text-gray-600 mb-2">
                                {task.equipment} • {task.location}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-3 h-3 text-orange-600" />
                                <span className="text-xs text-orange-600 font-medium">{task.dueDate}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              task.priority === 'HIGH' ? 'text-white' :
                              task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`} style={task.priority === 'HIGH' ? { backgroundColor: '#fd0017' } : {}}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Tidak ada jadwal mendekat</p>
                      <p className="text-xs text-gray-400 mt-1">Semua jadwal masih aman</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shortcut Buttons */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">Shortcut</h3>
                  <p className="text-sm text-gray-600 mt-1">Aksi cepat untuk produktivitas</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3">
                    {/* Mulai Pekerjaan */}
                    <Link 
                      to="/task" 
                      className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Mulai Pekerjaan</div>
                        <div className="text-xs text-gray-600">Mulai tugas maintenance baru</div>
                      </div>
                    </Link>

                    {/* Lihat Laporan */}
                    <Link 
                      to="/reports" 
                      className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Lihat Laporan</div>
                        <div className="text-xs text-gray-600">Akses laporan dan statistik</div>
                      </div>
                    </Link>

                    {/* Input Equipment */}
                    <Link 
                      to="/equipment" 
                      className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">Input Equipment</div>
                        <div className="text-xs text-gray-600">Tambah atau update equipment</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="mt-6 bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'completed' ? 'bg-green-100' :
                      activity.type === 'started' ? 'bg-blue-100' :
                      activity.type === 'alert' ? 'bg-orange-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.type === 'started' && <Clock className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                      {activity.type === 'assigned' && <User className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTeknisi;
