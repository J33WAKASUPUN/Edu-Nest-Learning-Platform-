import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleRegister() {
    // Input validation
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/users/register',
        {
          email,
          firstName,
          lastName,
          password,
        },
        {
          headers: {
            // Explicitly ensure no Authorization header is sent for registration
            Authorization: undefined,
          },
        }
      );
      console.log(response.data);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.log(error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      if (errorMessage.includes("User already exists")) {
        toast.error("Email already registered. Please log in.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
   <div className="w-full h-screen bg-[url('loginBg.jpg')] bg-center bg-cover flex items-center justify-center">
      <div className="w-[50%] h-full"></div>

      <div className="w-[50%] h-full flex justify-center items-center">
        <div className="w-[450px] h-[650px] backdrop-blur-md rounded-md shadow-lg flex flex-col justify-center items-center p-7 bg-white/10">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-white/80 text-sm">Join our learning platform</p>
          </div>

          {/* First Name Input */}
          <div className="w-full mb-3">
            <label className="block text-white/90 text-sm font-medium mb-1" htmlFor="firstName">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                id="firstName"
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-[45px] pl-10 pr-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none border-2 border-transparent focus:border-white/50 focus:bg-white transition-all duration-200 text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Last Name Input */}
          <div className="w-full mb-3">
            <label className="block text-white/90 text-sm font-medium mb-1" htmlFor="lastName">
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-[45px] pl-10 pr-3 rounded-lg bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none border-2 border-transparent focus:border-white/50 focus:bg-white transition-all duration-200 text-sm"
                disabled={isLoading}
              />
            </div>
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
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Register Button */}
          <button
            onClick={handleRegister}
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
                <span>Creating Account...</span>
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          <div className="mt-4 text-white text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-200 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}