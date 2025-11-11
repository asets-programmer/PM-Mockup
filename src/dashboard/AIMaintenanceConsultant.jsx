import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  NavbarButton 
} from '../components/ui/resizable-navbar';
import { Camera, Upload, Loader2, ArrowLeft, AlertCircle, Wrench, TrendingUp, Clock, AlertTriangle, CheckCircle2, Tag, Video } from 'lucide-react';

const AIMaintenanceConsultant = () => {
  const navigate = useNavigate();
  const { language, content } = useLanguage();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // API Configuration - Ganti dengan URL API yang sudah dibuat
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }, []);

  // Function to show notification
  const showNotification = (result) => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      const machine = result.machine?.[0];
      const summary = result.summary;
      const brandDetection = result.brandDetection;

      // Determine status emoji and title
      let statusEmoji = '✅';
      let statusText = 'Normal';
      if (summary?.overall_status?.toLowerCase() === 'warning') {
        statusEmoji = '⚠️';
        statusText = 'Warning';
      } else if (summary?.overall_status?.toLowerCase() === 'critical') {
        statusEmoji = '🚨';
        statusText = 'Critical';
      }

      // Build notification body with key information
      let body = `${statusEmoji} Status: ${statusText}`;
      
      if (machine?.name) {
        body += `\nMesin: ${machine.name}`;
      }
      
      if (brandDetection?.detected) {
        body += `\nMerk: ${brandDetection.brand} (${Math.round(brandDetection.confidence * 100)}%)`;
      }
      
      if (summary?.confidence) {
        body += `\nTingkat Kepercayaan: ${Math.round(summary.confidence * 100)}%`;
      }

      if (summary?.next_action) {
        body += `\n\nTindakan: ${summary.next_action}`;
      }

      // Show notification
      const notification = new Notification('Analisis Mesin Selesai', {
        body: body,
        icon: '/favicon.ico', // You can add a custom icon
        badge: '/favicon.ico',
        tag: 'machine-analysis', // Replace previous notification with same tag
        requireInteraction: false, // Auto-close after a few seconds
        silent: false, // Play notification sound
      });

      // Optional: Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close after 10 seconds
      setTimeout(() => {
        notification.close();
      }, 10000);
    } else if (Notification.permission !== 'denied') {
      // Request permission if not yet asked
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification(result);
        }
      });
    }
  };

  // Compress image to reduce size before sending to API
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 192;
          const MAX_HEIGHT = 192;
          
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to JPEG with low quality for smaller size
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3);
          resolve(compressedBase64);
        };
        img.onerror = reject;
        img.src = event.target?.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzeImage = async (base64Image) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      // Extract base64 data (remove data:image/...;base64, prefix if present)
      const imageBase64 = base64Image.includes(',') 
        ? base64Image.split(',')[1] 
        : base64Image;

      const response = await fetch(`${API_URL}/analyze-machine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: `data:image/jpeg;base64,${imageBase64}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze image');
      }

      const result = await response.json();
      console.log('API Response:', result);
      console.log('Brand Detection:', result.brandDetection);
      setAnalysisResult(result);
      
      // Show notification after analysis is complete
      showNotification(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Harap pilih file gambar yang valid');
      return;
    }

    try {
      // Compress image before sending
      const compressedBase64 = await compressImage(file);
      setSelectedImage(compressedBase64);
      await analyzeImage(compressedBase64);
    } catch (err) {
      console.error('Error compressing image:', err);
      setError('Gagal memproses gambar. Silakan coba lagi.');
    }
  };

  const resetAnalysis = () => {
    setAnalysisResult(null);
    setSelectedImage(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const getConditionColor = (condition) => {
    const lowerCondition = condition?.toLowerCase();
    if (lowerCondition === 'normal') return 'text-green-600 bg-green-50 border-green-200';
    if (lowerCondition === 'warning') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (lowerCondition === 'critical') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getConditionIcon = (condition) => {
    const lowerCondition = condition?.toLowerCase();
    if (lowerCondition === 'normal') return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (lowerCondition === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    if (lowerCondition === 'critical') return <AlertCircle className="h-5 w-5 text-red-600" />;
    return <AlertCircle className="h-5 w-5 text-gray-600" />;
  };

  // Navigation items for NavItems component
  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Products', link: '/#products' },
    { name: 'Solutions', link: '/#solutions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar>
        <NavBody>
          <a href="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black">
            <img src="/assets/Stori.jpg" alt="STORI" className="h-8" />
            <span className="font-medium text-black">STORI</span>
          </a>
          <NavItems items={navItems} />
          <NavbarButton onClick={() => navigate('/login')}>
            Login
          </NavbarButton>
        </NavBody>
      </Navbar>
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Kembali ke Beranda</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            AI Maintenance Consultant
          </h1>
          <p className="text-gray-600">
            Analisis kondisi mesin secara instan dengan teknologi AI
          </p>
        </div>

        {/* Upload Section */}
        {!analysisResult && !isAnalyzing && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                Upload atau Ambil Foto Mesin
              </h2>
              <p className="text-gray-600 text-center mb-8">
                Pilih gambar mesin untuk mendapatkan analisis kondisi dan rekomendasi perawatan
              </p>

              {selectedImage && (
                <div className="mb-6 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={selectedImage}
                    alt="Selected machine"
                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  />
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-auto py-6 flex flex-col items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  <Camera className="h-8 w-8" />
                  <span className="text-base font-semibold">Ambil Foto</span>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-auto py-6 flex flex-col items-center gap-3 bg-white border-2 border-gray-300 hover:border-indigo-500 text-gray-700 rounded-lg transition-colors"
                >
                  <Upload className="h-8 w-8" />
                  <span className="text-base font-semibold">Upload Gambar</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </button>
              </div>

              {/* Camera Brand Detection Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate('/camera-brand-detection')}
                  className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <Video className="h-8 w-8" />
                  <span className="text-base font-semibold">Deteksi Merk dari Kamera (Real-time)</span>
                  <span className="text-xs opacity-90">Deteksi merk dispenser secara real-time dari kamera</span>
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500 text-center">
                Format yang didukung: JPG, PNG, WEBP
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200">
              {selectedImage && (
                <div className="mb-8 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={selectedImage}
                    alt="Analyzing machine"
                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  />
                </div>
              )}
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Menganalisis Gambar...</h3>
                  <p className="text-gray-600">
                    AI sedang memproses dan mendiagnosis kondisi mesin Anda
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {analysisResult && !isAnalyzing && (
          <div className="space-y-6">
            {selectedImage && (
              <div className="max-w-2xl mx-auto">
                <div className="rounded-lg overflow-hidden border-2 border-gray-200 bg-white">
                  <img
                    src={selectedImage}
                    alt="Analyzed machine"
                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Brand Detection Card - Always show if analysisResult exists */}
            <div className="max-w-4xl mx-auto">
              <div className={`rounded-xl shadow-lg p-6 border-2 ${
                analysisResult.brandDetection?.detected 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    analysisResult.brandDetection?.detected ? 'bg-indigo-100' : 'bg-gray-100'
                  }`}>
                    <Tag className={`h-6 w-6 ${
                      analysisResult.brandDetection?.detected ? 'text-indigo-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Deteksi Merk Dispenser</h2>
                </div>
                
                {analysisResult.brandDetection?.detected ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="text-sm text-gray-600 mb-1">Merk Terdeteksi</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {analysisResult.brandDetection.brand}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Label: {analysisResult.brandDetection.label}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <div className="text-sm text-gray-600 mb-1">Tingkat Kepercayaan</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {Math.round(analysisResult.brandDetection.confidence * 100)}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${analysisResult.brandDetection.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-semibold">Brand Detection Tidak Tersedia</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {analysisResult.brandDetection?.note || 'Brand detection service tidak tersedia. Pastikan @tensorflow/tfjs dan canvas sudah terinstall di API server (engine-insight-quick) dan API server berjalan dengan benar.'}
                        </p>
                        {!analysisResult.brandDetection && (
                          <p className="text-xs text-gray-400 mt-2">
                            Debug: brandDetection tidak ada di response API. Cek console untuk detail.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Card */}
            <div className="max-w-4xl mx-auto">
              <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                analysisResult.summary?.overall_status?.toLowerCase() === 'normal' ? 'border-green-500' :
                analysisResult.summary?.overall_status?.toLowerCase() === 'warning' ? 'border-yellow-500' :
                'border-red-500'
              }`}>
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-3">Ringkasan Analisis</h2>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Status Keseluruhan:</span>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getConditionColor(analysisResult.summary?.overall_status)}`}>
                          {getConditionIcon(analysisResult.summary?.overall_status)}
                          <span className="capitalize">{analysisResult.summary?.overall_status || 'Normal'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-indigo-600" />
                        <span className="text-gray-600">Tindakan Selanjutnya:</span>
                        <span className="font-medium">{analysisResult.summary?.next_action || 'Lanjutkan monitoring'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">Tingkat Kepercayaan:</span>
                        <span className="font-semibold text-indigo-600">
                          {Math.round((analysisResult.summary?.confidence || 0.8) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Machine Cards */}
            {analysisResult.machine && analysisResult.machine.length > 0 && (
              <div className="max-w-4xl mx-auto space-y-4">
                {analysisResult.machine.map((machine, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
                      machine.condition?.toLowerCase() === 'normal' ? 'border-green-500' :
                      machine.condition?.toLowerCase() === 'warning' ? 'border-yellow-500' :
                      'border-red-500'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{machine.name || 'Komponen Mesin'}</h3>
                        {machine.brand && (
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm text-gray-600">Merk:</span>
                            <span className="text-sm font-semibold text-indigo-600">{machine.brand}</span>
                            {machine.brand_confidence && (
                              <span className="text-xs text-gray-500">
                                ({Math.round(machine.brand_confidence * 100)}% confidence)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getConditionColor(machine.condition)}`}>
                        {getConditionIcon(machine.condition)}
                        <span className="capitalize">{machine.condition || 'Normal'}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {machine.issue_detected && machine.issue_detected !== 'None' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <span>Masalah Terdeteksi</span>
                          </div>
                          <p className="text-sm text-gray-700 pl-6">{machine.issue_detected}</p>
                        </div>
                      )}

                      {machine.predicted_failure && machine.predicted_failure !== 'None' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span>Prediksi Kerusakan</span>
                          </div>
                          <p className="text-sm text-gray-700 pl-6">{machine.predicted_failure}</p>
                        </div>
                      )}

                      {machine.estimated_days_left > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Clock className="h-4 w-4 text-indigo-600" />
                            <span>Estimasi Waktu Tersisa</span>
                          </div>
                          <p className="text-sm text-gray-700 pl-6">
                            {machine.estimated_days_left} hari sebelum perlu tindakan
                          </p>
                        </div>
                      )}

                      {machine.recommendation && machine.recommendation !== 'None' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Wrench className="h-4 w-4 text-green-600" />
                            <span>Rekomendasi</span>
                          </div>
                          <p className="text-sm bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                            {machine.recommendation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reset Button */}
            <div className="flex justify-center">
              <button
                onClick={resetAnalysis}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold"
              >
                <ArrowLeft className="h-5 w-5" />
                Analisis Gambar Lain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIMaintenanceConsultant;

