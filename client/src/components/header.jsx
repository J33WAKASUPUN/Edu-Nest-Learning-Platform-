import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, User, LogOut, Settings, Award, Search, Bell, MessageCircle, Calendar, BarChart3, Users, GraduationCap, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const profileRef = useRef();
  const notificationRef = useRef();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Mock notifications data
  const notifications = [
    { id: 1, title: "New assignment due", message: "JavaScript Fundamentals - Due tomorrow", time: "2h ago", unread: true },
    { id: 2, title: "Course completed", message: "Congratulations on completing React Basics!", time: "1d ago", unread: true },
    { id: 3, title: "New message", message: "Instructor replied to your question", time: "3d ago", unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white w-full relative shadow-lg border-b border-gray-200">
      <div className="flex justify-between items-center h-24 px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EduNestPlatform Pro
            </h1>
            <p className="text-xs text-gray-500 font-medium">Advanced Learning Management System</p>
          </div>
        </Link>

        {/* Search Bar - Desktop Only */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses, instructors, topics..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Navigation */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm relative group px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              <BookOpen className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              to="/subjects"
              className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm relative group px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              <Globe className="w-4 h-4" />
              Subjects
            </Link>
            {user && (
              <>
                <Link
                  to="/my-learning"
                  className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm relative group px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  <BarChart3 className="w-4 h-4" />
                  My Learning
                </Link>
                <Link
                  to="/calender"
                  className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm relative group px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule
                </Link>
                {user.role === 'instructor' && (
                  <Link
                    to="/instructor"
                    className="flex items-center gap-2 text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm relative group px-3 py-2 rounded-lg hover:bg-blue-50"
                  >
                    <Users className="w-4 h-4" />
                    Instructor
                  </Link>
                )}
              </>
            )}
            
            {user ? (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {isNotificationOpen && (
                    <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-xl w-80 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 ${
                              notification.unread ? 'border-blue-500 bg-blue-50' : 'border-transparent'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                              </div>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 px-4 py-2.5 rounded-xl transition-all border border-blue-200"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    aria-label="User menu"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-semibold text-gray-800 block">
                        {user.firstName}
                      </span>
                      <span className="text-xs text-gray-600 capitalize">{user.role}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isProfileOpen && (
                    <div className="absolute right-0 top-14 bg-white border border-gray-200 rounded-xl shadow-xl w-56 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/achievements"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Award className="w-4 h-4" />
                        Achievements
                      </Link>
                      <Link
                        to="/analytics"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <BarChart3 className="w-4 h-4" />
                        Learning Analytics
                      </Link>
                      <hr className="my-2 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors text-sm px-4 py-2 rounded-lg hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Enhanced Mobile Navigation Slider Component
function NavSlider({ closeSlider }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    Navigate("/login");
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeSlider}></div>
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900">EduPlatform Pro</span>
                <p className="text-xs text-gray-500">LMS</p>
              </div>
            </div>
            <button 
              onClick={closeSlider} 
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* User Info */}
          {user && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl mb-6 border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="space-y-2">
            <Link
              to="/"
              onClick={closeSlider}
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/courses"
              onClick={closeSlider}
              className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
            >
              <Globe className="w-5 h-5" />
              Courses
            </Link>
            {user && (
              <>
                <Link
                  to="/my-learning"
                  onClick={closeSlider}
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  My Learning
                </Link>
                <Link
                  to="/calendar"
                  onClick={closeSlider}
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule
                </Link>
                <Link
                  to="/messages"
                  onClick={closeSlider}
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Messages
                </Link>
              </>
            )}
            
            {user ? (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  to="/profile"
                  onClick={closeSlider}
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Profile Settings
                </Link>
                <Link
                  to="/achievements"
                  onClick={closeSlider}
                  className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                >
                  <Award className="w-5 h-5" />
                  Achievements
                </Link>
                   <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button> 
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  to="/login"
                  onClick={closeSlider}
                  className="block py-3 px-4 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeSlider}
                  className="block py-3 px-4 text-center text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
                >
                  Get Started Free
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
