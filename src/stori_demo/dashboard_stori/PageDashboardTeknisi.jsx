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
  Send
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
  const myTasks = [
    {
      id: 'TASK-001',
      title: 'Maintenance Genset A',
      equipment: 'Genset A',
      due: 'Hari ini 16:00',
      priority: 'HIGH',
      status: 'in_progress',
      progress: 60,
      estimatedTime: '2 jam'
    },
    {
      id: 'TASK-002',
      title: 'Check Panel Listrik',
      equipment: 'Panel Listrik',
      due: 'Besok 09:00',
      priority: 'MEDIUM',
      status: 'pending',
      progress: 0,
      estimatedTime: '1 jam'
    },
    {
      id: 'TASK-003',
      title: 'CCTV Maintenance',
      equipment: 'CCTV System',
      due: 'Lusa 14:00',
      priority: 'LOW',
      status: 'pending',
      progress: 0,
      estimatedTime: '3 jam'
    }
  ];

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
      return `Tugas Anda hari ini:\n• Genset A Maintenance (HIGH) - Due 16:00 (60% selesai)\n• Panel Listrik Check (MEDIUM) - Due besok 09:00\n• CCTV Maintenance (LOW) - Due lusa 14:00\n\nTotal: 3 tugas, 1 sedang berjalan`;
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
    
    return `Saya bisa membantu dengan:\n• Informasi tugas dan jadwal\n• Status equipment yang Anda tangani\n• Panduan teknis maintenance\n• Format laporan harian\n• Troubleshooting masalah\n\nCoba tanyakan "tugas hari ini" atau "status equipment"`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <Navbar />

        {/* Welcome Section */}
        <div className="p-6 pb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Selamat datang, Teknisi!</h1>
                <p className="text-blue-100">Dashboard khusus untuk monitoring tugas dan equipment Anda</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{myTasks.length}</div>
                <div className="text-blue-100">Total Tugas</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat Form */}
        <div className="p-6 pb-4">
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
            </div>
          </div>
        </div>

        {/* AI Response Display */}
        {chatHistory.length > 1 && (
          <div className="px-6 pb-4">
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 border">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-800 whitespace-pre-line">
                    {chatHistory[chatHistory.length - 1].message}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {chatHistory[chatHistory.length - 1].time}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* My Tasks */}
            <Link to="/task" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-blue-600 font-medium">
                  {myTasks.filter(task => task.status === 'in_progress').length} Aktif
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">{myTasks.length}</div>
              <div className="text-sm text-gray-600">Tugas Saya</div>
              <div className="text-xs text-blue-600 mt-1">
                {myTasks.filter(task => task.status === 'pending').length} Pending
              </div>
            </Link>

            {/* Equipment Health */}
            <Link to="/equipment" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">
                  {equipmentAssigned.filter(eq => eq.status === 'Good').length} Good
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">{equipmentAssigned.length}</div>
              <div className="text-sm text-gray-600">Equipment</div>
              <div className="text-xs text-red-600 mt-1">
                {equipmentAssigned.filter(eq => eq.status === 'Critical').length} Critical
              </div>
            </Link>

            {/* Completed Today */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">
                  ↗ 25%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">3</div>
              <div className="text-sm text-gray-600">Selesai Hari Ini</div>
              <div className="text-xs text-gray-500 mt-1">Target: 5 tugas</div>
            </div>

            {/* Response Time */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm text-green-600 font-medium">
                  ↗ 15%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">1.8h</div>
              <div className="text-sm text-gray-600">Avg Response</div>
              <div className="text-xs text-gray-500 mt-1">Target: 2h</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Tasks List */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Tugas Saya</h2>
                  <Link to="/task" className="text-blue-600 text-sm hover:underline font-medium">Lihat Semua</Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {myTasks.map((task) => (
                    <div key={task.id} className={`p-4 rounded-lg border-l-4 ${
                      task.priority === 'HIGH' ? 'border-l-red-500 bg-red-50' :
                      task.priority === 'MEDIUM' ? 'border-l-yellow-500 bg-yellow-50' :
                      'border-l-green-500 bg-green-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              task.status === 'in_progress' ? 'bg-green-500' :
                              task.status === 'pending' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span className="font-medium text-gray-800">{task.title}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            {task.equipment} • Due: {task.due} • Est: {task.estimatedTime}
                          </div>
                          {task.status === 'in_progress' && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{task.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment Status & Quick Actions */}
            <div className="space-y-6">
              {/* Equipment Status */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Equipment Saya</h2>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto">
                  <div className="space-y-3">
                    {equipmentAssigned.map((equipment, index) => (
                      <Link key={index} to="/equipment" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className={`w-3 h-3 rounded-full ${
                          equipment.status === 'Good' ? 'bg-green-500' :
                          equipment.status === 'Warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800 text-sm">{equipment.name}</span>
                            <span className="text-sm font-semibold">{equipment.health}%</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Next: {equipment.nextMaintenance}
                          </div>
                        </div>
                      </Link>
                    ))}
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
                      activity.type === 'alert' ? 'bg-red-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
                      {activity.type === 'started' && <Clock className="w-4 h-4 text-blue-600" />}
                      {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-red-600" />}
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
