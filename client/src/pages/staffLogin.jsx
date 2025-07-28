
// src/pages/StaffLoginPage.js
import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

 async function handleStaffLogin(e) {
  e.preventDefault();

  if (!email || !password) {
    toast.error('Please enter both email and password', {
      position: 'top-right',
      autoClose: 3000,
    });
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const { token } = response.data;
    const decoded = jwtDecode(token);

    // Verify the user is a teacher
    if (decoded.role !== 'teacher') {
      toast.error('Only teachers are authorized to access this portal', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    // Store user info via AuthContext
    login({
      token,
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
    });
    localStorage.setItem('id', decoded.id);

    // Show success toast and delay navigation
    toast.success('Login successful', {
      position: 'top-right',
      autoClose: 2000,
    });

    // Delay navigation to allow toast to be visible
    setTimeout(() => {
      navigate('/admin');
    }, 2000); // Match the toast autoClose duration

  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    toast.error(message, {
      position: 'top-right',
      autoClose: 3000,
    });
  } finally {
    setIsLoading(false);
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('../loginBg.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/40"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Teacher Portal</h1>
              <p className="text-gray-400 text-sm">Access your educational dashboard</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleStaffLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="email">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="teacher@institution.edu"
                    value={email}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white placeholder-gray-400 outline-none border border-gray-600/50 focus:border-blue-500/50 focus:bg-gray-700/70 transition-all duration-300 text-sm"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    className="w-full h-12 pl-12 pr-12 rounded-xl bg-gray-700/50 backdrop-blur-sm text-white placeholder-gray-400 outline-none border border-gray-600/50 focus:border-blue-500/50 focus:bg-gray-700/70 transition-all duration-300 text-sm"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className={`w-full h-12 rounded-xl cursor-pointer text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] ${
                  isLoading
                    ? 'bg-gray-600/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In to Portal'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-3">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <p className="text-gray-400 text-sm">
                Not a teacher?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Student Login
                </Link>
              </p>
              <p>
                <Link to="/forgot-password" className="text-gray-400 hover:text-gray-300 transition-colors text-sm">
                  Forgot your password?
                </Link>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              Secure teacher authentication portal
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer 
        theme="dark"
        toastStyle={{
          backgroundColor: '#1f2937',
          color: '#f9fafb',
          border: '1px solid #374151'
        }}
      />
    </div>
  );
}
