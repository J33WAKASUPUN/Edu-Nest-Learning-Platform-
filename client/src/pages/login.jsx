// src/pages/LoginPage.js
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin() {
    if (!mail || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        { email: mail, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token } = response.data;
      const decoded = jwtDecode(token);

      // Store user info via AuthContext
      login({
        token,
        id: decoded.id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role
      });
      localStorage.setItem("id", decoded.id);

      toast.success('Login successful');
      
      // Navigate based on role
      if (decoded.role === 'admin' || decoded.role === 'teacher') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }



  return (
   <div className="w-full h-screen bg-[url('../loginBg.jpg')] bg-center bg-cover flex items-center justify-center">
      <div className="w-[50%] h-full"></div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[450px] h-[550px] backdrop-blur-md rounded-md shadow-lg flex flex-col justify-center items-center p-6 bg-white/10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-white/80 text-sm">Sign in to your account</p>
          </div>

          {/* Email Input */}
          <div className="w-full mb-3">
            <label className="block text-white/90 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                id="email"
                onChange={(e) => setMail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                value={mail}
                className="w-full h-[45px] pl-10 pr-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none border-2 border-transparent focus:border-white/50 focus:bg-white transition-all duration-200 text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="w-full mb-6">
            <label className="block text-white/90 text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                className="w-full h-[45px] pl-10 pr-10 rounded-lg bg-white/90 backdrop-blur-lg text-gray-800 placeholder-gray-500 outline-none border-2 border-transparent focus:border-white/50 focus:bg-white transition-all duration-200 text-sm"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className={`w-full h-[45px] rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
              isLoading
                ? 'bg-white/20 cursor-not-allowed backdrop-blur-sm'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl cursor-pointer'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Login'
            )}
          </button>

          <div className="mt-4 text-white text-center space-y-1">
            <p className="text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-200 hover:underline">
                Sign Up
              </Link>
            </p>
            <p>
              <Link to="/forgot-password" className="text-blue-200 hover:underline text-sm">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}