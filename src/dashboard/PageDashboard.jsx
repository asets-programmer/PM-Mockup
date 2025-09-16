import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  MessageCircle,
  Send,
  Bot,
  User
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PreventiveMaintenanceDashboard = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: 'Halo! Saya AI Assistant untuk Preventive Maintenance. Saya bisa membantu Anda dengan informasi tentang status equipment, jadwal maintenance, work orders, dan lainnya. Apa yang ingin Anda tanyakan?',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Sample data
  const workOrders = [
    {
      id: 'WO-2025-001',
      title: 'Genset A Maintenance',
      due: 'Today 16:00',
      technician: 'Budi',
      priority: 'HIGH',
      status: 'open'
    },
    {
      id: 'WO-2025-002',
      title: 'Panel Listrik Check',
      due: 'Tomorrow',
      technician: 'Sari',
      priority: 'MEDIUM',
      status: 'pending'
    },
    {
      id: 'WO-2025-003',
      title: 'CCTV Maintenance',
      technician: 'Andi',
      priority: 'LOW',
      status: 'progress'
    }
  ];

  const equipmentHealth = [
    { name: 'Dispenser A', lastCheck: '2h ago', health: 95, color: 'bg-green-500', status: 'Good' },
    { name: 'Dispenser B', lastCheck: '1h ago', health: 88, color: 'bg-green-500', status: 'Good' },
    { name: 'Dispenser C', lastCheck: '3h ago', health: 92, color: 'bg-green-500', status: 'Good' },
    { name: 'Genset A', lastCheck: '1d ago', health: 78, color: 'bg-yellow-500', status: 'Warning' },
    { name: 'Genset B', lastCheck: '2d ago', health: 85, color: 'bg-green-500', status: 'Good' },
    { name: 'CCTV System', lastCheck: '30m ago', health: 98, color: 'bg-green-500', status: 'Good' },
    { name: 'ATG System', lastCheck: '4h ago', health: 90, color: 'bg-green-500', status: 'Good' },
    { name: 'Panel Listrik', lastCheck: '3h ago', health: 65, color: 'bg-red-500', status: 'Critical' },
    { name: 'Computer System', lastCheck: '1h ago', health: 82, color: 'bg-green-500', status: 'Good' },
    { name: 'Backup System', lastCheck: '6h ago', health: 75, color: 'bg-yellow-500', status: 'Warning' }
  ];

  const notifications = [
    {
      type: 'alert',
      title: 'High Priority Alert',
      message: 'Genset A temperature exceeded threshold',
      time: '2 minutes ago',
      color: 'border-l-red-500 bg-red-50'
    },
    {
      type: 'warning',
      title: 'Maintenance Due',
      message: 'Panel Listrik scheduled maintenance today',
      time: '1 hour ago',
      color: 'border-l-yellow-500 bg-yellow-50'
    },
    {
      type: 'success',
      title: 'Task Completed',
      message: 'CCTV maintenance completed by Andi',
      time: '3 hours ago',
      color: 'border-l-green-500 bg-green-50'
    },
  ];

  const processSteps = [
    { step: 1, title: 'Maintenance Schedule', description: 'Jadwal PM berdasarkan running hours', active: true },
    { step: 2, title: 'Work Order Creation', description: 'Admin membuat work order', active: false },
    { step: 3, title: 'Preparation & Planning', description: 'Persiapan spare part dan teknisi', active: false },
    { step: 4, title: 'Execution', description: 'Teknisi melaksanakan maintenance', active: false },
    { step: 5, title: 'Verification & Close', description: 'Supervisor verifikasi dan tutup WO', active: false }
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
    
    if (lowerMessage.includes('status') || lowerMessage.includes('kondisi')) {
      return `Status Equipment saat ini:\n• Dispenser A: Good (95%)\n• Genset A: Warning (78%) - Perlu perhatian\n• Panel Listrik: Critical (65%) - Segera diperbaiki\n• CCTV System: Good (98%)\n• ATG System: Good (90%)\n\nOverall Health Score: 87%`;
    }
    
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('jadwal')) {
      return `Jadwal Maintenance:\n• Genset A: Due today 16:00 (HIGH priority)\n• Panel Listrik: Due today (MEDIUM priority)\n• CCTV: Sedang dalam progress\n• 8 work orders due today\n• 12 work orders in progress`;
    }
    
    if (lowerMessage.includes('work order') || lowerMessage.includes('wo')) {
      return `Work Orders Overview:\n• Total Active: 24 work orders\n• Open: 8 work orders\n• In Progress: 12 work orders\n• Pending: 3 work orders\n• Completed: 45 work orders\n\nSLA Compliance: 94.2% (Target: 95%)`;
    }
    
    if (lowerMessage.includes('jam') || lowerMessage.includes('waktu') || lowerMessage.includes('berapa')) {
      return `Informasi Waktu:\n• Genset A maintenance: 2 jam lagi (16:00)\n• Panel Listrik: Hari ini\n• Avg Response Time: 2.4 jam\n• Last check Dispenser A: 2 jam yang lalu\n• Last check CCTV: 30 menit yang lalu`;
    }
    
    if (lowerMessage.includes('alert') || lowerMessage.includes('peringatan')) {
      return `Alert Terbaru:\n• HIGH: Genset A temperature exceeded threshold (2 menit lalu)\n• WARNING: Panel Listrik maintenance due today (1 jam lalu)\n• INFO: CCTV maintenance completed by Andi (3 jam lalu)`;
    }
    
    return `Saya bisa membantu dengan:\n• Status equipment dan health score\n• Jadwal maintenance dan work orders\n• Alert dan notifikasi terbaru\n• Informasi waktu dan response time\n• Data KPI dan performa\n\nCoba tanyakan hal spesifik seperti "status equipment" atau "jadwal maintenance hari ini"`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Navbar */}
        <Navbar />

        {/* AI Chat Form - Always Visible */}
        <div className="p-6 pb-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">AI Maintenance Assistant</h3>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tanyakan tentang status maintenance, jadwal, atau equipment..."
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
                onClick={() => setChatMessage('Status equipment saat ini')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Status Equipment
              </button>
              <button
                onClick={() => setChatMessage('Jadwal maintenance hari ini')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Jadwal Hari Ini
              </button>
              <button
                onClick={() => setChatMessage('Berapa jam lagi maintenance?')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Waktu Maintenance
              </button>
              <button
                onClick={() => setChatMessage('Work orders yang pending')}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Work Orders
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

        {/* KPI Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Active Work Orders */}
            <Link to="/work-orders" className="bg-white p-8 rounded-lg shadow-sm min-h-[140px] hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-green-600 flex items-center">
                  ↗ 12%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">24</div>
              <div className="text-sm text-gray-600">Active Work Orders</div>
              <div className="text-xs text-blue-600 mt-1">8 Due Today</div>
            </Link>

            {/* SLA Compliance */}
            <Link to="/reports" className="bg-white p-8 rounded-lg shadow-sm min-h-[140px] hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-sm text-green-600 flex items-center">
                  ↗ 12%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">94.2%</div>
              <div className="text-sm text-gray-600">SLA Compliance</div>
              <div className="text-xs text-gray-500 mt-1">Target: 95%</div>
            </Link>

            {/* Avg Response Time */}
            <Link to="/reports" className="bg-white p-8 rounded-lg shadow-sm min-h-[140px] hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-sm text-green-600 flex items-center">
                  ↗ 12%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">2.4h</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
              <div className="text-xs text-blue-600 mt-1">MTTR Trending</div>
            </Link>

            {/* Equipment Health */}
            <Link to="/equipment" className="bg-white p-8 rounded-lg shadow-sm min-h-[140px] hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="text-sm text-green-600 flex items-center">
                  ↗ 12%
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-800">87%</div>
              <div className="text-sm text-gray-600">Equipment Health</div>
              <div className="text-xs text-gray-500 mt-1">Overall Score</div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Work Orders Overview */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Work Orders Overview</h2>
                  <div className="flex space-x-2">
                    {['Today', 'Week', 'Month'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 text-sm rounded ${
                          activeTab === tab
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Status Cards */}
              <div className="p-6 pb-4">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-600">Open</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">45</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>

                {/* Work Order List */}
                <div className="space-y-3">
                  {workOrders.map((order) => (
                    <div key={order.id} className={`p-4 rounded-lg border-l-4 ${
                      order.priority === 'HIGH' ? 'border-l-red-500 bg-red-50' :
                      order.priority === 'MEDIUM' ? 'border-l-yellow-500 bg-yellow-50' :
                      'border-l-green-500 bg-green-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${
                              order.status === 'open' ? 'bg-red-500' :
                              order.status === 'progress' ? 'bg-green-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <span className="font-medium text-gray-800">{order.id} - {order.title}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            {order.due && `Due: ${order.due} • `}
                            {order.technician && `Technician: ${order.technician}`}
                            {order.status === 'progress' && !order.due && `Technician: ${order.technician}`}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            order.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            order.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.priority}
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

            {/* Equipment Health Sidebar */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Equipment Health</h2>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {equipmentHealth.map((equipment, index) => (
                    <Link key={index} to="/equipment" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className={`w-3 h-3 rounded-full ${equipment.color}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{equipment.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold">{equipment.health}%</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              equipment.status === 'Good' ? 'bg-green-100 text-green-800' :
                              equipment.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {equipment.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Last Check: {equipment.lastCheck}</div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${equipment.color}`}
                            style={{ width: `${equipment.health}%` }}
                          ></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Maintenance Process Flow - Left Column */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Maintenance Process Flow</h2>
              </div>
              <div className="p-6">
                <div className="relative">
                  {/* Vertical line connecting all steps */}
                  <div className="absolute left-4 top-8 w-0.5 h-[380px] bg-gray-300"></div>
                  
                  <div className="space-y-12">
                    {processSteps.map((step, index) => (
                      <div key={step.step} className="flex items-start space-x-4 relative">
                        {/* Numbered circle with specific colors */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                          step.step === 1 ? 'bg-blue-400' :
                          step.step === 2 ? 'bg-yellow-400' :
                          step.step === 3 ? 'bg-orange-400' :
                          step.step === 4 ? 'bg-green-400' :
                          'bg-purple-400'
                        }`}>
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-base">{step.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{step.description}</div>
                        </div>
                        {/* Colored dot indicator */}
                        <div className={`w-3 h-3 rounded-full ${
                          step.step === 1 ? 'bg-blue-500' :
                          step.step === 2 ? 'bg-yellow-500' :
                          step.step === 3 ? 'bg-orange-500' :
                          step.step === 4 ? 'bg-green-500' :
                          'bg-purple-500'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Notifications - Right Column */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Notifications</h2>
                  <Link to="/notifications" className="text-blue-600 text-sm hover:underline font-medium">View All</Link>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-16">
                  {notifications.map((notification, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${notification.color}`}>
                      <div className="flex items-start space-x-3">
                        {notification.type === 'alert' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
                        {notification.type === 'warning' && <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />}
                        {notification.type === 'info' && <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs font-bold">i</span>
                        </div>}
                        {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm mb-1">{notification.title}</div>
                          <div className="text-sm text-gray-700 mb-1">{notification.message}</div>
                          <div className="text-xs text-gray-500">{notification.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
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