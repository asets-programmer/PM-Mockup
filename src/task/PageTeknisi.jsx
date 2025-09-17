import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Users,
  MapPin,
  Calendar,
  FileText,
  Camera,
  Upload,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageTeknisi = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedTechnician, setSelectedTechnician] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedReviewStatus, setSelectedReviewStatus] = useState('All');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [showComponentRequestModal, setShowComponentRequestModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedTaskForComponent, setSelectedTaskForComponent] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRequestForApproval, setSelectedRequestForApproval] = useState(null);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [selectedItemForUpdate, setSelectedItemForUpdate] = useState(null);
  
  // HO Approval states
  const [showHOApprovalModal, setShowHOApprovalModal] = useState(false);
  const [selectedTaskForHOApproval, setSelectedTaskForHOApproval] = useState(null);
  const [hoApprovalData, setHoApprovalData] = useState({
    approvalStatus: 'pending', // pending, approved, rejected
    approvalNotes: '',
    selectedVendor: '',
    approvedBy: '',
    approvalDate: '',
    estimatedCost: '',
    vendorContact: ''
  });
  
  // Review & Validation states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedTaskForReview, setSelectedTaskForReview] = useState(null);
  const [reviewData, setReviewData] = useState({
    reviewStatus: 'pending', // pending, approved, rejected
    reviewNotes: '',
    additionalRecommendations: '',
    componentRecommendations: [],
    followUpAction: 'none', // none, schedule_replacement, order_parts, escalate
    reviewedBy: '',
    reviewDate: '',
    reviewAction: 'send_to_ho' // send_to_ho, mark_completed
  });

  // Add Work Order form states
  const [newWorkOrder, setNewWorkOrder] = useState({
    title: '',
    type: 'Preventive',
    equipment: '',
    location: '',
    technician: '',
    priority: 'Medium',
    dueDate: '',
    estimatedHours: 4,
    description: '',
    technicianType: 'internal',
    selectedInternalTechnician: '',
    selectedVendor: '',
    selectedInternalTechnicianForVendor: ''
  });

  // Sample data work orders
  const workOrdersData = [
    {
      id: 'TA-2025-001',
      title: 'Genset A Preventive Maintenance',
      type: 'Preventive',
      equipment: 'Genset A',
      location: 'SPBU Jakarta Selatan',
      technician: 'Sari Wijaya',
      priority: 'High',
      status: 'In Progress',
      createdDate: '2025-08-15 08:30:00',
      dueDate: '2025-08-20 16:00:00',
      startDate: '2025-08-15 09:00:00',
      completedDate: null,
      estimatedHours: 4,
      actualHours: 2.5,
      description: 'Rutin maintenance genset setiap 250 jam operasi. Cek oli, filter udara, test beban, dan sistem pendingin.',
      checklist: [
        { item: 'Cek level oli', completed: true, notes: 'Level normal, masih dalam batas aman' },
        { item: 'Cek filter udara', completed: true, notes: 'Filter kotor, perlu penggantian dalam 2 minggu' },
        { item: 'Test beban', completed: true, notes: 'Generator berfungsi normal pada beban 80%' },
        { item: 'Cek sistem pendingin', completed: true, notes: 'Radiator bersih, coolant level normal' },
        { item: 'Cek belt timing', completed: true, notes: 'Belt mulai retak, rekomendasikan penggantian' },
        { item: 'Test emergency stop', completed: true, notes: 'Emergency stop berfungsi normal' }
      ],
      attachments: [
        { name: 'before_photo_1.jpg', type: 'image', size: '2.1 MB' },
        { name: 'oil_check.jpg', type: 'image', size: '1.8 MB' }
      ],
      history: [
        { date: '2025-08-15 08:30:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-15 09:00:00', action: 'Assigned to Sari Wijaya', user: 'Admin' },
        { date: '2025-08-15 09:15:00', action: 'Work Started', user: 'Sari Wijaya' },
        { date: '2025-08-15 10:30:00', action: 'Oil check completed', user: 'Sari Wijaya' }
      ],
      sla: {
        target: 4, // hours
        remaining: 1.5,
        status: 'On Track'
      },
      review: {
        status: 'pending', // pending, approved, rejected
        reviewedBy: null,
        reviewDate: null,
        reviewNotes: '',
        additionalRecommendations: '',
        componentRecommendations: [],
        followUpAction: 'none'
      }
    },
    {
      id: 'TA-2025-002',
      title: 'Panel Listrik Emergency Repair',
      type: 'Emergency',
      equipment: 'Panel Listrik',
      location: 'SPBU Jakarta Selatan',
      technician: 'Rudi Hermawan',
      priority: 'Critical',
      status: 'Open',
      createdDate: '2025-08-15 14:30:00',
      dueDate: '2025-08-15 18:30:00',
      startDate: null,
      completedDate: null,
      estimatedHours: 2,
      actualHours: 0,
      description: 'Panel listrik trip dan tidak bisa direset. Perlu pengecekan MCB dan grounding.',
      checklist: [
        { item: 'Cek MCB utama', completed: false, notes: 'MCB trip, perlu pengecekan lebih lanjut' },
        { item: 'Cek grounding', completed: false, notes: 'Belum dicek - menunggu MCB diperbaiki' },
        { item: 'Test emergency stop', completed: false, notes: 'Tidak bisa ditest karena listrik mati' },
        { item: 'Reset panel', completed: false, notes: 'Panel tidak bisa direset, ada masalah di MCB' },
        { item: 'Cek kabel instalasi', completed: false, notes: 'Perlu pengecekan kabel dari MCB ke beban' },
        { item: 'Test isolasi', completed: false, notes: 'Test isolasi akan dilakukan setelah MCB normal' }
      ],
      attachments: [],
      history: [
        { date: '2025-08-15 14:30:00', action: 'Emergency Work Order Created', user: 'System' },
        { date: '2025-08-15 14:35:00', action: 'Assigned to Rudi Hermawan', user: 'Admin' }
      ],
      sla: {
        target: 4, // hours
        remaining: 4,
        status: 'At Risk'
      },
      review: {
        status: 'pending',
        reviewedBy: null,
        reviewDate: null,
        reviewNotes: '',
        additionalRecommendations: '',
        componentRecommendations: [],
        followUpAction: 'none'
      }
    },
    {
      id: 'TA-2025-003',
      title: 'CCTV System Maintenance',
      type: 'Preventive',
      equipment: 'CCTV System',
      location: 'SPBU Jakarta Selatan',
      technician: 'Andi Pratama',
      priority: 'Medium',
      status: 'Completed',
      createdDate: '2025-08-14 10:00:00',
      dueDate: '2025-08-15 14:00:00',
      startDate: '2025-08-15 10:00:00',
      completedDate: '2025-08-15 13:30:00',
      estimatedHours: 3,
      actualHours: 3.5,
      description: 'Maintenance kamera CCTV dan DVR. Bersihkan lensa, cek kabel, test recording.',
      checklist: [
        { item: 'Bersihkan lensa kamera', completed: true, notes: 'Semua 8 kamera dibersihkan, 2 kamera lensa buram perlu penggantian' },
        { item: 'Cek kabel koneksi', completed: true, notes: 'Kabel dalam kondisi baik, 1 kabel BNC longgar diperbaiki' },
        { item: 'Test recording', completed: true, notes: 'Recording berfungsi normal, kapasitas HDD 85% penuh' },
        { item: 'Update firmware', completed: true, notes: 'Firmware terbaru sudah diinstall, DVR berfungsi optimal' },
        { item: 'Cek power supply', completed: true, notes: 'Power supply normal, backup UPS berfungsi baik' },
        { item: 'Test remote access', completed: true, notes: 'Remote access berfungsi, koneksi internet stabil' }
      ],
      attachments: [
        { name: 'camera_cleaning.jpg', type: 'image', size: '1.5 MB' },
        { name: 'recording_test.mp4', type: 'video', size: '15.2 MB' },
        { name: 'firmware_update.log', type: 'document', size: '0.5 MB' }
      ],
      history: [
        { date: '2025-08-14 10:00:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-15 10:00:00', action: 'Work Started', user: 'Andi Pratama' },
        { date: '2025-08-15 13:30:00', action: 'Work Completed', user: 'Andi Pratama' },
        { date: '2025-08-15 13:35:00', action: 'Work Order Closed', user: 'Supervisor' }
      ],
      sla: {
        target: 4, // hours
        remaining: 0,
        status: 'Completed'
      },
      review: {
        status: 'approved',
        reviewedBy: 'ABH',
        reviewDate: '2025-08-15 14:00:00',
        reviewNotes: 'Pekerjaan maintenance CCTV telah dilakukan dengan baik. Semua checklist telah diselesaikan sesuai standar.',
        additionalRecommendations: 'Disarankan untuk melakukan backup recording secara berkala dan monitoring kualitas video.',
        componentRecommendations: [
          { component: 'HDD DVR', recommendation: 'Ganti dalam 6 bulan ke depan', priority: 'Medium' }
        ],
        followUpAction: 'schedule_replacement'
      },
      hoApproval: {
        status: 'approved',
        approvedBy: 'Manager HO',
        approvalDate: '2025-08-15 16:00:00',
        approvalNotes: 'Approved untuk penggantian HDD DVR sesuai rekomendasi ABH',
        selectedVendor: 'PT Teknik Mandiri',
        estimatedCost: 'Rp 2.500.000',
        vendorContact: '08123456789'
      }
    },
    {
      id: 'TA-2025-004',
      title: 'Dispenser A Calibration',
      type: 'Calibration',
      equipment: 'Dispenser A',
      location: 'SPBU Jakarta Selatan',
      technician: 'Budi Santoso',
      priority: 'Medium',
      status: 'Scheduled',
      createdDate: '2025-08-14 16:00:00',
      dueDate: '2025-08-25 10:00:00',
      startDate: null,
      completedDate: null,
      estimatedHours: 3,
      actualHours: 0,
      description: 'Kalibrasi dispenser untuk akurasi pengukuran. Test flow rate, kalibrasi sensor, cek seal.',
      checklist: [
        { item: 'Test flow rate', completed: false, notes: 'Belum dilakukan - menunggu jadwal kalibrasi' },
        { item: 'Kalibrasi sensor', completed: false, notes: 'Sensor perlu dikalibrasi dengan standar terbaru' },
        { item: 'Cek seal', completed: false, notes: 'Seal dispenser perlu dicek kebocoran' },
        { item: 'Test display', completed: false, notes: 'Display LCD perlu dicek kecerahan dan kontras' },
        { item: 'Cek nozzle', completed: false, notes: 'Nozzle perlu dicek kebersihan dan aliran' },
        { item: 'Test printer receipt', completed: false, notes: 'Printer receipt perlu dicek kualitas cetak' }
      ],
      attachments: [],
      history: [
        { date: '2025-08-14 16:00:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-14 16:05:00', action: 'Scheduled for 2025-08-25', user: 'Admin' }
      ],
      sla: {
        target: 4, // hours
        remaining: 4,
        status: 'On Track'
      },
      review: {
        status: 'pending',
        reviewedBy: null,
        reviewDate: null,
        reviewNotes: '',
        additionalRecommendations: '',
        componentRecommendations: [],
        followUpAction: 'none'
      }
    },
    {
      id: 'TA-2025-005',
      title: 'ATG System Check',
      type: 'Preventive',
      equipment: 'ATG System',
      location: 'SPBU Jakarta Selatan',
      technician: 'Dedi Kurniawan',
      priority: 'Low',
      status: 'Pending',
      createdDate: '2025-08-13 14:00:00',
      dueDate: '2025-08-28 11:30:00',
      startDate: null,
      completedDate: null,
      estimatedHours: 3,
      actualHours: 0,
      description: 'Pengecekan sistem monitoring tangki. Cek sensor level, test alarm, cek koneksi.',
      checklist: [
        { item: 'Cek sensor level', completed: false, notes: 'Sensor level perlu dicek akurasi pembacaan' },
        { item: 'Test alarm', completed: false, notes: 'Alarm high/low level perlu ditest fungsinya' },
        { item: 'Cek koneksi', completed: false, notes: 'Koneksi ke sistem monitoring perlu dicek' },
        { item: 'Update software', completed: false, notes: 'Software ATG perlu diupdate ke versi terbaru' },
        { item: 'Cek probe sensor', completed: false, notes: 'Probe sensor perlu dicek kebersihan dan kalibrasi' },
        { item: 'Test komunikasi', completed: false, notes: 'Komunikasi ke server monitoring perlu ditest' }
      ],
      attachments: [],
      history: [
        { date: '2025-08-13 14:00:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-13 14:05:00', action: 'Assigned to Dedi Kurniawan', user: 'Admin' }
      ],
      sla: {
        target: 4, // hours
        remaining: 4,
        status: 'On Track'
      },
      review: {
        status: 'pending',
        reviewedBy: null,
        reviewDate: null,
        reviewNotes: '',
        additionalRecommendations: '',
        componentRecommendations: [],
        followUpAction: 'none'
      }
    },
    {
      id: 'TA-2025-006',
      title: 'Pompa BBM Maintenance',
      type: 'Preventive',
      equipment: 'Pompa BBM',
      location: 'SPBU Jakarta Selatan',
      technician: 'Sari Wijaya',
      priority: 'Medium',
      status: 'Completed',
      createdDate: '2025-08-12 09:00:00',
      dueDate: '2025-08-14 16:00:00',
      startDate: '2025-08-14 10:00:00',
      completedDate: '2025-08-14 15:30:00',
      estimatedHours: 4,
      actualHours: 5.5,
      description: 'Maintenance rutin pompa BBM. Cek motor, seal, filter, dan sistem kontrol.',
      checklist: [
        { item: 'Cek motor pompa', completed: true, notes: 'Motor berfungsi normal, bearing mulai berisik' },
        { item: 'Cek seal pompa', completed: true, notes: 'Seal bocor ringan, perlu penggantian dalam 1 bulan' },
        { item: 'Cek filter BBM', completed: true, notes: 'Filter kotor, sudah diganti dengan spare part baru' },
        { item: 'Test sistem kontrol', completed: true, notes: 'Sistem kontrol berfungsi normal, display LCD retak' },
        { item: 'Cek kabel instalasi', completed: true, notes: 'Kabel dalam kondisi baik, terminal bersih' },
        { item: 'Test flow rate', completed: true, notes: 'Flow rate normal 45 L/menit, sesuai spesifikasi' },
        { item: 'Cek grounding', completed: true, notes: 'Grounding baik, resistansi 0.8 ohm' }
      ],
      attachments: [
        { name: 'pump_motor_check.jpg', type: 'image', size: '2.3 MB' },
        { name: 'seal_condition.jpg', type: 'image', size: '1.9 MB' },
        { name: 'flow_test_result.pdf', type: 'document', size: '0.8 MB' }
      ],
      history: [
        { date: '2025-08-12 09:00:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-14 10:00:00', action: 'Work Started', user: 'Sari Wijaya' },
        { date: '2025-08-14 15:30:00', action: 'Work Completed', user: 'Sari Wijaya' },
        { date: '2025-08-14 16:00:00', action: 'Work Order Closed', user: 'Supervisor' }
      ],
      sla: {
        target: 4, // hours
        remaining: 0,
        status: 'Completed'
      },
      review: {
        status: 'approved',
        reviewedBy: 'ABH',
        reviewDate: '2025-08-14 17:00:00',
        reviewNotes: 'Maintenance pompa BBM telah dilakukan dengan baik. Semua checklist telah diselesaikan sesuai standar. Ditemukan beberapa komponen yang perlu perhatian khusus.',
        additionalRecommendations: 'Disarankan untuk melakukan monitoring berkala pada seal pompa dan motor bearing. Pertimbangkan untuk upgrade display LCD yang sudah retak.',
        componentRecommendations: [
          { component: 'Seal Pompa BBM', recommendation: 'Ganti seal pompa dalam 1 bulan ke depan', priority: 'High' },
          { component: 'Motor Bearing', recommendation: 'Ganti bearing motor dalam 3 bulan ke depan', priority: 'Medium' },
          { component: 'Display LCD', recommendation: 'Ganti display LCD yang retak untuk keamanan', priority: 'Low' }
        ],
        followUpAction: 'schedule_replacement'
      },
      hoApproval: {
        status: 'pending',
        approvedBy: null,
        approvalDate: null,
        approvalNotes: '',
        selectedVendor: '',
        estimatedCost: '',
        vendorContact: ''
      }
    },
    {
      id: 'TA-2025-007',
      title: 'Compressor Maintenance',
      type: 'Preventive',
      equipment: 'Compressor Udara',
      location: 'SPBU Jakarta Selatan',
      technician: 'Budi Santoso',
      priority: 'High',
      status: 'Completed',
      createdDate: '2025-08-10 08:00:00',
      dueDate: '2025-08-12 16:00:00',
      startDate: '2025-08-12 09:00:00',
      completedDate: '2025-08-12 14:45:00',
      estimatedHours: 3,
      actualHours: 5.75,
      description: 'Maintenance rutin compressor udara. Cek motor, piston, valve, dan sistem pendingin.',
      checklist: [
        { item: 'Cek motor compressor', completed: true, notes: 'Motor berfungsi normal, kapasitor mulai lemah' },
        { item: 'Cek piston ring', completed: true, notes: 'Piston ring aus, perlu penggantian segera' },
        { item: 'Cek valve inlet/outlet', completed: true, notes: 'Valve inlet kotor, sudah dibersihkan. Valve outlet normal' },
        { item: 'Cek sistem pendingin', completed: true, notes: 'Radiator kotor, sudah dibersihkan. Fan motor normal' },
        { item: 'Test tekanan udara', completed: true, notes: 'Tekanan maksimal 8 bar, sesuai spesifikasi' },
        { item: 'Cek oil level', completed: true, notes: 'Oil level normal, warna sudah gelap perlu ganti' },
        { item: 'Cek filter udara', completed: true, notes: 'Filter udara kotor, sudah diganti dengan yang baru' },
        { item: 'Test auto start/stop', completed: true, notes: 'Auto start/stop berfungsi normal, pressure switch OK' }
      ],
      attachments: [
        { name: 'compressor_motor.jpg', type: 'image', size: '2.1 MB' },
        { name: 'piston_ring_wear.jpg', type: 'image', size: '1.7 MB' },
        { name: 'pressure_test_result.pdf', type: 'document', size: '0.6 MB' },
        { name: 'oil_analysis_report.pdf', type: 'document', size: '0.9 MB' }
      ],
      history: [
        { date: '2025-08-10 08:00:00', action: 'Work Order Created', user: 'System' },
        { date: '2025-08-12 09:00:00', action: 'Work Started', user: 'Budi Santoso' },
        { date: '2025-08-12 14:45:00', action: 'Work Completed', user: 'Budi Santoso' },
        { date: '2025-08-12 15:00:00', action: 'Work Order Closed', user: 'Supervisor' }
      ],
      sla: {
        target: 4, // hours
        remaining: 0,
        status: 'Completed'
      },
      review: {
        status: 'approved',
        reviewedBy: 'ABH',
        reviewDate: '2025-08-12 16:30:00',
        reviewNotes: 'Maintenance compressor udara telah dilakukan dengan baik. Ditemukan beberapa komponen yang perlu penggantian segera untuk mencegah kerusakan lebih lanjut.',
        additionalRecommendations: 'Disarankan untuk melakukan monitoring berkala pada piston ring dan kapasitor motor. Pertimbangkan untuk upgrade sistem pendingin jika diperlukan.',
        componentRecommendations: [
          { component: 'Piston Ring', recommendation: 'Ganti piston ring segera - sudah aus dan berisiko merusak cylinder', priority: 'Critical' },
          { component: 'Motor Capacitor', recommendation: 'Ganti kapasitor motor dalam 2 minggu - mulai lemah', priority: 'High' },
          { component: 'Compressor Oil', recommendation: 'Ganti oil compressor - warna sudah gelap dan kotor', priority: 'Medium' },
          { component: 'Pressure Switch', recommendation: 'Kalibrasi pressure switch untuk akurasi yang lebih baik', priority: 'Low' }
        ],
        followUpAction: 'order_parts'
      },
      hoApproval: {
        status: 'approved',
        approvedBy: 'Manager HO',
        approvalDate: '2025-08-12 18:00:00',
        approvalNotes: 'Approved untuk penggantian piston ring dan kapasitor motor sesuai rekomendasi ABH',
        selectedVendor: 'CV Jaya Abadi',
        estimatedCost: 'Rp 3.200.000',
        vendorContact: '08123456790'
      }
    }
  ];

  const statuses = ['All', 'Open', 'Scheduled', 'In Progress', 'Pending', 'Completed', 'Cancelled'];
  const priorities = ['All', 'Low', 'Medium', 'High', 'Critical'];
  const technicians = ['All', 'Budi Santoso', 'Sari Wijaya', 'Andi Pratama', 'Rudi Hermawan', 'Dedi Kurniawan'];
  const locations = ['All', 'SPBU Jakarta Selatan', 'SPBU Jakarta Utara', 'SPBU Jakarta Barat', 'SPBU Jakarta Timur'];
  const reviewStatuses = ['All', 'Pending Review', 'Approved', 'Rejected'];
  
  // Sample data for technicians and vendors
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

  // Sample data for inventory/stock management
  const [inventoryData, setInventoryData] = useState([
    {
      id: 'INV-001',
      componentName: 'Filter Udara',
      componentType: 'Air Filter',
      partNumber: 'AF-GEN-001',
      currentStock: 15,
      minStock: 5,
      unit: 'pcs',
      location: 'Gudang Utama',
      lastRestock: '2025-08-10',
      status: 'Available'
    },
    {
      id: 'INV-002',
      componentName: 'Filter Oli',
      componentType: 'Oil Filter',
      partNumber: 'OF-GEN-001',
      currentStock: 8,
      minStock: 10,
      unit: 'pcs',
      location: 'Gudang Utama',
      lastRestock: '2025-08-05',
      status: 'Low Stock'
    },
    {
      id: 'INV-003',
      componentName: 'Belt Timing',
      componentType: 'Belt',
      partNumber: 'BT-GEN-001',
      currentStock: 3,
      minStock: 5,
      unit: 'pcs',
      location: 'Gudang Utama',
      lastRestock: '2025-07-28',
      status: 'Critical Stock'
    },
    {
      id: 'INV-004',
      componentName: 'Sensor Temperatur',
      componentType: 'Sensor',
      partNumber: 'ST-GEN-001',
      currentStock: 0,
      minStock: 3,
      unit: 'pcs',
      location: 'Gudang Utama',
      lastRestock: '2025-07-15',
      status: 'Out of Stock'
    }
  ]);

  // Sample data for component requests
  const componentRequests = [
    {
      id: 'REQ-001',
      taskId: 'TA-2025-001',
      requestDate: '2025-08-15 10:00:00',
      requestedBy: 'Sari Wijaya',
      components: [
        { name: 'Filter Udara', quantity: 2, partNumber: 'AF-GEN-001' },
        { name: 'Filter Oli', quantity: 1, partNumber: 'OF-GEN-001' }
      ],
      status: 'Approved',
      approvedBy: 'ABH',
      approvedDate: '2025-08-15 14:30:00',
      priority: 'High',
      notes: 'Untuk maintenance genset A yang terjadwal besok'
    },
    {
      id: 'REQ-002',
      taskId: 'TA-2025-004',
      requestDate: '2025-08-14 16:00:00',
      requestedBy: 'Budi Santoso',
      components: [
        { name: 'Sensor Temperatur', quantity: 1, partNumber: 'ST-GEN-001' }
      ],
      status: 'Pending',
      approvedBy: null,
      approvedDate: null,
      priority: 'Medium',
      notes: 'Sensor rusak perlu diganti untuk kalibrasi dispenser'
    }
  ];

  const filteredWorkOrders = workOrdersData.filter(wo => {
    const matchesSearch = wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wo.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || wo.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || wo.priority === selectedPriority;
    const matchesTechnician = selectedTechnician === 'All' || wo.technician === selectedTechnician;
    const matchesLocation = selectedLocation === 'All' || wo.location === selectedLocation;
    const matchesReviewStatus = selectedReviewStatus === 'All' || 
                               (selectedReviewStatus === 'Pending Review' && (wo.review?.status === 'pending' || !wo.review?.status)) ||
                               (selectedReviewStatus === 'Approved' && wo.review?.status === 'approved') ||
                               (selectedReviewStatus === 'Rejected' && wo.review?.status === 'rejected');
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTechnician && matchesLocation && matchesReviewStatus;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'text-blue-600 bg-blue-100';
      case 'Scheduled': return 'text-purple-600 bg-purple-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-orange-600 bg-orange-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Preventive': return 'text-blue-600 bg-blue-100';
      case 'Emergency': return 'text-red-600 bg-red-100';
      case 'Calibration': return 'text-purple-600 bg-purple-100';
      case 'Corrective': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSLAStatusColor = (status) => {
    switch (status) {
      case 'On Track': return 'text-green-600 bg-green-100';
      case 'At Risk': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      case 'Completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = (checklist) => {
    const completed = checklist.filter(item => item.completed).length;
    return Math.round((completed / checklist.length) * 100);
  };

  const handleEditWorkOrder = (workOrder) => {
    setEditingWorkOrder(workOrder);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    // Simulate saving edited work order
    console.log('Saving edited work order:', editingWorkOrder);
    alert('Work Order berhasil diupdate!');
    setShowEditModal(false);
    setEditingWorkOrder(null);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingWorkOrder(null);
  };

  const handleAddWorkOrder = () => {
    // Simulate creating new work order
    console.log('Creating new work order:', newWorkOrder);
    alert('Work Order berhasil dibuat!');
    setShowAddModal(false);
    setNewWorkOrder({
      title: '',
      type: 'Preventive',
      equipment: '',
      location: '',
      technician: '',
      priority: 'Medium',
      dueDate: '',
      estimatedHours: 4,
      description: '',
      technicianType: 'internal',
      selectedInternalTechnician: '',
      selectedVendor: '',
      selectedInternalTechnicianForVendor: ''
    });
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setNewWorkOrder({
      title: '',
      type: 'Preventive',
      equipment: '',
      location: '',
      technician: '',
      priority: 'Medium',
      dueDate: '',
      estimatedHours: 4,
      description: '',
      technicianType: 'internal',
      selectedInternalTechnician: '',
      selectedVendor: '',
      selectedInternalTechnicianForVendor: ''
    });
  };

  // Component Request Functions
  const handleRequestComponents = (task) => {
    setSelectedTaskForComponent(task);
    setShowComponentRequestModal(true);
  };

  const handleViewInventory = () => {
    setShowInventoryModal(true);
  };

  const handleSubmitComponentRequest = (requestData) => {
    // Simulate submitting component request to HO
    console.log('Submitting component request:', requestData);
    alert('Request komponen berhasil dikirim ke HO untuk approval!');
    setShowComponentRequestModal(false);
    setSelectedTaskForComponent(null);
  };

  const handleCancelComponentRequest = () => {
    setShowComponentRequestModal(false);
    setSelectedTaskForComponent(null);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'text-green-600 bg-green-100';
      case 'Low Stock': return 'text-yellow-600 bg-yellow-100';
      case 'Critical Stock': return 'text-orange-600 bg-orange-100';
      case 'Out of Stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRequestStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Approval Functions
  const handleApproveRequest = (request) => {
    setSelectedRequestForApproval(request);
    setShowApprovalModal(true);
  };

  const handleApprovalDecision = (requestId, decision) => {
    // Simulate approval/rejection
    console.log(`${decision} request:`, requestId);
    alert(`Request ${requestId} telah ${decision === 'approve' ? 'disetujui' : 'ditolak'}!`);
    setShowApprovalModal(false);
    setSelectedRequestForApproval(null);
  };

  const handleCancelApproval = () => {
    setShowApprovalModal(false);
    setSelectedRequestForApproval(null);
  };

  // Update Stock Functions
  const handleUpdateStock = (itemId, newStock) => {
    setInventoryData(prevData => 
      prevData.map(item => {
        if (item.id === itemId) {
          const updatedItem = {
            ...item,
            currentStock: newStock,
            lastRestock: new Date().toISOString().split('T')[0]
          };
          
          // Update status based on stock level
          if (newStock === 0) {
            updatedItem.status = 'Out of Stock';
          } else if (newStock <= item.minStock) {
            updatedItem.status = 'Critical Stock';
          } else if (newStock <= item.minStock * 2) {
            updatedItem.status = 'Low Stock';
          } else {
            updatedItem.status = 'Available';
          }
          
          return updatedItem;
        }
        return item;
      })
    );
    alert(`Stock ${itemId} berhasil diupdate!`);
  };

  const handleOpenUpdateStock = () => {
    setShowUpdateStockModal(true);
  };

  const handleCloseUpdateStock = () => {
    setShowUpdateStockModal(false);
    setSelectedItemForUpdate(null);
  };

  const handleSubmitStockUpdate = (itemId, newStock) => {
    handleUpdateStock(itemId, newStock);
    setShowUpdateStockModal(false);
    setSelectedItemForUpdate(null);
  };

  // Review & Validation Functions
  const handleReviewWork = (workOrder) => {
    setSelectedTaskForReview(workOrder);
    setReviewData({
      reviewStatus: workOrder.review?.status || 'pending',
      reviewNotes: workOrder.review?.reviewNotes || '',
      additionalRecommendations: workOrder.review?.additionalRecommendations || '',
      componentRecommendations: workOrder.review?.componentRecommendations || [],
      followUpAction: workOrder.review?.followUpAction || 'none',
      reviewedBy: workOrder.review?.reviewedBy || '',
      reviewDate: workOrder.review?.reviewDate || '',
      reviewAction: 'send_to_ho'
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = () => {
    // Simulate submitting review
    console.log('Submitting review:', reviewData);
    
    if (reviewData.reviewAction === 'send_to_ho') {
      alert('Review berhasil dikirim ke HO untuk approval!');
    } else if (reviewData.reviewAction === 'mark_completed') {
      alert('Review berhasil diselesaikan!');
    }
    
    setShowReviewModal(false);
    setSelectedTaskForReview(null);
    setReviewData({
      reviewStatus: 'pending',
      reviewNotes: '',
      additionalRecommendations: '',
      componentRecommendations: [],
      followUpAction: 'none',
      reviewedBy: '',
      reviewDate: '',
      reviewAction: 'send_to_ho'
    });
  };

  const handleCancelReview = () => {
    setShowReviewModal(false);
    setSelectedTaskForReview(null);
    setReviewData({
      reviewStatus: 'pending',
      reviewNotes: '',
      additionalRecommendations: '',
      componentRecommendations: [],
      followUpAction: 'none',
      reviewedBy: '',
      reviewDate: '',
      reviewAction: 'send_to_ho'
    });
  };

  const addComponentRecommendation = () => {
    setReviewData({
      ...reviewData,
      componentRecommendations: [
        ...reviewData.componentRecommendations,
        { component: '', recommendation: '', priority: 'Medium' }
      ]
    });
  };

  const updateComponentRecommendation = (index, field, value) => {
    const updatedRecommendations = [...reviewData.componentRecommendations];
    updatedRecommendations[index][field] = value;
    setReviewData({
      ...reviewData,
      componentRecommendations: updatedRecommendations
    });
  };

  const removeComponentRecommendation = (index) => {
    const updatedRecommendations = reviewData.componentRecommendations.filter((_, i) => i !== index);
    setReviewData({
      ...reviewData,
      componentRecommendations: updatedRecommendations
    });
  };

  const getReviewStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHOApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFollowUpActionText = (action) => {
    switch (action) {
      case 'schedule_replacement': return 'Jadwalkan Penggantian';
      case 'order_parts': return 'Pesan Spare Parts';
      case 'escalate': return 'Eskalasi ke Level Atas';
      case 'none': return 'Tidak Ada Tindak Lanjut';
      default: return 'Tidak Ada Tindak Lanjut';
    }
  };

  const handleDownloadPDF = (workOrder) => {
    // Simulate PDF download
    console.log('Downloading PDF for work order:', workOrder.id);
    alert(`PDF report untuk ${workOrder.id} berhasil didownload!`);
  };

  // HO Approval Functions
  const handleHOApproval = (workOrder) => {
    setSelectedTaskForHOApproval(workOrder);
    setHoApprovalData({
      approvalStatus: workOrder.hoApproval?.status || 'pending',
      approvalNotes: workOrder.hoApproval?.approvalNotes || '',
      selectedVendor: workOrder.hoApproval?.selectedVendor || '',
      approvedBy: workOrder.hoApproval?.approvedBy || '',
      approvalDate: workOrder.hoApproval?.approvalDate || '',
      estimatedCost: workOrder.hoApproval?.estimatedCost || '',
      vendorContact: workOrder.hoApproval?.vendorContact || ''
    });
    setShowHOApprovalModal(true);
  };

  const handleSubmitHOApproval = () => {
    // Simulate submitting HO approval
    console.log('Submitting HO approval:', hoApprovalData);
    
    if (hoApprovalData.approvalStatus === 'approved') {
      alert('Work Order berhasil disetujui oleh HO!');
    } else if (hoApprovalData.approvalStatus === 'rejected') {
      alert('Work Order ditolak oleh HO!');
    }
    
    setShowHOApprovalModal(false);
    setSelectedTaskForHOApproval(null);
    setHoApprovalData({
      approvalStatus: 'pending',
      approvalNotes: '',
      selectedVendor: '',
      approvedBy: '',
      approvalDate: '',
      estimatedCost: '',
      vendorContact: ''
    });
  };

  const handleCancelHOApproval = () => {
    setShowHOApprovalModal(false);
    setSelectedTaskForHOApproval(null);
    setHoApprovalData({
      approvalStatus: 'pending',
      approvalNotes: '',
      selectedVendor: '',
      approvedBy: '',
      approvalDate: '',
      estimatedCost: '',
      vendorContact: ''
    });
  };

  // Helper function to detect if notes indicate component replacement needed
  const needsReplacement = (notes) => {
    if (!notes) return false;
    const replacementKeywords = [
      'penggantian', 'ganti', 'replacement', 'perlu ganti', 
      'segera', 'critical', 'aus', 'rusak', 'bocor', 'lemah',
      'retak', 'buram', 'kotor', 'gelap'
    ];
    return replacementKeywords.some(keyword => 
      notes.toLowerCase().includes(keyword)
    );
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Management</h1>
            <p className="text-gray-600 text-lg">Kelola, pantau, dan track semua task untuk teknisi internal dengan mudah</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">{workOrdersData.length}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {workOrdersData.filter(wo => wo.status === 'In Progress').length}
                  </div>
                  <div className="text-sm text-gray-600">Sedang Berjalan</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {workOrdersData.filter(wo => wo.status === 'Completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Selesai</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {workOrdersData.filter(wo => wo.priority === 'Critical').length}
                  </div>
                  <div className="text-sm text-gray-600">Prioritas Kritis</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-800">
                    {workOrdersData.filter(wo => wo.status === 'Completed' && (wo.review?.status === 'pending' || !wo.review?.status)).length}
                  </div>
                  <div className="text-sm text-gray-600">Pending Review</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Filter Tasks</h2>
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'grid' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm rounded ${
                      viewMode === 'list' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    List
                  </button>
                </div>

                {/* Inventory Check Button */}
                <button
                  onClick={handleViewInventory}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Inventory
                </button>

                {/* Add Task Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Search Bar - Full Width */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cari Task</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan ID, judul, equipment, atau lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Prioritas</label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* Technician Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Teknisi</label>
                <select
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {technicians.map(technician => (
                    <option key={technician} value={technician}>{technician}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Review Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Review Status</label>
                <select
                  value={selectedReviewStatus}
                  onChange={(e) => setSelectedReviewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {reviewStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Export Button & Filter Summary */}
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Menampilkan {filteredWorkOrders.length} dari {workOrdersData.length} tasks
              </div>
              <div className="flex items-center space-x-4">
                {(selectedStatus !== 'All' || selectedPriority !== 'All' || selectedTechnician !== 'All' || selectedLocation !== 'All' || selectedReviewStatus !== 'All' || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedStatus('All');
                      setSelectedPriority('All');
                      setSelectedTechnician('All');
                      setSelectedLocation('All');
                      setSelectedReviewStatus('All');
                      setSearchTerm('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Reset Filter
                  </button>
                )}
                <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Display */}
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkOrders.map((wo) => (
                <div key={wo.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{wo.id}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{wo.title}</p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <button
                        onClick={() => setSelectedWorkOrder(wo)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditWorkOrder(wo)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Work Order"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Status & Priority */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(wo.status)}`}>
                      {wo.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(wo.type)}`}>
                      {wo.type}
                    </span>
                  </div>

                  {/* Equipment & Location */}
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Wrench className="w-4 h-4 mr-3 text-gray-400" />
                      <span className="font-medium">{wo.equipment}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{wo.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{wo.technician}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {wo.status === 'In Progress' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Progress</span>
                        <span className="text-sm font-semibold">{calculateProgress(wo.checklist)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(wo.checklist)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* SLA Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SLA Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSLAStatusColor(wo.sla.status)}`}>
                        {wo.sla.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {wo.sla.remaining}h remaining
                    </div>
                  </div>

                  {/* Review Status */}
                  {wo.status === 'Completed' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Review Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewStatusColor(wo.review?.status || 'pending')}`}>
                          {wo.review?.status === 'approved' ? 'Approved' : 
                           wo.review?.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                        </span>
                      </div>
                      {wo.review?.reviewedBy && (
                        <div className="text-xs text-gray-500 mt-1">
                          Reviewed by: {wo.review.reviewedBy}
                        </div>
                      )}
                    </div>
                  )}

                  {/* HO Approval Status */}
                  {wo.status === 'Completed' && wo.review?.status === 'approved' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">HO Approval</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHOApprovalStatusColor(wo.hoApproval?.status || 'pending')}`}>
                          {wo.hoApproval?.status === 'approved' ? 'Approved' : 
                           wo.hoApproval?.status === 'rejected' ? 'Rejected' : 'Pending HO Approval'}
                        </span>
                      </div>
                      {wo.hoApproval?.approvedBy && (
                        <div className="text-xs text-gray-500 mt-1">
                          Approved by: {wo.hoApproval.approvedBy}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Due: {formatDate(wo.dueDate)}
                    </div>
                    {wo.startDate && (
                      <div className="flex items-center">
                        <Play className="w-4 h-4 mr-2" />
                        Started: {formatDate(wo.startDate)}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                    {wo.status === 'Open' && (
                      <button className="px-2 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                        <Play className="w-3 h-3 inline mr-1" />
                        Mulai
                      </button>
                    )}
                    {wo.status === 'In Progress' && (
                      <button className="px-2 py-1.5 text-xs bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                        <Pause className="w-3 h-3 inline mr-1" />
                        Pause
                      </button>
                    )}
                    {wo.status === 'Completed' && (
                      <button 
                        onClick={() => handleReviewWork(wo)}
                        className="px-2 py-1.5 text-xs bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                      >
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                        Review
                      </button>
                    )}
                    {wo.status === 'Completed' && wo.review?.status === 'approved' && (
                      <button 
                        onClick={() => handleHOApproval(wo)}
                        className="px-2 py-1.5 text-xs bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors font-medium"
                      >
                        <Users className="w-3 h-3 inline mr-1" />
                        HO
                      </button>
                    )}
                    <button 
                      onClick={() => setSelectedWorkOrder(wo)}
                      className="px-2 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                    >
                      <FileText className="w-3 h-3 inline mr-1" />
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Task</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Equipment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teknisi</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prioritas</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Review Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredWorkOrders.map((wo) => (
                      <tr key={wo.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{wo.id}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{wo.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{wo.equipment}</div>
                          <div className="text-sm text-gray-500">{wo.location}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {wo.technician}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(wo.status)}`}>
                            {wo.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                            {wo.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(wo.dueDate)}
                        </td>
                        <td className="px-6 py-4">
                          {wo.status === 'In Progress' ? (
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${calculateProgress(wo.checklist)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-600">{calculateProgress(wo.checklist)}%</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {wo.status === 'Completed' ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewStatusColor(wo.review?.status || 'pending')}`}>
                              {wo.review?.status === 'approved' ? 'Approved' : 
                               wo.review?.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedWorkOrder(wo)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEditWorkOrder(wo)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Work Order"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {wo.status === 'Completed' && (
                              <button 
                                onClick={() => handleReviewWork(wo)}
                                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                title="Review Work"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Task Detail Modal */}
          {selectedWorkOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{selectedWorkOrder.id}</h2>
                      <p className="text-gray-600">{selectedWorkOrder.title}</p>
                    </div>
                    <button
                      onClick={() => setSelectedWorkOrder(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{selectedWorkOrder.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Equipment:</span>
                          <span className="font-medium">{selectedWorkOrder.equipment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{selectedWorkOrder.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Technician:</span>
                          <span className="font-medium">{selectedWorkOrder.technician}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedWorkOrder.priority)}`}>
                            {selectedWorkOrder.priority}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedWorkOrder.status)}`}>
                            {selectedWorkOrder.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Timeline</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Created:</span>
                          <span className="font-medium">{formatDate(selectedWorkOrder.createdDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="font-medium">{formatDate(selectedWorkOrder.dueDate)}</span>
                        </div>
                        {selectedWorkOrder.startDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Started:</span>
                            <span className="font-medium">{formatDate(selectedWorkOrder.startDate)}</span>
                          </div>
                        )}
                        {selectedWorkOrder.completedDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Completed:</span>
                            <span className="font-medium">{formatDate(selectedWorkOrder.completedDate)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estimated Hours:</span>
                          <span className="font-medium">{selectedWorkOrder.estimatedHours}h</span>
                        </div>
                        {selectedWorkOrder.actualHours > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Actual Hours:</span>
                            <span className="font-medium">{selectedWorkOrder.actualHours}h</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
                      <p className="text-gray-700">{selectedWorkOrder.description}</p>
                    </div>

                    {/* Checklist */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Checklist</h3>
                      <div className="space-y-2">
                        {selectedWorkOrder.checklist.map((item, index) => {
                          const needsReplacement = item.notes && (
                            item.notes.toLowerCase().includes('penggantian') ||
                            item.notes.toLowerCase().includes('ganti') ||
                            item.notes.toLowerCase().includes('replacement') ||
                            item.notes.toLowerCase().includes('perlu ganti') ||
                            item.notes.toLowerCase().includes('segera') ||
                            item.notes.toLowerCase().includes('critical')
                          );
                          
                          return (
                            <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                              needsReplacement ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                            }`}>
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                item.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`}>
                                {item.completed && <CheckCircle className="w-3 h-3 text-white" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                    {item.item}
                                  </span>
                                  {needsReplacement && (
                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                      Perlu Penggantian
                                    </span>
                                  )}
                                </div>
                                {item.notes && (
                                  <p className={`text-xs mt-1 ${
                                    needsReplacement ? 'text-red-700 font-medium' : 'text-gray-500'
                                  }`}>
                                    {item.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Attachments */}
                    {selectedWorkOrder.attachments.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h3>
                        <div className="space-y-2">
                          {selectedWorkOrder.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-800">{attachment.name}</span>
                              </div>
                              <span className="text-xs text-gray-500">{attachment.size}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* History */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">History</h3>
                      <div className="space-y-2">
                        {selectedWorkOrder.history.map((entry, index) => (
                          <div key={index} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">{entry.action}</p>
                              <p className="text-xs text-gray-500">{entry.date} by {entry.user}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review Information */}
                    {selectedWorkOrder.status === 'Completed' && selectedWorkOrder.review && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Review & Validasi</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Status Review:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewStatusColor(selectedWorkOrder.review.status)}`}>
                              {selectedWorkOrder.review.status === 'approved' ? 'Approved' : 
                               selectedWorkOrder.review.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                            </span>
                          </div>
                          {selectedWorkOrder.review.reviewedBy && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Reviewed By:</span>
                              <span className="font-medium">{selectedWorkOrder.review.reviewedBy}</span>
                            </div>
                          )}
                          {selectedWorkOrder.review.reviewDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Review Date:</span>
                              <span className="font-medium">{formatDate(selectedWorkOrder.review.reviewDate)}</span>
                            </div>
                          )}
                          {selectedWorkOrder.review.reviewNotes && (
                            <div>
                              <span className="text-gray-600 block mb-1">Review Notes:</span>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedWorkOrder.review.reviewNotes}</p>
                            </div>
                          )}
                          {selectedWorkOrder.review.additionalRecommendations && (
                            <div>
                              <span className="text-gray-600 block mb-1">Rekomendasi Tambahan:</span>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedWorkOrder.review.additionalRecommendations}</p>
                            </div>
                          )}
                          {selectedWorkOrder.review.componentRecommendations && selectedWorkOrder.review.componentRecommendations.length > 0 && (
                            <div>
                              <span className="text-gray-600 block mb-2">Rekomendasi Komponen:</span>
                              <div className="space-y-2">
                                {selectedWorkOrder.review.componentRecommendations.map((rec, index) => (
                                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-medium text-gray-800">{rec.component}</div>
                                    <div className="text-sm text-gray-600">{rec.recommendation}</div>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                                      {rec.priority} Priority
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedWorkOrder.review.followUpAction && selectedWorkOrder.review.followUpAction !== 'none' && (
                            <div>
                              <span className="text-gray-600 block mb-1">Tindak Lanjut:</span>
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                {getFollowUpActionText(selectedWorkOrder.review.followUpAction)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* HO Approval Information */}
                    {selectedWorkOrder.status === 'Completed' && selectedWorkOrder.review?.status === 'approved' && selectedWorkOrder.hoApproval && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">HO Approval</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Status Approval:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHOApprovalStatusColor(selectedWorkOrder.hoApproval.status)}`}>
                              {selectedWorkOrder.hoApproval.status === 'approved' ? 'Approved' : 
                               selectedWorkOrder.hoApproval.status === 'rejected' ? 'Rejected' : 'Pending HO Approval'}
                            </span>
                          </div>
                          {selectedWorkOrder.hoApproval.approvedBy && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Approved By:</span>
                              <span className="font-medium">{selectedWorkOrder.hoApproval.approvedBy}</span>
                            </div>
                          )}
                          {selectedWorkOrder.hoApproval.approvalDate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Approval Date:</span>
                              <span className="font-medium">{formatDate(selectedWorkOrder.hoApproval.approvalDate)}</span>
                            </div>
                          )}
                          {selectedWorkOrder.hoApproval.approvalNotes && (
                            <div>
                              <span className="text-gray-600 block mb-1">Approval Notes:</span>
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedWorkOrder.hoApproval.approvalNotes}</p>
                            </div>
                          )}
                          {selectedWorkOrder.hoApproval.status === 'approved' && (
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-medium text-green-800 mb-2">Vendor Assignment</h4>
                              <div className="space-y-2">
                                {selectedWorkOrder.hoApproval.selectedVendor && (
                                  <div className="flex justify-between">
                                    <span className="text-green-700">Selected Vendor:</span>
                                    <span className="font-medium text-green-800">{selectedWorkOrder.hoApproval.selectedVendor}</span>
                                  </div>
                                )}
                                {selectedWorkOrder.hoApproval.estimatedCost && (
                                  <div className="flex justify-between">
                                    <span className="text-green-700">Estimated Cost:</span>
                                    <span className="font-medium text-green-800">{selectedWorkOrder.hoApproval.estimatedCost}</span>
                                  </div>
                                )}
                                {selectedWorkOrder.hoApproval.vendorContact && (
                                  <div className="flex justify-between">
                                    <span className="text-green-700">Vendor Contact:</span>
                                    <span className="font-medium text-green-800">{selectedWorkOrder.hoApproval.vendorContact}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button 
                      onClick={() => handleEditWorkOrder(selectedWorkOrder)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2 inline" />
                      Edit
                    </button>
                    {selectedWorkOrder.status === 'Open' && (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Play className="w-4 h-4 mr-2 inline" />
                        Start Work
                      </button>
                    )}
                    {selectedWorkOrder.status === 'In Progress' && (
                      <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        <Pause className="w-4 h-4 mr-2 inline" />
                        Pause Work
                      </button>
                    )}
                    {selectedWorkOrder.status === 'Completed' && (
                      <button 
                        onClick={() => handleReviewWork(selectedWorkOrder)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-2 inline" />
                        Review Work
                      </button>
                    )}
                    {selectedWorkOrder.status === 'Completed' && selectedWorkOrder.review?.status === 'approved' && (
                      <button 
                        onClick={() => handleHOApproval(selectedWorkOrder)}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Users className="w-4 h-4 mr-2 inline" />
                        HO Approval
                      </button>
                    )}
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload className="w-4 h-4 mr-2 inline" />
                      Upload Files
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Task Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Add New Task</h2>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={newWorkOrder.title}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter task title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select 
                          value={newWorkOrder.type}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Preventive">Preventive</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Calibration">Calibration</option>
                          <option value="Corrective">Corrective</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                        <input
                          type="text"
                          value={newWorkOrder.equipment}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, equipment: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter equipment name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                        <input
                          type="number"
                          value={newWorkOrder.estimatedHours}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, estimatedHours: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="4"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select 
                          value={newWorkOrder.priority}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <select 
                          value={newWorkOrder.location}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Lokasi</option>
                          <option value="SPBU Jakarta Selatan">SPBU Jakarta Selatan</option>
                          <option value="SPBU Jakarta Utara">SPBU Jakarta Utara</option>
                          <option value="SPBU Jakarta Barat">SPBU Jakarta Barat</option>
                          <option value="SPBU Jakarta Timur">SPBU Jakarta Timur</option>
                        </select>
                      </div>
                    </div>

                    {/* Technician Type Selection */}
                      <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Pilih Tipe Teknisi</label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                        <input
                            type="radio"
                            id="internal"
                            name="technicianType"
                            value="internal"
                            checked={newWorkOrder.technicianType === 'internal'}
                            onChange={(e) => setNewWorkOrder({...newWorkOrder, technicianType: e.target.value})}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor="internal" className="ml-2 text-sm text-gray-700">
                            Teknisi Internal
                          </label>
                      </div>
                        <div className="flex items-center opacity-50 cursor-not-allowed">
                          <input
                            type="radio"
                            id="vendor"
                            name="technicianType"
                            value="vendor"
                            disabled
                            className="w-4 h-4 text-gray-400 border-gray-300 cursor-not-allowed"
                          />
                          <label htmlFor="vendor" className="ml-2 text-sm text-gray-500 cursor-not-allowed">
                            Vendor
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Coming Soon
                            </span>
                          </label>
                        </div>
                        <div className="flex items-center opacity-50 cursor-not-allowed">
                          <input
                            type="radio"
                            id="vendor-internal"
                            name="technicianType"
                            value="vendor-internal"
                            disabled
                            className="w-4 h-4 text-gray-400 border-gray-300 cursor-not-allowed"
                          />
                          <label htmlFor="vendor-internal" className="ml-2 text-sm text-gray-500 cursor-not-allowed">
                            Vendor + Teknisi Pendamping
                            <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Coming Soon
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Technician Selection based on type */}
                    {newWorkOrder.technicianType === 'internal' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Teknisi Internal</label>
                        <select 
                          value={newWorkOrder.selectedInternalTechnician}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, selectedInternalTechnician: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Teknisi Internal</option>
                          {internalTechnicians.map(technician => (
                            <option key={technician} value={technician}>{technician}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {newWorkOrder.technicianType === 'vendor' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                        <select 
                          value={newWorkOrder.selectedVendor}
                          onChange={(e) => setNewWorkOrder({...newWorkOrder, selectedVendor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Pilih Vendor</option>
                          {vendors.map(vendor => (
                            <option key={vendor} value={vendor}>{vendor}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {newWorkOrder.technicianType === 'vendor-internal' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                          <select 
                            value={newWorkOrder.selectedVendor}
                            onChange={(e) => setNewWorkOrder({...newWorkOrder, selectedVendor: e.target.value})}
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
                            value={newWorkOrder.selectedInternalTechnicianForVendor}
                            onChange={(e) => setNewWorkOrder({...newWorkOrder, selectedInternalTechnicianForVendor: e.target.value})}
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                        type="datetime-local"
                        value={newWorkOrder.dueDate}
                        onChange={(e) => setNewWorkOrder({...newWorkOrder, dueDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={3}
                        value={newWorkOrder.description}
                        onChange={(e) => setNewWorkOrder({...newWorkOrder, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter task description"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelAdd}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddWorkOrder}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Task Modal */}
          {showEditModal && editingWorkOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={editingWorkOrder.title}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select 
                          value={editingWorkOrder.type}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Preventive">Preventive</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Calibration">Calibration</option>
                          <option value="Corrective">Corrective</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                        <input
                          type="text"
                          value={editingWorkOrder.equipment}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, equipment: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={editingWorkOrder.location}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technician</label>
                        <select 
                          value={editingWorkOrder.technician}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, technician: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Budi Santoso">Budi Santoso</option>
                          <option value="Sari Wijaya">Sari Wijaya</option>
                          <option value="Andi Pratama">Andi Pratama</option>
                          <option value="Rudi Hermawan">Rudi Hermawan</option>
                          <option value="Dedi Kurniawan">Dedi Kurniawan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select 
                          value={editingWorkOrder.priority}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, priority: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select 
                          value={editingWorkOrder.status}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Open">Open</option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Pending">Pending</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                        <input
                          type="datetime-local"
                          value={editingWorkOrder.dueDate ? editingWorkOrder.dueDate.slice(0, 16) : ''}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, dueDate: e.target.value + ':00'})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                        <input
                          type="number"
                          value={editingWorkOrder.estimatedHours}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, estimatedHours: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Actual Hours</label>
                        <input
                          type="number"
                          value={editingWorkOrder.actualHours}
                          onChange={(e) => setEditingWorkOrder({...editingWorkOrder, actualHours: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        rows={3}
                        value={editingWorkOrder.description}
                        onChange={(e) => setEditingWorkOrder({...editingWorkOrder, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Checklist Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Checklist</label>
                      <div className="space-y-2">
                        {editingWorkOrder.checklist.map((item, index) => {
                          const needsReplacement = item.notes && (
                            item.notes.toLowerCase().includes('penggantian') ||
                            item.notes.toLowerCase().includes('ganti') ||
                            item.notes.toLowerCase().includes('replacement') ||
                            item.notes.toLowerCase().includes('perlu ganti') ||
                            item.notes.toLowerCase().includes('segera') ||
                            item.notes.toLowerCase().includes('critical')
                          );
                          
                          return (
                            <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                              needsReplacement ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                            }`}>
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={(e) => {
                                  const newChecklist = [...editingWorkOrder.checklist];
                                  newChecklist[index].completed = e.target.checked;
                                  setEditingWorkOrder({...editingWorkOrder, checklist: newChecklist});
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={item.item}
                                onChange={(e) => {
                                  const newChecklist = [...editingWorkOrder.checklist];
                                  newChecklist[index].item = e.target.value;
                                  setEditingWorkOrder({...editingWorkOrder, checklist: newChecklist});
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={item.notes}
                                  onChange={(e) => {
                                    const newChecklist = [...editingWorkOrder.checklist];
                                    newChecklist[index].notes = e.target.value;
                                    setEditingWorkOrder({...editingWorkOrder, checklist: newChecklist});
                                  }}
                                  placeholder="Notes..."
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    needsReplacement ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                  }`}
                                />
                                {needsReplacement && (
                                  <span className="absolute -top-2 -right-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Perlu Penggantian
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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

          {/* Component Request Modal */}
          {showComponentRequestModal && selectedTaskForComponent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Request Komponen & Spare Parts</h2>
                    <button
                      onClick={handleCancelComponentRequest}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">Task: {selectedTaskForComponent.id} - {selectedTaskForComponent.title}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Component Request Form */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Request Komponen</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Komponen yang Dibutuhkan</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Pilih Komponen</option>
                            {inventoryData.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.componentName} - Stock: {item.currentStock} {item.unit}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                          <input
                            type="number"
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Jumlah yang dibutuhkan"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                          <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tambahkan catatan tentang kebutuhan komponen..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Current Inventory Status */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Inventory</h3>
                      <div className="space-y-3">
                        {inventoryData.map(item => (
                          <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium text-gray-800">{item.componentName}</div>
                                <div className="text-sm text-gray-600">{item.partNumber}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Stock: {item.currentStock} {item.unit} (Min: {item.minStock} {item.unit})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelComponentRequest}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSubmitComponentRequest(selectedTaskForComponent)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Submit Request ke HO
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Check Modal */}
          {showInventoryModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Inventory & Stock Management</h2>
                    <button
                      onClick={() => setShowInventoryModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">Kelola stok komponen dan spare parts</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Current Inventory */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Inventory</h3>
                      <div className="space-y-3">
                        {inventoryData.map(item => (
                          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium text-gray-800">{item.componentName}</div>
                                <div className="text-sm text-gray-600">{item.partNumber}</div>
                                <div className="text-sm text-gray-600">{item.componentType}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Current Stock:</span>
                                <span className="font-medium ml-1">{item.currentStock} {item.unit}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Min Stock:</span>
                                <span className="font-medium ml-1">{item.minStock} {item.unit}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Location:</span>
                                <span className="font-medium ml-1">{item.location}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Last Restock:</span>
                                <span className="font-medium ml-1">{item.lastRestock}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Component Requests */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Component Requests</h3>
                      <div className="space-y-3">
                        {componentRequests.map(request => (
                          <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="font-medium text-gray-800">{request.id}</div>
                                <div className="text-sm text-gray-600">Task: {request.taskId}</div>
                                <div className="text-sm text-gray-600">Requested by: {request.requestedBy}</div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRequestStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {request.components.map((comp, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                  • {comp.name} (Qty: {comp.quantity}) - {comp.partNumber}
                                </div>
                              ))}
                            </div>
                            {request.notes && (
                              <div className="text-sm text-gray-600 mt-2">
                                Notes: {request.notes}
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              Request Date: {request.requestDate}
                              {request.approvedDate && (
                                <span className="ml-4">Approved: {request.approvedDate}</span>
                              )}
                            </div>
                            
                            {/* Approval Buttons - Only show for Pending requests */}
                            {request.status === 'Pending' && (
                              <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                                <button
                                  onClick={() => handleApprovalDecision(request.id, 'approve')}
                                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  onClick={() => handleApprovalDecision(request.id, 'reject')}
                                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={() => setShowInventoryModal(false)}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button 
                      onClick={handleOpenUpdateStock}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Update Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Update Stock Modal */}
          {showUpdateStockModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Update Stock Inventory</h2>
                    <button
                      onClick={handleCloseUpdateStock}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">Update stok komponen dan spare parts</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {inventoryData.map(item => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-medium text-gray-800">{item.componentName}</div>
                            <div className="text-sm text-gray-600">{item.partNumber} - {item.componentType}</div>
                            <div className="text-sm text-gray-600">Current Stock: {item.currentStock} {item.unit}</div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Stock Quantity</label>
                            <input
                              type="number"
                              min="0"
                              defaultValue={item.currentStock}
                              id={`stock-${item.id}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter new stock quantity"
                            />
                          </div>
                          <div className="flex flex-col justify-end">
                            <button
                              onClick={() => {
                                const newStock = parseInt(document.getElementById(`stock-${item.id}`).value);
                                if (!isNaN(newStock) && newStock >= 0) {
                                  handleSubmitStockUpdate(item.id, newStock);
                                } else {
                                  alert('Please enter a valid stock quantity!');
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Update
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Min Stock: {item.minStock} {item.unit} | Location: {item.location}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCloseUpdateStock}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Review & Validation Modal */}
          {showReviewModal && selectedTaskForReview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Review & Validasi Pekerjaan</h2>
                    <button
                      onClick={handleCancelReview}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">Task: {selectedTaskForReview.id} - {selectedTaskForReview.title}</p>
                  <p className="text-sm text-gray-500">Teknisi: {selectedTaskForReview.technician}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Checklist Review */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Checklist</h3>
                      <div className="space-y-3">
                        {selectedTaskForReview.checklist.map((item, index) => {
                          const itemNeedsReplacement = needsReplacement(item.notes);
                          
                          return (
                            <div key={index} className={`rounded-lg p-4 ${
                              needsReplacement ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center space-x-3 mb-2">
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  item.completed ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                  {item.completed ? <CheckCircle className="w-3 h-3 text-white" /> : <AlertTriangle className="w-3 h-3 text-white" />}
                                </div>
                                <span className={`font-medium ${item.completed ? 'text-green-800' : 'text-red-800'}`}>
                                  {item.item}
                                </span>
                                {needsReplacement && (
                                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                    Perlu Penggantian
                                  </span>
                                )}
                              </div>
                              {item.notes && (
                                <p className={`text-sm ml-8 ${
                                  needsReplacement ? 'text-red-700 font-medium' : 'text-gray-600'
                                }`}>
                                  Notes: {item.notes}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review Form */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Form Review ABH</h3>
                      <div className="space-y-4">
                        {/* Review Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status Review</label>
                          <select
                            value={reviewData.reviewStatus}
                            onChange={(e) => setReviewData({...reviewData, reviewStatus: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pending">Pending Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        {/* Review Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Review</label>
                          <textarea
                            rows={3}
                            value={reviewData.reviewNotes}
                            onChange={(e) => setReviewData({...reviewData, reviewNotes: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan catatan review hasil pekerjaan..."
                          />
                        </div>

                        {/* Additional Recommendations */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rekomendasi Tambahan</label>
                          <textarea
                            rows={3}
                            value={reviewData.additionalRecommendations}
                            onChange={(e) => setReviewData({...reviewData, additionalRecommendations: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan rekomendasi tambahan jika ada..."
                          />
                        </div>

                        {/* Request Komponen */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-orange-800 mb-4">Request Komponen</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Komponen yang Dibutuhkan</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Pilih Komponen</option>
                                {inventoryData.map(item => (
                                  <option key={item.id} value={item.id}>
                                    {item.componentName} - Stock: {item.currentStock} {item.unit}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                              <input
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Jumlah yang dibutuhkan"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                              <textarea
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tambahkan catatan tentang kebutuhan komponen..."
                              />
                            </div>
                          </div>
                        </div>

                        {/* Component Recommendations */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">Rekomendasi Komponen</label>
                            <button
                              onClick={addComponentRecommendation}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              + Tambah Rekomendasi
                            </button>
                          </div>
                          <div className="space-y-2">
                            {reviewData.componentRecommendations.map((rec, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-3">
                                <div className="grid grid-cols-1 gap-2">
                                  <input
                                    type="text"
                                    value={rec.component}
                                    onChange={(e) => updateComponentRecommendation(index, 'component', e.target.value)}
                                    placeholder="Nama Komponen"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                  <input
                                    type="text"
                                    value={rec.recommendation}
                                    onChange={(e) => updateComponentRecommendation(index, 'recommendation', e.target.value)}
                                    placeholder="Rekomendasi"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <select
                                      value={rec.priority}
                                      onChange={(e) => updateComponentRecommendation(index, 'priority', e.target.value)}
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                      <option value="Low">Low Priority</option>
                                      <option value="Medium">Medium Priority</option>
                                      <option value="High">High Priority</option>
                                      <option value="Critical">Critical Priority</option>
                                    </select>
                                    <button
                                      onClick={() => removeComponentRecommendation(index)}
                                      className="px-2 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Follow Up Action */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tindak Lanjut</label>
                          <select
                            value={reviewData.followUpAction}
                            onChange={(e) => setReviewData({...reviewData, followUpAction: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="none">Tidak Ada Tindak Lanjut</option>
                            <option value="schedule_replacement">Jadwalkan Penggantian</option>
                            <option value="order_parts">Pesan Spare Parts</option>
                            <option value="escalate">Eskalasi ke Level Atas</option>
                          </select>
                        </div>

                        {/* Reviewed By */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Reviewed By</label>
                          <input
                            type="text"
                            value={reviewData.reviewedBy}
                            onChange={(e) => setReviewData({...reviewData, reviewedBy: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nama ABH yang melakukan review"
                          />
                        </div>

                        {/* Review Action */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Tindakan Review</label>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="reviewAction"
                                value="send_to_ho"
                                checked={reviewData.reviewAction === 'send_to_ho'}
                                onChange={(e) => setReviewData({...reviewData, reviewAction: e.target.value})}
                                className="mr-2"
                              />
                              <span className="text-sm">Kirim ke HO untuk Approval</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="reviewAction"
                                value="mark_completed"
                                checked={reviewData.reviewAction === 'mark_completed'}
                                onChange={(e) => setReviewData({...reviewData, reviewAction: e.target.value})}
                                className="mr-2"
                              />
                              <span className="text-sm">Tandai sebagai Selesai</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-between">
                    <div>
                      {/* Download PDF Button - Show when review is completed */}
                      {selectedTaskForReview?.review?.status === 'approved' && (
                        <button
                          onClick={() => handleDownloadPDF(selectedTaskForReview)}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF Report
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleCancelReview}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitReview}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {reviewData.reviewAction === 'send_to_ho' ? 'Kirim ke HO' : 'Tandai Selesai'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HO Approval Modal */}
          {showHOApprovalModal && selectedTaskForHOApproval && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">HO Approval</h2>
                    <button
                      onClick={handleCancelHOApproval}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-gray-600 mt-1">Task: {selectedTaskForHOApproval.id} - {selectedTaskForHOApproval.title}</p>
                  <p className="text-sm text-gray-500">Teknisi: {selectedTaskForHOApproval.technician}</p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Review Summary */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Review Summary</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">Review Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getReviewStatusColor(selectedTaskForHOApproval.review?.status || 'pending')}`}>
                              {selectedTaskForHOApproval.review?.status === 'approved' ? 'Approved' : 
                               selectedTaskForHOApproval.review?.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                            </span>
                          </div>
                          {selectedTaskForHOApproval.review?.reviewedBy && (
                            <div className="text-sm text-gray-600">
                              Reviewed by: {selectedTaskForHOApproval.review.reviewedBy}
                            </div>
                          )}
                          {selectedTaskForHOApproval.review?.reviewNotes && (
                            <div className="text-sm text-gray-600 mt-2">
                              Notes: {selectedTaskForHOApproval.review.reviewNotes}
                            </div>
                          )}
                        </div>
                        
                        {selectedTaskForHOApproval.review?.componentRecommendations && selectedTaskForHOApproval.review.componentRecommendations.length > 0 && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-medium text-yellow-800 mb-2">Component Recommendations</h4>
                            <div className="space-y-2">
                              {selectedTaskForHOApproval.review.componentRecommendations.map((rec, index) => (
                                <div key={index} className="text-sm">
                                  <div className="font-medium text-yellow-800">{rec.component}</div>
                                  <div className="text-yellow-700">{rec.recommendation}</div>
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                                    {rec.priority} Priority
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* HO Approval Form */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">HO Approval Form</h3>
                      <div className="space-y-4">
                        {/* Approval Status */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Approval Decision</label>
                          <select
                            value={hoApprovalData.approvalStatus}
                            onChange={(e) => setHoApprovalData({...hoApprovalData, approvalStatus: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="pending">Pending Approval</option>
                            <option value="approved">Approve</option>
                            <option value="rejected">Reject</option>
                          </select>
                        </div>

                        {/* Approval Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Approval Notes</label>
                          <textarea
                            rows={3}
                            value={hoApprovalData.approvalNotes}
                            onChange={(e) => setHoApprovalData({...hoApprovalData, approvalNotes: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Masukkan catatan approval..."
                          />
                        </div>

                        {/* Vendor Selection - Only show when approved */}
                        {hoApprovalData.approvalStatus === 'approved' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Vendor</label>
                              <select
                                value={hoApprovalData.selectedVendor}
                                onChange={(e) => setHoApprovalData({...hoApprovalData, selectedVendor: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Pilih Vendor</option>
                                {vendors.map(vendor => (
                                  <option key={vendor} value={vendor}>{vendor}</option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                              <input
                                type="text"
                                value={hoApprovalData.estimatedCost}
                                onChange={(e) => setHoApprovalData({...hoApprovalData, estimatedCost: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Rp 0"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Contact</label>
                              <input
                                type="text"
                                value={hoApprovalData.vendorContact}
                                onChange={(e) => setHoApprovalData({...hoApprovalData, vendorContact: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nomor telepon vendor"
                              />
                            </div>
                          </div>
                        )}

                        {/* Approved By */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Approved By</label>
                          <input
                            type="text"
                            value={hoApprovalData.approvedBy}
                            onChange={(e) => setHoApprovalData({...hoApprovalData, approvedBy: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nama Manager HO"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-4">
                    <button
                      onClick={handleCancelHOApproval}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitHOApproval}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {hoApprovalData.approvalStatus === 'approved' ? 'Approve & Assign Vendor' : 
                       hoApprovalData.approvalStatus === 'rejected' ? 'Reject' : 'Submit Decision'}
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

export default PageTeknisi;
