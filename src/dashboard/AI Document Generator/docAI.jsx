import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Brain, 
  FileSpreadsheet, 
  Presentation, 
  Settings, 
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Wrench,
  Users,
  Calendar,
  TrendingUp,
  Zap
} from 'lucide-react';

const AIDocumentGenerator = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [reportSettings, setReportSettings] = useState({
    includeCharts: true,
    includeRecommendations: true,
    includeTeamPerformance: true,
    includeEquipmentStatus: true,
    language: 'id',
    format: 'pdf'
  });
  
  const fileInputRef = useRef(null);

  // Mock data untuk demo
  const mockMaintenanceData = {
    equipment: [
      { id: 'EQ001', name: 'Pompa Sentrifugal A', status: 'Operational', lastMaintenance: '2024-01-15', nextMaintenance: '2024-02-15' },
      { id: 'EQ002', name: 'Kompresor B', status: 'Warning', lastMaintenance: '2024-01-10', nextMaintenance: '2024-01-25' },
      { id: 'EQ003', name: 'Motor Listrik C', status: 'Maintenance', lastMaintenance: '2024-01-20', nextMaintenance: '2024-02-20' }
    ],
    workOrders: [
      { id: 'WO001', title: 'Pemeliharaan Rutin Pompa A', status: 'Completed', technician: 'Ahmad S.', duration: '2 jam', priority: 'High' },
      { id: 'WO002', title: 'Ganti Filter Kompresor B', status: 'In Progress', technician: 'Budi R.', duration: '1 jam', priority: 'Medium' },
      { id: 'WO003', title: 'Kalibrasi Motor C', status: 'Pending', technician: 'Citra L.', duration: '3 jam', priority: 'Low' }
    ],
    insights: [
      'Efisiensi peralatan meningkat 15% dibanding bulan lalu',
      'Waktu rata-rata perbaikan berkurang 20%',
      'Rekomendasi: Ganti filter udara pada 3 peralatan',
      'Tim teknisi menunjukkan performa yang konsisten'
    ]
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded'
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulasi proses AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setGeneratedReport({
      id: Date.now(),
      title: 'Laporan Perawatan Bulanan - Januari 2024',
      generatedAt: new Date().toISOString(),
      data: mockMaintenanceData,
      settings: reportSettings
    });
    
    setIsGenerating(false);
    setActiveTab('preview');
  };

  const downloadReport = (format) => {
    // Simulasi download
    const element = document.createElement('a');
    const file = new Blob(['Generated report content'], { type: 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = `maintenance-report-${Date.now()}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const tabs = [
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'export', label: 'Export', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Document Generator</h1>
                <p className="text-gray-600">Buat laporan perawatan profesional secara otomatis dengan AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Powered by AI</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Data CMMS/Log Perawatan</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">Upload file data perawatan</p>
                    <p className="text-gray-600 mb-4">Support: Excel, CSV, JSON, atau file CMMS</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".xlsx,.xls,.csv,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Pilih File
                    </button>
                  </div>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">File Terupload</h4>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <button
                              onClick={() => removeFile(file.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateReport}
                    disabled={uploadedFiles.length === 0 || isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>AI sedang menganalisis data...</span>
                      </>
                    ) : (
                      <>
                        <Brain className="h-5 w-5" />
                        <span>Generate Laporan dengan AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Pengaturan Laporan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Konten Laporan</h4>
                    <div className="space-y-3">
                      {[
                        { key: 'includeCharts', label: 'Sertakan Grafik & Visualisasi', icon: BarChart3 },
                        { key: 'includeRecommendations', label: 'Rekomendasi AI', icon: Brain },
                        { key: 'includeTeamPerformance', label: 'Performa Tim Teknisi', icon: Users },
                        { key: 'includeEquipmentStatus', label: 'Status Peralatan', icon: Wrench }
                      ].map((setting) => {
                        const Icon = setting.icon;
                        return (
                          <label key={setting.key} className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={reportSettings[setting.key]}
                              onChange={(e) => setReportSettings(prev => ({
                                ...prev,
                                [setting.key]: e.target.checked
                              }))}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{setting.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Format & Bahasa</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Format Output</label>
                        <select
                          value={reportSettings.format}
                          onChange={(e) => setReportSettings(prev => ({ ...prev, format: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="pdf">PDF</option>
                          <option value="ppt">PowerPoint</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bahasa</label>
                        <select
                          value={reportSettings.language}
                          onChange={(e) => setReportSettings(prev => ({ ...prev, language: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="id">Indonesia</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && generatedReport && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Preview Laporan</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPreviewMode(!previewMode)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>{previewMode ? 'Edit Mode' : 'Preview Mode'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{generatedReport.title}</h2>
                    <p className="text-gray-600">Dibuat pada: {new Date(generatedReport.generatedAt).toLocaleDateString('id-ID')}</p>
                  </div>

                  {/* Executive Summary */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                      Ringkasan Eksekutif
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">15%</div>
                        <div className="text-sm text-blue-800">Peningkatan Efisiensi</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">20%</div>
                        <div className="text-sm text-green-800">Pengurangan Waktu Perbaikan</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">95%</div>
                        <div className="text-sm text-purple-800">Tingkat Ketersediaan</div>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Status */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Wrench className="h-5 w-5 mr-2 text-orange-600" />
                      Status Peralatan
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance Terakhir</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance Berikutnya</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mockMaintenanceData.equipment.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  item.status === 'Operational' ? 'bg-green-100 text-green-800' :
                                  item.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.lastMaintenance}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.nextMaintenance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Work Orders */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                      Work Orders
                    </h3>
                    <div className="space-y-3">
                      {mockMaintenanceData.workOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`w-3 h-3 rounded-full ${
                                order.status === 'Completed' ? 'bg-green-500' :
                                order.status === 'In Progress' ? 'bg-yellow-500' :
                                'bg-gray-400'
                              }`}></div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{order.title}</p>
                              <p className="text-sm text-gray-600">Teknisi: {order.technician} • Durasi: {order.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              order.priority === 'High' ? 'bg-red-100 text-red-800' :
                              order.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {order.priority}
                            </span>
                            <span className="text-sm text-gray-600">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-purple-600" />
                      AI Insights & Rekomendasi
                    </h3>
                    <div className="space-y-3">
                      {mockMaintenanceData.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                          <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Export Tab */}
            {activeTab === 'export' && generatedReport && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Export Laporan</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <FileText className="h-8 w-8 text-red-600" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">PDF Format</h4>
                        <p className="text-gray-600">Laporan dalam format PDF yang mudah dibagikan</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>• Optimized untuk print dan digital</div>
                      <div>• Include charts dan visualisasi</div>
                      <div>• Professional layout</div>
                    </div>
                    <button
                      onClick={() => downloadReport('pdf')}
                      className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Presentation className="h-8 w-8 text-orange-600" />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">PowerPoint Format</h4>
                        <p className="text-gray-600">Presentasi yang siap untuk meeting</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div>• Slide-by-slide presentation</div>
                      <div>• Interactive charts</div>
                      <div>• Meeting-ready format</div>
                    </div>
                    <button
                      onClick={() => downloadReport('ppt')}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PPT</span>
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900">Tips Export</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        File akan otomatis terdownload setelah proses selesai. Pastikan browser Anda mengizinkan download file.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Laporan Dibuat</p>
                <p className="text-lg font-semibold text-gray-900">24</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Waktu Tersimpan</p>
                <p className="text-lg font-semibold text-gray-900">48 jam</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">AI Insights</p>
                <p className="text-lg font-semibold text-gray-900">156</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tim Aktif</p>
                <p className="text-lg font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDocumentGenerator;
