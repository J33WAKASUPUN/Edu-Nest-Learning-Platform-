
"use client"
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BsPeopleFill, BsBoxSeam, BsJournalText, BsClockHistory } from 'react-icons/bs';
import { ArrowLeft, Lock, Award, Users, GraduationCap } from "lucide-react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([
    { title: 'Total Users', value: 0, icon: <BsPeopleFill className="text-3xl text-blue-500" />, color: 'from-blue-100 to-blue-50', trend: '+0%' },
    { title: 'Total Teachers', value: 0, icon: <BsBoxSeam className="text-3xl text-green-500" />, color: 'from-green-100 to-green-50', trend: '+0%' },
    { title: 'Total Sessions', value: 0, icon: <BsClockHistory className="text-3xl text-blue-600" />, color: 'from-blue-50 to-blue-100', trend: '+0%' },
    { title: 'Total Notes', value: 0, icon: <BsJournalText className="text-3xl text-green-600" />, color: 'from-green-50 to-green-100', trend: '+0%' },
  ]);

  const recentActivity = [
    { id: 1, action: 'User "John Doe" added', time: '2 hours ago' },
    { id: 2, action: 'Teacher "Jane Smith" updated', time: '4 hours ago' },
    { id: 3, action: 'Session "Math 101" created', time: '1 day ago' },
    { id: 4, action: 'Note "Physics Lecture" deleted', time: '2 days ago' },
  ];

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Registrations',
        data: [200, 350, 500, 700, 900, 1250],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const sessionActivityData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Sessions Conducted',
        data: [80, 120, 150, 100],
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 12, family: 'Inter, sans-serif' }, color: '#1f2937' },
      },
      tooltip: { backgroundColor: '#ffffff', titleColor: '#1f2937', bodyColor: '#1f2937', borderColor: '#e5e7eb', borderWidth: 1 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#1f2937' } },
      y: { grid: { color: '#e5e7eb' }, ticks: { color: '#1f2937' } },
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setIsLoggedIn(true);
        setUserRole(userData.role);
        if (userData.role === "admin") {
          fetchDashboardData(token);
        }
      } catch (error) {
        console.error("Error parsing token:", error);
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }
    }
    setLoading(false);
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [usersResponse, sessionsResponse, notesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sessions`, { headers }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes`, { headers }),
      ]);

      const users = usersResponse.data;
      const totalUsers = users.length;
      const totalTeachers = users.filter(user => user.role === "teacher").length;
      const totalSessions = sessionsResponse.data.length;
      const totalNotes = notesResponse.data.length;

      setSummaryData([
        { title: 'Total Users', value: totalUsers, icon: <BsPeopleFill className="text-3xl text-blue-500" />, color: 'from-blue-100 to-blue-50', trend: '+0%' },
        { title: 'Total Teachers', value: totalTeachers, icon: <BsBoxSeam className="text-3xl text-green-500" />, color: 'from-green-100 to-green-50', trend: '+0%' },
        { title: 'Total Sessions', value: totalSessions, icon: <BsClockHistory className="text-3xl text-blue-600" />, color: 'from-blue-50 to-blue-100', trend: '+0%' },
        { title: 'Total Notes', value: totalNotes, icon: <BsJournalText className="text-3xl text-green-600" />, color: 'from-green-50 to-green-100', trend: '+0%' },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        closeButton: (
          <button className="px-4 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200">
            OK
          </button>
        ),
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || userRole !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/40 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-6 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Restricted</h2>
          <p className="text-slate-600 mb-6">
            {isLoggedIn ? "You do not have admin privileges to access this dashboard." : "Please login to access the admin dashboard."}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-inner flex items-center justify-center gap-3 text-lg relative overflow-hidden"
          >
            <Lock className="w-5 h-5" />
            <span>{isLoggedIn ? "Back to Home" : "Go to Login"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/50 to-gray-500/50 animate-pulse opacity-20"></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto p-6 md:p-8 relative z-10">
        {/* Header Section */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {summaryData.map((item, index) => (
            <div
              key={index}
              className={`bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/40 group hover:-translate-y-3 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${item.color} opacity-10 rounded-bl-full`}></div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-4 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg`}>{item.icon}</div>
                <span className="text-sm font-semibold text-green-600">{item.trend}</span>
              </div>
              <p className="text-lg font-medium text-slate-600 mb-2">{item.title}</p>
              <p className="text-3xl font-bold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/40">
            <h2 className="text-xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-slate-700 to-purple-600 bg-clip-text ">
              User Growth Over Time
            </h2>
            <div className="h-80">
              <Line data={userGrowthData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/40">
            <h2 className="text-xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-slate-700 to-purple-600 bg-clip-text ">
              Recent Activity
            </h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <span className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer">View Details</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/40">
            <h2 className="text-xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-slate-700 to-purple-600 bg-clip-text ">
              Session Activity (Last Month)
            </h2>
            <div className="h-80">
              <Bar data={sessionActivityData} options={chartOptions} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
