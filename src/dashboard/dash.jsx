import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, MessageSquare } from 'lucide-react';
import storiLogo from '/assets/Stori.jpg';

export default function PropertyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={storiLogo} 
                alt="Stori Logo" 
                className="w-12 h-12 rounded-lg object-cover"
              />
              <span className="ml-3 text-2xl font-bold text-gray-900">STORI</span>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                Produk & Layanan <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                Solusi <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <button className="flex items-center text-gray-700 hover:text-gray-900">
                Resources <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <button className="text-gray-700 hover:text-gray-900">
                Harga
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <span className="mr-1">🌐</span> ID <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-700 hover:text-gray-900"
              >
                Login
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700">
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp kami
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Property Management Software<br />Built for <span className="text-white">Speed</span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
            DoorLoop is the smart choice for property managers & landlords serious about rental growth.<br />
            Save time, boost profits, and eliminate headaches.
          </p>

          {/* Email Input */}
          <div className="max-w-2xl mx-auto flex mb-12">
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 px-6 py-4 rounded-l-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-green-400 text-white px-8 py-4 rounded-r-lg font-semibold hover:bg-green-500">
              See It In Action
            </button>
          </div>

          {/* Rating Badges */}
          <div className="flex justify-center items-center space-x-8 mb-16">
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <div className="text-white font-semibold mb-1">Software Advice</div>
              <div className="text-indigo-200 text-sm">4.8 Star Rating</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <div className="text-white font-semibold mb-1">Capterra</div>
              <div className="text-indigo-200 text-sm">4.8 Star Rating</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <div className="text-white font-semibold mb-1">GetApp</div>
              <div className="text-indigo-200 text-sm">4.8 Star Rating</div>
            </div>
            <div className="text-center">
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <div className="text-white font-semibold mb-1">G2 CROWD</div>
              <div className="text-indigo-200 text-sm">4.8 Star Rating</div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gray-100 p-8 flex items-center justify-center" style={{minHeight: '600px'}}>
                        <div className="text-center">
                  <div className="text-gray-400 text-2xl mb-4">📊</div>
                  <p className="text-gray-500 text-lg">Dashboard Preview</p>
                  <p className="text-gray-400 text-sm mt-2">PNG Image akan ditampilkan di sini</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* As seen on */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-center text-gray-500 mb-8">As seen on</h3>
          <div className="flex justify-center items-center space-x-12 opacity-60">
            <div className="text-2xl font-bold">NBC</div>
            <div className="text-2xl font-bold text-green-600">TechCrunch</div>
            <div className="text-2xl font-bold">INSIDER</div>
            <div className="text-2xl font-bold">Forbes</div>
            <div className="text-2xl font-bold">CBS</div>
            <div className="text-2xl font-bold text-red-600">TheRealDeal</div>
          </div>
        </div>
      </div>
    </div>
  );
}