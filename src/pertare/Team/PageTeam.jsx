import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  UserPlus,
  Star,
  TrendingUp,
  Wrench,
  FileText
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageTeam = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedMemberForTasks, setSelectedMemberForTasks] = useState(null);
  const [selectedMemberForSchedule, setSelectedMemberForSchedule] = useState(null);

  // Sample data tim
  const teamData = [
    {
      id: 'TECH-001',
      name: 'Budi Santoso',
      role: 'Senior Technician',
      department: 'Maintenance',
      email: 'budi.santoso@pertamina.com',
      phone: '+62 812-3456-7890',
      location: 'SPBU Jakarta Selatan',
      status: 'Active',
      joinDate: '2025-03-15',
      rating: 4.8,
      completedTasks: 245,
      efficiency: 96.2,
      specialties: ['Dispenser', 'Genset', 'Panel Listrik'],
      certifications: ['Certified Electrician', 'Safety Training'],
      currentWork: 'WO-2025-001 - Genset A Maintenance',
      avatar: null,
      performance: {
        thisMonth: { tasks: 18, efficiency: 97.5, rating: 4.9 },
        lastMonth: { tasks: 22, efficiency: 95.8, rating: 4.7 },
        trend: 'up'
      }
    },
    {
      id: 'TECH-002',
      name: 'Sari Wijaya',
      role: 'Technician',
      department: 'Maintenance',
      email: 'sari.wijaya@pertamina.com',
      phone: '+62 813-4567-8901',
      location: 'SPBU Jakarta Utara',
      status: 'Active',
      joinDate: '2025-07-20',
      rating: 4.6,
      completedTasks: 189,
      efficiency: 94.1,
      specialties: ['CCTV', 'Computer System', 'Network'],
      certifications: ['IT Support', 'Network Administration'],
      currentWork: 'WO-2025-002 - Panel Listrik Check',
      avatar: null,
      performance: {
        thisMonth: { tasks: 15, efficiency: 95.2, rating: 4.6 },
        lastMonth: { tasks: 17, efficiency: 93.8, rating: 4.5 },
        trend: 'up'
      }
    },
    {
      id: 'TECH-003',
      name: 'Andi Pratama',
      role: 'Technician',
      department: 'Maintenance',
      email: 'andi.pratama@pertamina.com',
      phone: '+62 814-5678-9012',
      location: 'SPBU Jakarta Barat',
      status: 'Active',
      joinDate: '2025-01-10',
      rating: 4.7,
      completedTasks: 156,
      efficiency: 95.3,
      specialties: ['CCTV', 'Security System', 'ATG'],
      certifications: ['Security Systems', 'Tank Monitoring'],
      currentWork: 'WO-2025-003 - CCTV Maintenance',
      avatar: null,
      performance: {
        thisMonth: { tasks: 12, efficiency: 96.8, rating: 4.8 },
        lastMonth: { tasks: 14, efficiency: 94.5, rating: 4.6 },
        trend: 'up'
      }
    },
    {
      id: 'TECH-004',
      name: 'Rudi Hermawan',
      role: 'Lead Technician',
      department: 'Maintenance',
      email: 'rudi.hermawan@pertamina.com',
      phone: '+62 815-6789-0123',
      location: 'SPBU Jakarta Timur',
      status: 'Active',
      joinDate: '2025-11-05',
      rating: 4.9,
      completedTasks: 312,
      efficiency: 97.8,
      specialties: ['Panel Listrik', 'Electrical', 'Safety'],
      certifications: ['Master Electrician', 'Safety Supervisor', 'Project Management'],
      currentWork: 'WO-2025-004 - Emergency Panel Repair',
      avatar: null,
      performance: {
        thisMonth: { tasks: 25, efficiency: 98.2, rating: 4.9 },
        lastMonth: { tasks: 28, efficiency: 97.5, rating: 4.8 },
        trend: 'up'
      }
    },
    {
      id: 'TECH-005',
      name: 'Dedi Kurniawan',
      role: 'Technician',
      department: 'Maintenance',
      email: 'dedi.kurniawan@pertamina.com',
      phone: '+62 816-7890-1234',
      location: 'SPBU Jakarta Selatan',
      status: 'Active',
      joinDate: '2025-09-12',
      rating: 4.4,
      completedTasks: 134,
      efficiency: 91.8,
      specialties: ['ATG', 'Tank Monitoring', 'Calibration'],
      certifications: ['Tank Monitoring', 'Calibration'],
      currentWork: 'WO-2025-005 - ATG Calibration',
      avatar: null,
      performance: {
        thisMonth: { tasks: 10, efficiency: 92.5, rating: 4.4 },
        lastMonth: { tasks: 12, efficiency: 91.2, rating: 4.3 },
        trend: 'up'
      }
    },
    {
      id: 'TECH-006',
      name: 'Eko Susanto',
      role: 'IT Technician',
      department: 'IT Support',
      email: 'eko.susanto@pertamina.com',
      phone: '+62 817-8901-2345',
      location: 'SPBU Jakarta Selatan',
      status: 'Active',
      joinDate: '2025-05-18',
      rating: 4.5,
      completedTasks: 98,
      efficiency: 93.2,
      specialties: ['Computer System', 'Software', 'Database'],
      certifications: ['IT Support', 'Database Administration'],
      currentWork: 'WO-2025-006 - Computer System Update',
      avatar: null,
      performance: {
        thisMonth: { tasks: 8, efficiency: 94.1, rating: 4.5 },
        lastMonth: { tasks: 9, efficiency: 92.8, rating: 4.4 },
        trend: 'up'
      }
    },
    {
      id: 'VENDOR-001',
      name: 'PT Teknologi Mandiri',
      role: 'Vendor',
      department: 'External',
      email: 'info@teknologimandiri.com',
      phone: '+62 21-1234-5678',
      location: 'Jakarta',
      status: 'Active',
      joinDate: '2025-01-15',
      rating: 4.3,
      completedTasks: 89,
      efficiency: 88.5,
      specialties: ['Genset', 'Heavy Equipment', 'Installation'],
      certifications: ['ISO 9001', 'Contractor License'],
      currentWork: 'WO-2025-007 - Genset Installation',
      avatar: null,
      performance: {
        thisMonth: { tasks: 5, efficiency: 89.2, rating: 4.3 },
        lastMonth: { tasks: 6, efficiency: 87.8, rating: 4.2 },
        trend: 'up'
      }
    },
    {
      id: 'TECH-007',
      name: 'Ahmad Fauzi',
      role: 'Technician',
      department: 'Maintenance',
      email: 'ahmad.fauzi@pertamina.com',
      phone: '+62 818-9012-3456',
      location: 'SPBU Jakarta Utara',
      status: 'Inactive',
      joinDate: '2025-02-28',
      rating: 4.1,
      completedTasks: 45,
      efficiency: 89.2,
      specialties: ['Dispenser', 'Pump System'],
      certifications: ['Pump Maintenance'],
      currentWork: null,
      avatar: null,
      performance: {
        thisMonth: { tasks: 0, efficiency: 0, rating: 0 },
        lastMonth: { tasks: 3, efficiency: 89.2, rating: 4.1 },
        trend: 'down'
      }
    }
  ];

  // Sample data tasks untuk setiap member
  const memberTasks = {
    'TECH-001': [
      {
        id: 'TASK-001',
        title: 'Genset A Preventive Maintenance',
        type: 'Preventive',
        priority: 'High',
        status: 'In Progress',
        dueDate: '2025-08-20',
        estimatedHours: 4,
        actualHours: 2.5,
        progress: 62,
        description: 'Rutin maintenance genset setiap 250 jam operasi'
      },
      {
        id: 'TASK-002',
        title: 'Panel Listrik Inspection',
        type: 'Inspection',
        priority: 'Medium',
        status: 'Completed',
        dueDate: '2025-08-15',
        estimatedHours: 2,
        actualHours: 1.8,
        progress: 100,
        description: 'Inspeksi rutin panel listrik bulanan'
      },
      {
        id: 'TASK-003',
        title: 'Dispenser A Calibration',
        type: 'Calibration',
        priority: 'Low',
        status: 'Scheduled',
        dueDate: '2025-08-25',
        estimatedHours: 3,
        actualHours: 0,
        progress: 0,
        description: 'Kalibrasi dispenser untuk akurasi pengukuran'
      }
    ],
    'TECH-002': [
      {
        id: 'TASK-004',
        title: 'CCTV System Maintenance',
        type: 'Preventive',
        priority: 'Medium',
        status: 'Completed',
        dueDate: '2025-08-15',
        estimatedHours: 3,
        actualHours: 2.5,
        progress: 100,
        description: 'Maintenance kamera CCTV dan DVR'
      },
      {
        id: 'TASK-005',
        title: 'Network Infrastructure Check',
        type: 'Inspection',
        priority: 'High',
        status: 'In Progress',
        dueDate: '2025-08-22',
        estimatedHours: 2,
        actualHours: 1,
        progress: 50,
        description: 'Pengecekan infrastruktur jaringan'
      }
    ],
    'TECH-003': [
      {
        id: 'TASK-006',
        title: 'ATG System Check',
        type: 'Preventive',
        priority: 'Medium',
        status: 'Scheduled',
        dueDate: '2025-08-28',
        estimatedHours: 2,
        actualHours: 0,
        progress: 0,
        description: 'Pengecekan sistem monitoring tangki'
      }
    ]
  };

  // Sample data schedule untuk setiap member
  const memberSchedule = {
    'TECH-001': [
      {
        id: 'SCH-001',
        title: 'Genset A Preventive Maintenance',
        date: '2025-08-20',
        startTime: '08:00',
        endTime: '12:00',
        type: 'Preventive',
        priority: 'High',
        status: 'Scheduled'
      },
      {
        id: 'SCH-002',
        title: 'Dispenser A Calibration',
        date: '2025-08-25',
        startTime: '07:00',
        endTime: '10:00',
        type: 'Calibration',
        priority: 'Medium',
        status: 'Scheduled'
      },
      {
        id: 'SCH-003',
        title: 'Panel Listrik Emergency Repair',
        date: '2025-08-15',
        startTime: '14:30',
        endTime: '18:30',
        type: 'Emergency',
        priority: 'Critical',
        status: 'Completed'
      }
    ],
    'TECH-002': [
      {
        id: 'SCH-004',
        title: 'CCTV System Maintenance',
        date: '2025-08-15',
        startTime: '10:00',
        endTime: '14:00',
        type: 'Preventive',
        priority: 'Medium',
        status: 'Completed'
      },
      {
        id: 'SCH-005',
        title: 'Network Infrastructure Check',
        date: '2025-08-22',
        startTime: '09:00',
        endTime: '11:00',
        type: 'Inspection',
        priority: 'High',
        status: 'In Progress'
      }
    ],
    'TECH-003': [
      {
        id: 'SCH-006',
        title: 'ATG System Check',
        date: '2025-08-28',
        startTime: '08:30',
        endTime: '11:30',
        type: 'Preventive',
        priority: 'Medium',
        status: 'Scheduled'
      }
    ]
  };

  const roles = ['All', 'Senior Technician', 'Technician', 'Lead Technician', 'IT Technician', 'Vendor'];
  const statuses = ['All', 'Active', 'Inactive'];
  const locations = ['All', 'SPBU Jakarta Selatan', 'SPBU Jakarta Utara', 'SPBU Jakarta Barat', 'SPBU Jakarta Timur'];

  const filteredTeam = teamData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'All' || member.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || member.status === selectedStatus;
    const matchesLocation = selectedLocation === 'All' || member.location === selectedLocation;
    
    return matchesSearch && matchesRole && matchesStatus && matchesLocation;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Senior Technician': return 'text-blue-600 bg-blue-100';
      case 'Lead Technician': return 'text-purple-600 bg-purple-100';
      case 'Technician': return 'text-green-600 bg-green-100';
      case 'IT Technician': return 'text-orange-600 bg-orange-100';
      case 'Vendor': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-500" /> : 
      <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // Simulate saving edited member
    console.log('Saving edited member:', editingMember);
    alert('Data tim berhasil diupdate!');
    setShowEditModal(false);
    setEditingMember(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingMember(null);
  };

  const handleViewTasks = (member) => {
    setSelectedMemberForTasks(member);
    setShowTasksModal(true);
  };

  const handleViewSchedule = (member) => {
    setSelectedMemberForSchedule(member);
    setShowScheduleModal(true);
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

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Team Management</h1>
            <p className="text-gray-600">Kelola tim teknisi dan vendor maintenance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">6</div>
                  <div className="text-sm text-gray-600">Active Technicians</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">1,267</div>
                  <div className="text-sm text-gray-600">Completed Tasks</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">4.6</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">94.2%</div>
                  <div className="text-sm text-gray-600">Efficiency</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari tim..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
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
            </div>
            
            {/* Add Member Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </button>
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeam.map((member) => (
              <div key={member.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-semibold text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditMember(member)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status & Role */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                    {member.role}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {member.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {member.phone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {member.location}
                  </div>
                </div>

                {/* Performance */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Performance</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-semibold">{member.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Tasks: {member.completedTasks}</span>
                    <span>Efficiency: {member.efficiency}%</span>
                  </div>
                </div>

                {/* Current Work */}
                {member.currentWork && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-sm text-blue-800">
                      <Wrench className="w-4 h-4 mr-2" />
                      <span className="font-medium">Current Work:</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">{member.currentWork}</p>
                  </div>
                )}

                {/* Specialties */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-600 mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1">
                    {member.specialties.slice(0, 3).map((specialty, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {specialty}
                      </span>
                    ))}
                    {member.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{member.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewTasks(member)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-4 h-4 inline mr-1" />
                    View Tasks
                  </button>
                  <button 
                    onClick={() => handleViewSchedule(member)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Member Detail Modal */}
          {selectedMember && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-semibold text-gray-600">
                          {selectedMember.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{selectedMember.name}</h2>
                        <p className="text-gray-600">{selectedMember.role} • {selectedMember.department}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMember(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-gray-800">{selectedMember.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-gray-800">{selectedMember.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-gray-800">{selectedMember.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-gray-800">Joined: {formatDate(selectedMember.joinDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Statistics</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Rating</span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-semibold">{selectedMember.rating}/5.0</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Completed Tasks</span>
                          <span className="font-semibold">{selectedMember.completedTasks}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Efficiency</span>
                          <span className="font-semibold">{selectedMember.efficiency}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">This Month</span>
                          <div className="flex items-center">
                            {getTrendIcon(selectedMember.performance.trend)}
                            <span className={`ml-1 text-sm ${getTrendColor(selectedMember.performance.trend)}`}>
                              {selectedMember.performance.thisMonth.tasks} tasks
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.specialties.map((specialty, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Certifications</h3>
                      <div className="space-y-2">
                        {selectedMember.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center">
                            <Award className="w-4 h-4 text-yellow-500 mr-2" />
                            <span className="text-gray-800">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Work */}
                  {selectedMember.currentWork && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Work</h3>
                      <p className="text-blue-800">{selectedMember.currentWork}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button 
                      onClick={() => handleEditMember(selectedMember)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2 inline" />
                      Edit Profile
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FileText className="w-4 h-4 mr-2 inline" />
                      View Tasks
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Member Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Add New Team Member</h2>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Technician</option>
                          <option>Senior Technician</option>
                          <option>Lead Technician</option>
                          <option>IT Technician</option>
                          <option>Vendor</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter location"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter specialties (comma separated)"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Add Member
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Member Modal */}
          {showEditModal && editingMember && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Team Member</h2>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editingMember.name}
                          onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select 
                          value={editingMember.role}
                          onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Technician">Technician</option>
                          <option value="Senior Technician">Senior Technician</option>
                          <option value="Lead Technician">Lead Technician</option>
                          <option value="IT Technician">IT Technician</option>
                          <option value="Vendor">Vendor</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={editingMember.email}
                          onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editingMember.phone}
                          onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={editingMember.location}
                          onChange={(e) => setEditingMember({...editingMember, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                          value={editingMember.status}
                          onChange={(e) => setEditingMember({...editingMember, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select 
                          value={editingMember.department}
                          onChange={(e) => setEditingMember({...editingMember, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Maintenance">Maintenance</option>
                          <option value="IT Support">IT Support</option>
                          <option value="External">External</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                        <input
                          type="date"
                          value={editingMember.joinDate}
                          onChange={(e) => setEditingMember({...editingMember, joinDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={editingMember.rating}
                          onChange={(e) => setEditingMember({...editingMember, rating: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Efficiency (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editingMember.efficiency}
                          onChange={(e) => setEditingMember({...editingMember, efficiency: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                      <input
                        type="text"
                        value={editingMember.specialties.join(', ')}
                        onChange={(e) => setEditingMember({...editingMember, specialties: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter specialties (comma separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
                      <input
                        type="text"
                        value={editingMember.certifications.join(', ')}
                        onChange={(e) => setEditingMember({...editingMember, certifications: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter certifications (comma separated)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Work</label>
                      <input
                        type="text"
                        value={editingMember.currentWork || ''}
                        onChange={(e) => setEditingMember({...editingMember, currentWork: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter current work assignment"
                      />
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

          {/* View Tasks Modal */}
          {showTasksModal && selectedMemberForTasks && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Tasks - {selectedMemberForTasks.name}</h2>
                        <p className="text-gray-600">{selectedMemberForTasks.role} • {selectedMemberForTasks.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowTasksModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {memberTasks[selectedMemberForTasks.id]?.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Due: {task.dueDate}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Est: {task.estimatedHours}h | Actual: {task.actualHours}h
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {task.type}
                              </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
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
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No tasks found for this member</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Schedule Modal */}
          {showScheduleModal && selectedMemberForSchedule && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Schedule - {selectedMemberForSchedule.name}</h2>
                        <p className="text-gray-600">{selectedMemberForSchedule.role} • {selectedMemberForSchedule.location}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowScheduleModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {memberSchedule[selectedMemberForSchedule.id]?.map((schedule) => (
                      <div key={schedule.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{schedule.title}</h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {schedule.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {schedule.startTime} - {schedule.endTime}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(schedule.priority)}`}>
                                {schedule.priority}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(schedule.status)}`}>
                                {schedule.status}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {schedule.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No schedule found for this member</p>
                      </div>
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

export default PageTeam;
