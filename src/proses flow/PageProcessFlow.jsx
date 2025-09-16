import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  FileText,
  Activity,
  Users,
  Settings,
  ArrowRight,
  ArrowDown,
  Eye,
  Edit
} from 'lucide-react';
import Navbar from '../komponen/Navbar';
import Sidebar from '../komponen/Sidebar';

const PageProcessFlow = () => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Data proses flow preventive maintenance
  const processSteps = [
    {
      id: 1,
      title: 'Maintenance Schedule',
      description: 'Jadwal maintenance rutin berdasarkan interval running hours',
      icon: Activity,
      color: 'bg-blue-500',
      status: 'active',
      details: {
        triggers: [
          'Jadwal PM rutin (berdasarkan running hours)',
          'Manual inspection findings',
          'Equipment breakdown report',
          'Preventive maintenance calendar'
        ],
        systems: [
          'Maintenance Scheduler',
          'Running Hours Tracker',
          'Equipment Database',
          'Calendar System'
        ],
        outputs: [
          'Maintenance notification',
          'Work order request',
          'Priority assignment',
          'Equipment identification'
        ]
      },
      workOrders: [
        { id: 'WO-2025-001', title: 'Genset A PM Due (500 hours)', status: 'Open', priority: 'High' },
        { id: 'WO-2025-002', title: 'Panel Listrik PM Due (2000 hours)', status: 'Open', priority: 'Medium' }
      ]
    },
    {
      id: 2,
      title: 'Work Order Creation',
      description: 'Admin membuat work order berdasarkan jadwal maintenance',
      icon: FileText,
      color: 'bg-yellow-500',
      status: 'pending',
      details: {
        triggers: [
          'Jadwal PM dari step 1',
          'Manual inspection findings',
          'Request dari supervisor',
          'Emergency breakdown'
        ],
        systems: [
          'Work Order Management',
          'Maintenance Database',
          'Approval Workflow',
          'Notification System'
        ],
        outputs: [
          'Work order document',
          'Maintenance checklist',
          'Technician assignment',
          'Scheduled date/time'
        ]
      },
      workOrders: [
        { id: 'WO-2025-003', title: 'CCTV Maintenance (1000 hours)', status: 'Created', priority: 'Low' },
        { id: 'WO-2025-004', title: 'Dispenser A Repair', status: 'Created', priority: 'High' }
      ]
    },
    {
      id: 3,
      title: 'Preparation & Planning',
      description: 'Persiapan spare part, tools, dan jadwal teknisi',
      icon: Settings,
      color: 'bg-orange-500',
      status: 'pending',
      details: {
        triggers: [
          'Work order approved',
          'Spare part inventory check',
          'Technician availability',
          'Site access preparation'
        ],
        systems: [
          'Inventory Management',
          'Technician Scheduler',
          'Purchase System',
          'Site Access Control'
        ],
        outputs: [
          'Spare part availability',
          'Technician assignment',
          'Tools preparation',
          'Site access approval'
        ]
      },
      workOrders: [
        { id: 'WO-2025-005', title: 'ATG Calibration (750 hours)', status: 'Preparation', priority: 'Medium' }
      ]
    },
    {
      id: 4,
      title: 'Execution',
      description: 'Teknisi melaksanakan maintenance sesuai checklist manual',
      icon: Wrench,
      color: 'bg-green-500',
      status: 'pending',
      details: {
        triggers: [
          'All components ready',
          'Technician assigned',
          'Site access approved',
          'Safety briefing completed'
        ],
        systems: [
          'Manual Checklist',
          'Paper Documentation',
          'Photo Documentation',
          'Equipment Testing'
        ],
        outputs: [
          'Completed checklist',
          'Photo documentation',
          'Test results',
          'Technician report'
        ]
      },
      workOrders: [
        { id: 'WO-2025-006', title: 'Computer System Update (250 hours)', status: 'In Progress', priority: 'Low' }
      ]
    },
    {
      id: 5,
      title: 'Verification & Close',
      description: 'Supervisor memverifikasi hasil dan menutup work order',
      icon: CheckCircle,
      color: 'bg-purple-500',
      status: 'pending',
      details: {
        triggers: [
          'Work completed',
          'Quality check passed',
          'Documentation complete',
          'Equipment tested'
        ],
        systems: [
          'Quality Management',
          'Approval Workflow',
          'Documentation System',
          'Performance Tracking'
        ],
        outputs: [
          'Closed work order',
          'Performance metrics',
          'Lessons learned',
          'Next maintenance schedule'
        ]
      },
      workOrders: [
        { id: 'WO-2025-007', title: 'Genset B PM (500 hours)', status: 'Completed', priority: 'Medium' }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Play className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'border-green-500 bg-green-50';
      case 'pending': return 'border-yellow-500 bg-yellow-50';
      case 'completed': return 'border-green-500 bg-green-50';
      case 'error': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWorkOrderStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'text-blue-600 bg-blue-100';
      case 'Created': return 'text-yellow-600 bg-yellow-100';
      case 'Preparation': return 'text-orange-600 bg-orange-100';
      case 'In Progress': return 'text-green-600 bg-green-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStepClick = (step) => {
    setSelectedStep(step);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Simulasi animasi step
    if (!isPlaying) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= processSteps.length) {
            clearInterval(interval);
            setIsPlaying(false);
            return 1;
          }
          return prev + 1;
        });
      }, 2000);
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setIsPlaying(false);
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
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Process Flow</h1>
            <p className="text-gray-600">Alur kerja preventive maintenance interaktif</p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayPause}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'} Flow
                </button>
                <button
                  onClick={resetFlow}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Step {currentStep} of {processSteps.length}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / processSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Process Flow Diagram */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Preventive Maintenance Process Flow</h2>
            
            {/* Desktop Flow - Horizontal */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between">
                {processSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <React.Fragment key={step.id}>
                      <div 
                        className={`flex flex-col items-center p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          isActive ? 'border-blue-500 bg-blue-50 scale-105' :
                          isCompleted ? 'border-green-500 bg-green-50' :
                          'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                        onClick={() => handleStepClick(step)}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${step.color} ${
                          isActive ? 'animate-pulse' : ''
                        }`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                        <p className="text-sm text-gray-600 text-center mb-4">{step.description}</p>
                        <div className="flex items-center">
                          {getStatusIcon(step.status)}
                          <span className="ml-2 text-sm font-medium text-gray-600">{step.status}</span>
                        </div>
                      </div>
                      
                      {index < processSteps.length - 1 && (
                        <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Mobile Flow - Vertical */}
            <div className="lg:hidden">
              <div className="space-y-6">
                {processSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <React.Fragment key={step.id}>
                      <div 
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                          isActive ? 'border-blue-500 bg-blue-50' :
                          isCompleted ? 'border-green-500 bg-green-50' :
                          'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                        onClick={() => handleStepClick(step)}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${step.color} ${
                          isActive ? 'animate-pulse' : ''
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{step.title}</h3>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className="flex items-center">
                          {getStatusIcon(step.status)}
                        </div>
                      </div>
                      
                      {index < processSteps.length - 1 && (
                        <div className="flex justify-center">
                          <ArrowDown className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step Details Modal */}
          {selectedStep && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${selectedStep.color}`}>
                        <selectedStep.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{selectedStep.title}</h2>
                        <p className="text-gray-600">{selectedStep.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStep(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Process Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Process Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Triggers</h4>
                          <ul className="space-y-1">
                            {selectedStep.details.triggers.map((trigger, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                {trigger}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Systems Involved</h4>
                          <ul className="space-y-1">
                            {selectedStep.details.systems.map((system, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                {system}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Outputs</h4>
                          <ul className="space-y-1">
                            {selectedStep.details.outputs.map((output, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                {output}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Work Orders */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Work Orders</h3>
                      
                      <div className="space-y-3">
                        {selectedStep.workOrders.map((wo) => (
                          <div key={wo.id} className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{wo.id}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getWorkOrderStatusColor(wo.status)}`}>
                                {wo.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{wo.title}</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(wo.priority)}`}>
                                {wo.priority}
                              </span>
                              <button className="text-blue-600 text-sm hover:underline">
                                View Details
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex space-x-4">
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        View Work Orders
                      </button>
                      <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Process
                      </button>
                      <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Activity className="w-4 h-4 mr-2" />
                        Start Process
                      </button>
                    </div>
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

export default PageProcessFlow;
