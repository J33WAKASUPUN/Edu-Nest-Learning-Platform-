"use client"

import { Link, Route, Routes, useNavigate } from "react-router-dom"
import {
  BsGraphUp,
  BsPersonCheck,
  BsPeopleFill,
  BsPersonFill,
  BsClock,
  BsJournalText,
  BsPower,
  BsShieldCheck,
  BsBellFill,
} from "react-icons/bs"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"
import TeachersPage from "./admin/teachers/teachersPage"
import UsersPage from "./admin/users/UsersPage"
import Admin from "./admin/admis/admin"
import Sessions from "./admin/sessions/sessions"
import Notes from "./admin/notes/notes"
import AdminDashboard from "./admin/dashboard"
import TeacherDashboard from "./admin/TeacherDashboard"
import EnrollmentApprovals from "./admin/EnrollmentApproval"

export default function AdminHomePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newEnrollmentsCount, setNewEnrollmentsCount] = useState(0)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("role")

  useEffect(() => {
    if (!token || (userRole !== "admin" && userRole !== "teacher")) {
      toast.error("Unauthorized access")
      navigate("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setUser(response.data)
      } catch (err) {
        console.error("Fetch user error:", err)
        toast.error("Failed to fetch user data")
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
    fetchEnrollmentsCount()
    
    // Set up polling for new enrollments every 10 seconds
    const interval = setInterval(fetchEnrollmentsCount, 10000)
    return () => clearInterval(interval)
  }, [navigate, token, userRole])
  

  
  const fetchEnrollmentsCount = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/enrollments/pending-count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Pending count response:', response.data);
    setNewEnrollmentsCount(response.data.count);
  } catch (error) {
    console.error("Error fetching enrollments count:", error);
  }
};

 const clearNotifications = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/enrollments/clear-notifications`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewEnrollmentsCount(0); // Clear frontend state
  } catch (error) {
    console.error("Error clearing notifications:", error);
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    toast.success("Logged out successfully")
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-400"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-800 via-purple-950 to-blue-900 text-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-900 to-blue-900">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
              <BsShieldCheck className="text-xl text-purple-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {userRole === "admin" ? "Admin Panel" : "Teacher Panel"}
              </h2>
            </div>
          </div>
          <p className="text-sm text-purple-200 opacity-90">Manage your platform</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            to="/admin/dashboard"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl hover:bg-white hover:text-green-300 hover:bg-opacity-10 transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-purple-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
              <BsGraphUp className="text-lg hover:text-white" />
            </div>
            <span>Dashboard</span>
          </Link>

          {userRole === "admin" && (
            <>
              <Link
                to="/admin/teachers/teachers"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-xl hover:bg-white hover:text-green-300 hover:bg-opacity-10 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-blue-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
                  <BsPersonCheck className="text-lg hover:text-white" />
                </div>
                <span>Teachers</span>
              </Link>
              <Link
                to="/admin/users/users"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-xl hover:bg-white hover:text-green-300 hover:bg-opacity-10 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-purple-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
                  <BsPersonFill className="text-lg hover:text-white" />
                </div>
                <span>Users</span>
              </Link>
              <Link
                to="/admin/admins/admins"
                className="flex items-center px-4 py-3 text-sm font-medium rounded-xl hover:bg-white hover:text-green-300 hover:bg-opacity-10 transition-all duration-300 group"
              >
                <div className="w-8 h-8 bg-indigo-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
                  <BsPeopleFill className="text-lg hover:text-white" />
                </div>
                <span>Admins</span>
              </Link>
             <Link
                to="/admin/enrollments-approval"
                onClick={clearNotifications}
                className={`flex items-center relative px-4 py-3 text-sm font-medium rounded-xl hover:bg-white hover:text-green-300 hover:bg-opacity-10 transition-all duration-300 ${
                  location.pathname === "/admin/enrollments-approval" ? "bg-white bg-opacity-10 text-green-300" : ""
                }`}
              >
                <div className="w-8 h-8 bg-purple-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
                  <BsBellFill className="text-lg" />
                </div>
                <span>Enrollment Approval</span>
                {location.pathname !== "/admin/enrollments-approval" && newEnrollmentsCount > 0 && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                    {newEnrollmentsCount}
                  </span>
                )}
              </Link>
            </>
          )}

          <Link
            to="/admin/sessions/sessions"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl hover:bg-white hover:text-green-300 hover:bg-opacity-10 transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-blue-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
              <BsClock className="text-lg hover:text-white" />
            </div>
            <span>Sessions</span>
          </Link>
          <Link
            to="/admin/notes/notes"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl hover:bg-white hover:text-blue-300 hover:bg-opacity-10 transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-purple-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
              <BsJournalText className="text-lg hover:text-white" />
            </div>
            <span>Notes</span>
          </Link>
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-white border-opacity-20">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium cursor-pointer text-white hover:bg-red-500 hover:bg-opacity-20 rounded-xl transition-all duration-300 group"
          >
            <div className="w-8 h-8 bg-red-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
              <BsPower className="text-lg" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <div className="bg-white shadow-lg border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome, {user ? user.firstName || user.username : "User"}
          </h1>
          <div className="flex items-center space-x-4">
           <Link
                to="/admin/enrollments-approval"
                onClick={clearNotifications}
                className={`flex items-center relative px-4 py-3 text-sm font-medium rounded-xl hover:bg-white hover:text-gray-600 hover:bg-opacity-10 transition-all duration-300 ${
                  location.pathname === "/admin/enrollments-approval" ? "bg-white bg-opacity-10 text-black-400 " : ""
                }`}
              >
                <div className="w-8 h-8 bg-amber-600 bg-opacity-50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-opacity-70 transition-all duration-300">
                  <BsBellFill className="text-lg hover:text-red-600" />
                </div>
                <span>Enrollment Approval</span>
                {location.pathname !== "/admin/enrollments-approval" && newEnrollmentsCount > 0 && (
                  <span className="absolute top-0 right-1 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full animate-bounce">
                    {newEnrollmentsCount}
                  </span>
                )}
              </Link>
            
            <div className="flex items-center bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-xl">
              <span className="text-sm font-medium text-gray-700 mr-3">
                {user ? `${user.firstName} ${user.lastName}` || user.username : "Loading..."}
              </span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                {user ? (user.firstName?.charAt(0) || user.username?.charAt(0) || "A").toUpperCase() : "A"}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-purple-50 overflow-y-auto">
          <Routes>
            <Route index element={userRole === "admin" ? <AdminDashboard /> : <TeacherDashboard />} />
            <Route path="dashboard" element={userRole === "admin" ? <AdminDashboard /> : <TeacherDashboard />} />
            {userRole === "admin" && (
              <>
                <Route path="teachers/teachers" element={<TeachersPage />} />
                <Route path="users/users" element={<UsersPage />} />
                <Route path="admins/admins" element={<Admin />} />
                <Route path="enrollments-approval" element={<EnrollmentApprovals />} />
              </>
            )}
            <Route path="sessions/sessions" element={<Sessions />} />
            <Route path="notes/notes" element={<Notes />} />

            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-full">
                  <h1 className="text-3xl font-bold text-gray-600">404 - Page Not Found</h1>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  )
}