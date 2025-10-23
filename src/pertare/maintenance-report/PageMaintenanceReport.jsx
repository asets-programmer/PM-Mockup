import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Save, 
  Send, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  X,
  Calendar,
  MapPin,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  ClipboardList,
  Camera,
  Download,
  User,
  Search,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';
import { useAuth } from '../auth/AuthContext';

const PageMaintenanceReport = () => {
  const { user } = useAuth();
  
  // Form States
  const [showReportForm, setShowReportForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit'
  const [selectedReportId, setSelectedReportId] = useState(null);
  
  // Report Form Data
  const [reportForm, setReportForm] = useState({
    equipmentName: '',
    location: '',
    maintenanceDate: '',
    maintenanceType: '',
    conditionBefore: '',
    findings: '',
    recommendations: '',
    actionsTaken: '',
    conditionAfter: '',
    notes: '',
    documents: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showReportDetail, setShowReportDetail] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Sample data laporan maintenance
  const [reports, setReports] = useState([
    {
      id: 'RPT-001',
      equipmentName: 'Genset A',
      location: 'Gudang Utama',
      maintenanceDate: '2024-12-10',
      maintenanceType: 'Preventive Maintenance',
      conditionBefore: 'Normal operation, running hours 2450 jam',
      findings: 'Filter udara kotor, level oli normal, tegangan output stabil',
      recommendations: 'Ganti filter udara, lanjutkan jadwal maintenance rutin',
      actionsTaken: 'Ganti filter udara baru, cek koneksi kabel, test running 30 menit',
      conditionAfter: 'Equipment berfungsi optimal, siap operasional',
      notes: 'Maintenance berjalan lancar, tidak ada masalah serius',
      status: 'Pending Approval',
      submittedDate: '2024-12-10 15:30',
      submittedBy: 'Budi Santoso',
      documents: [
        { name: 'BA_GensetA_20241210.pdf', type: 'BA', size: '2.3 MB' },
        { name: 'Photo_Before_001.jpg', type: 'Photo', size: '1.2 MB' }
      ]
    },
    {
      id: 'RPT-002',
      equipmentName: 'Dispenser A',
      location: 'Area Pump',
      maintenanceDate: '2024-12-08',
      maintenanceType: 'Corrective Maintenance',
      conditionBefore: 'Flow rate tidak stabil, ada gangguan pada selang',
      findings: 'Selang karet retak, fitting longgar, nozzle tersumbat',
      recommendations: 'Ganti selang baru, perbaiki fitting, bersihkan nozzle',
      actionsTaken: 'Ganti selang karet baru, perbaiki fitting, bersihkan nozzle dengan chemical',
      conditionAfter: 'Flow rate stabil, tidak ada kebocoran, dispensasi normal',
      notes: 'Perbaikan berhasil, perlu monitoring flow rate selama 1 minggu',
      status: 'Approved',
      submittedDate: '2024-12-08 16:45',
      submittedBy: 'Sari Wijaya',
      approvedDate: '2024-12-09 09:15',
      approvedBy: 'ABH Supervisor',
      documents: [
        { name: 'BA_DispenserA_20241208.pdf', type: 'BA', size: '1.8 MB' },
        { name: 'BAPP_Vendor_Repair.pdf', type: 'BAPP', size: '3.1 MB' }
      ]
    },
    {
      id: 'RPT-003',
      equipmentName: 'Panel Listrik',
      location: 'Ruang Server',
      maintenanceDate: '2024-12-05',
      maintenanceType: 'Emergency Repair',
      conditionBefore: 'MCB trip, tidak ada power ke server',
      findings: 'Grounding tidak optimal, kabel MCB panas, ada arus bocor',
      recommendations: 'Perbaiki grounding, ganti MCB, cek isolasi kabel',
      actionsTaken: 'Perbaiki sistem grounding, ganti MCB 20A baru, test isolasi kabel',
      conditionAfter: 'Power normal, grounding optimal, MCB berfungsi baik',
      notes: 'Emergency repair selesai, perlu inspeksi berkala grounding',
      status: 'Rejected',
      submittedDate: '2024-12-05 20:30',
      submittedBy: 'Andi Pratama',
      rejectedDate: '2024-12-06 10:20',
      rejectedBy: 'ABH Supervisor',
      rejectionReason: 'Dokumentasi foto tidak lengkap, perlu foto grounding detail',
      documents: [
        { name: 'BA_PanelListrik_20241205.pdf', type: 'BA', size: '2.1 MB' }
      ]
    },
    {
      id: 'RPT-004',
      equipmentName: 'Tank Monitoring',
      location: 'Area Tank',
      maintenanceDate: '2024-12-12',
      maintenanceType: 'Preventive Maintenance',
      conditionBefore: 'Sensor level berfungsi normal, alarm system aktif',
      findings: 'Sensor level akurat, alarm berfungsi baik, display normal',
      recommendations: 'Lanjutkan jadwal maintenance rutin, monitor trend data',
      actionsTaken: 'Kalibrasi sensor level, test alarm high/low, update firmware',
      conditionAfter: 'Semua fungsi normal, akurasi sensor optimal',
      notes: 'Maintenance preventif berjalan sesuai SOP',
      status: 'Pending Approval',
      submittedDate: '2024-12-12 14:20',
      submittedBy: 'Rudi Hermawan',
      documents: [
        { name: 'BA_TankMonitoring_20241212.pdf', type: 'BA', size: '1.9 MB' },
        { name: 'Calibration_Report.pdf', type: 'Document', size: '0.8 MB' }
      ]
    }
  ]);

  // Filter reports based on search and status
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status display
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Pending Approval':
        return { color: 'text-yellow-600 bg-yellow-100', icon: Clock, text: 'Pending Approval' };
      case 'Approved':
        return { color: 'text-green-600 bg-green-100', icon: CheckCircle, text: 'Approved' };
      case 'Rejected':
        return { color: 'text-white', icon: AlertTriangle, text: 'Rejected' };
      default:
        return { color: 'text-gray-600 bg-gray-100', icon: FileText, text: status };
    }
  };

  // Form Functions
  const handleOpenForm = (mode = 'create', reportId = null) => {
    setFormMode(mode);
    setSelectedReportId(reportId);
    
    if (mode === 'edit' && reportId) {
      const report = reports.find(rpt => rpt.id === reportId);
      if (report) {
        setReportForm({
          equipmentName: report.equipmentName,
          location: report.location,
          maintenanceDate: report.maintenanceDate,
          maintenanceType: report.maintenanceType,
          conditionBefore: report.conditionBefore,
          findings: report.findings,
          recommendations: report.recommendations,
          actionsTaken: report.actionsTaken,
          conditionAfter: report.conditionAfter,
          notes: report.notes,
          documents: []
        });
      }
    } else {
      setReportForm({
        equipmentName: '',
        location: '',
        maintenanceDate: '',
        maintenanceType: '',
        conditionBefore: '',
        findings: '',
        recommendations: '',
        actionsTaken: '',
        conditionAfter: '',
        notes: '',
        documents: []
      });
    }
    
    setFormErrors({});
    setShowReportForm(true);
  };

  const handleCloseForm = () => {
    setShowReportForm(false);
    setFormMode('create');
    setSelectedReportId(null);
    setReportForm({
      equipmentName: '',
      location: '',
      maintenanceDate: '',
      maintenanceType: '',
      conditionBefore: '',
      findings: '',
      recommendations: '',
      actionsTaken: '',
      conditionAfter: '',
      notes: '',
      documents: []
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!reportForm.equipmentName.trim()) {
      errors.equipmentName = 'Nama alat harus diisi';
    }
    
    if (!reportForm.location.trim()) {
      errors.location = 'Lokasi harus diisi';
    }
    
    if (!reportForm.maintenanceDate) {
      errors.maintenanceDate = 'Tanggal maintenance harus diisi';
    }
    
    if (!reportForm.maintenanceType.trim()) {
      errors.maintenanceType = 'Jenis maintenance harus diisi';
    }
    
    if (!reportForm.conditionBefore.trim()) {
      errors.conditionBefore = 'Kondisi sebelum harus diisi';
    }
    
    if (!reportForm.findings.trim()) {
      errors.findings = 'Temuan harus diisi';
    }
    
    if (!reportForm.actionsTaken.trim()) {
      errors.actionsTaken = 'Tindakan yang dilakukan harus diisi';
    }
    
    if (!reportForm.conditionAfter.trim()) {
      errors.conditionAfter = 'Kondisi sesudah harus diisi';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setReportForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDocumentUpload = (event) => {
    const files = Array.from(event.target.files);
    const newDocuments = files.map(file => ({
      name: file.name,
      type: file.name.includes('BA') ? 'BA' : file.name.includes('BAPP') ? 'BAPP' : 'Document',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      file: file
    }));
    
    setReportForm(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  };

  const handleRemoveDocument = (index) => {
    setReportForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSaveDraft = () => {
    if (validateForm()) {
      const currentUser = user?.name || 'Teknisi';
      const timestamp = new Date().toLocaleString('id-ID');
      
      const newReport = {
        id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
        ...reportForm,
        status: 'Draft',
        submittedDate: timestamp,
        submittedBy: currentUser
      };
      
      setReports(prev => [...prev, newReport]);
      alert('Laporan berhasil disimpan sebagai draft!');
      handleCloseForm();
    }
  };

  const handleSubmitToABH = () => {
    if (validateForm()) {
      const currentUser = user?.name || 'Teknisi';
      const timestamp = new Date().toLocaleString('id-ID');
      
      const newReport = {
        id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
        ...reportForm,
        status: 'Pending Approval',
        submittedDate: timestamp,
        submittedBy: currentUser
      };
      
      setReports(prev => [...prev, newReport]);
      alert('Laporan berhasil dikirim ke ABH untuk approval!');
      handleCloseForm();
    }
  };

  const handleViewDetail = (report) => {
    setSelectedReport(report);
    setShowReportDetail(true);
  };

  const handleCloseDetail = () => {
    setShowReportDetail(false);
    setSelectedReport(null);
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
            <h1 className="text-2xl font-bold text-gray-800">Laporan Maintenance</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">{reports.length}</div>
                  <div className="text-sm text-gray-600">Total Laporan</div>
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
                    {reports.filter(r => r.status === 'Pending Approval').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Approval</div>
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
                    {reports.filter(r => r.status === 'Approved').length}
                  </div>
                  <div className="text-sm text-gray-600">Approved</div>
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
                    {reports.filter(r => r.status === 'Rejected').length}
                  </div>
                  <div className="text-sm text-gray-600">Rejected</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pencarian Laporan Maintenance
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan nama equipment, lokasi, atau jenis maintenance..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Status Laporan
                </label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="All">Semua Status</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Daftar Laporan yang Telah Dikirim</h2>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Total: {filteredReports.length} laporan
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
                  
                  {/* Action Button */}
                  <button
                    onClick={() => handleOpenForm('create')}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Laporan Baru
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {filteredReports.length > 0 ? (
                <>
                  {/* Grid View */}
                  {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredReports.map((report) => {
                        const statusDisplay = getStatusDisplay(report.status);
                        const StatusIcon = statusDisplay.icon;
                        
                        return (
                          <div key={report.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200">
                            {/* Report Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-1">{report.equipmentName}</h3>
                                <p className="text-sm text-gray-600">{report.id}</p>
                              </div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`} style={report.status === 'Rejected' ? { backgroundColor: '#fd0017' } : {}}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusDisplay.text}
                              </span>
                            </div>

                            {/* Report Details */}
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm">
                                <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-700">{report.location}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-700">{report.maintenanceDate}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Wrench className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-700">{report.maintenanceType}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-gray-700">{report.documents.length} dokumen</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2 pt-3 border-t">
                              <button
                                onClick={() => handleViewDetail(report)}
                                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs flex-1 justify-center"
                                title="View Detail"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Detail
                              </button>
                              {report.status === 'Draft' && (
                                <button
                                  onClick={() => handleOpenForm('edit', report.id)}
                                  className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs"
                                  title="Edit Report"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                              )}
                            </div>

                            {/* Submitted Info */}
                            <div className="border-t pt-3 mt-3">
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center">
                                  <User className="w-3 h-3 mr-1" />
                                  <span>{report.submittedBy}</span>
                                </div>
                                <span>{report.submittedDate}</span>
                              </div>
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
                              Equipment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Lokasi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Jenis Maintenance
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dokumen
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredReports.map((report) => {
                            const statusDisplay = getStatusDisplay(report.status);
                            const StatusIcon = statusDisplay.icon;
                            
                            return (
                              <tr key={report.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Wrench className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{report.equipmentName}</div>
                                      <div className="text-sm text-gray-500">{report.id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-900">{report.location}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-900">{report.maintenanceDate}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-sm text-gray-900">{report.maintenanceType}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`} style={report.status === 'Rejected' ? { backgroundColor: '#fd0017' } : {}}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusDisplay.text}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-900">{report.documents.length} files</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => handleViewDetail(report)}
                                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                                      title="View Detail"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      Detail
                                    </button>
                                    {report.status === 'Draft' && (
                                      <button
                                        onClick={() => handleOpenForm('edit', report.id)}
                                        className="flex items-center px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs"
                                        title="Edit Report"
                                      >
                                        <Edit className="w-3 h-3 mr-1" />
                                        Edit
                                      </button>
                                    )}
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
                  <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-500">Create your first maintenance report.</p>
                </div>
              )}
            </div>
          </div>

          {/* Report Form Modal */}
          {showReportForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {formMode === 'create' ? 'Buat Laporan Maintenance Baru' : 'Edit Laporan'}
                    </h2>
                    <button
                      onClick={handleCloseForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Dasar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Alat *
                          </label>
                          <input
                            type="text"
                            value={reportForm.equipmentName}
                            onChange={(e) => handleInputChange('equipmentName', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.equipmentName ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Masukkan nama alat"
                          />
                          {formErrors.equipmentName && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.equipmentName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lokasi *
                          </label>
                          <input
                            type="text"
                            value={reportForm.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.location ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Masukkan lokasi"
                          />
                          {formErrors.location && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.location}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tanggal Maintenance *
                          </label>
                          <input
                            type="date"
                            value={reportForm.maintenanceDate}
                            onChange={(e) => handleInputChange('maintenanceDate', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.maintenanceDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {formErrors.maintenanceDate && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.maintenanceDate}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Jenis Maintenance *
                          </label>
                          <select
                            value={reportForm.maintenanceType}
                            onChange={(e) => handleInputChange('maintenanceType', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.maintenanceType ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Pilih jenis maintenance</option>
                            <option value="Preventive Maintenance">Preventive Maintenance</option>
                            <option value="Corrective Maintenance">Corrective Maintenance</option>
                            <option value="Emergency Repair">Emergency Repair</option>
                            <option value="Condition Monitoring">Condition Monitoring</option>
                          </select>
                          {formErrors.maintenanceType && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.maintenanceType}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Detail Maintenance</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kondisi Sebelum *
                          </label>
                          <textarea
                            value={reportForm.conditionBefore}
                            onChange={(e) => handleInputChange('conditionBefore', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.conditionBefore ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Deskripsikan kondisi alat sebelum maintenance"
                          />
                          {formErrors.conditionBefore && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.conditionBefore}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Temuan dan Rekomendasi *
                          </label>
                          <textarea
                            value={reportForm.findings}
                            onChange={(e) => handleInputChange('findings', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.findings ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Tuliskan temuan dan rekomendasi"
                          />
                          {formErrors.findings && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.findings}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tindakan yang Dilakukan *
                          </label>
                          <textarea
                            value={reportForm.actionsTaken}
                            onChange={(e) => handleInputChange('actionsTaken', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.actionsTaken ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Deskripsikan tindakan yang dilakukan"
                          />
                          {formErrors.actionsTaken && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.actionsTaken}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Kondisi Sesudah *
                          </label>
                          <textarea
                            value={reportForm.conditionAfter}
                            onChange={(e) => handleInputChange('conditionAfter', e.target.value)}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              formErrors.conditionAfter ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Deskripsikan kondisi alat setelah maintenance"
                          />
                          {formErrors.conditionAfter && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.conditionAfter}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catatan Tambahan
                          </label>
                          <textarea
                            value={reportForm.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Catatan tambahan (opsional)"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document Upload */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Dokumen</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload BA (Berita Acara) atau BAPP (Laporan Vendor)
                          </label>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleDocumentUpload}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Format yang didukung: PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                          </p>
                        </div>

                        {reportForm.documents.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Dokumen Terupload:</h4>
                            <div className="space-y-2">
                              {reportForm.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center">
                                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {doc.type} • {doc.size}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveDocument(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCloseForm}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </button>
                    <button
                      onClick={handleSubmitToABH}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit to ABH
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Report Detail Modal */}
          {showReportDetail && selectedReport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Detail Laporan - {selectedReport.equipmentName}
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
                    {/* Report Information */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Informasi Laporan</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Equipment:</span>
                          <span className="ml-2 font-medium">{selectedReport.equipmentName}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">{selectedReport.location}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Maintenance Date:</span>
                          <span className="ml-2 font-medium">{selectedReport.maintenanceDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 font-medium">{selectedReport.maintenanceType}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusDisplay(selectedReport.status).color}`} style={selectedReport.status === 'Rejected' ? { backgroundColor: '#fd0017' } : {}}>
                            {selectedReport.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Submitted By:</span>
                          <span className="ml-2 font-medium">{selectedReport.submittedBy}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Submitted Date:</span>
                          <span className="ml-2 font-medium">{selectedReport.submittedDate}</span>
                        </div>
                        {selectedReport.approvedBy && (
                          <div>
                            <span className="text-gray-600">Approved By:</span>
                            <span className="ml-2 font-medium">{selectedReport.approvedBy}</span>
                          </div>
                        )}
                        {selectedReport.approvedDate && (
                          <div>
                            <span className="text-gray-600">Approved Date:</span>
                            <span className="ml-2 font-medium">{selectedReport.approvedDate}</span>
                          </div>
                        )}
                        {selectedReport.rejectedBy && (
                          <div>
                            <span className="text-gray-600">Rejected By:</span>
                            <span className="ml-2 font-medium">{selectedReport.rejectedBy}</span>
                          </div>
                        )}
                        {selectedReport.rejectedDate && (
                          <div>
                            <span className="text-gray-600">Rejected Date:</span>
                            <span className="ml-2 font-medium">{selectedReport.rejectedDate}</span>
                          </div>
                        )}
                      </div>
                      {selectedReport.rejectionReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <span className="text-red-800 font-medium">Rejection Reason:</span>
                          <p className="text-red-700 mt-1">{selectedReport.rejectionReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Maintenance Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Detail Maintenance</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Kondisi Sebelum:</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.conditionBefore}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Temuan dan Rekomendasi:</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.findings}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Tindakan yang Dilakukan:</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.actionsTaken}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-2">Kondisi Sesudah:</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.conditionAfter}</p>
                        </div>
                        {selectedReport.notes && (
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">Catatan Tambahan:</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReport.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Documents */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Dokumen</h3>
                      <div className="space-y-2">
                        {selectedReport.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-400 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                                <div className="text-xs text-gray-500">
                                  {doc.type} • {doc.size}
                                </div>
                              </div>
                            </div>
                            <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleCloseDetail}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
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

export default PageMaintenanceReport;
