import React from 'react';
import { BsCalendarEvent, BsJournalText, BsPeople, BsClockHistory } from 'react-icons/bs';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function TeacherDashboard() {
  const summaryData = [
    { title: 'Upcoming Sessions', value: 5, icon: <BsCalendarEvent className="text-3xl text-blue-500" />, color: 'bg-blue-100' },
    { title: 'Total Notes', value: 24, icon: <BsJournalText className="text-3xl text-green-500" />, color: 'bg-green-100' },
    { title: 'Students', value: 45, icon: <BsPeople className="text-3xl text-purple-500" />, color: 'bg-purple-100' },
    { title: 'Hours Taught', value: 120, icon: <BsClockHistory className="text-3xl text-yellow-500" />, color: 'bg-yellow-100' },
  ];

  const upcomingSessions = [
    { id: 1, subject: 'Mathematics', time: 'Today, 10:00 AM', students: 25 },
    { id: 2, subject: 'Physics', time: 'Tomorrow, 2:00 PM', students: 30 },
    { id: 3, subject: 'Chemistry', time: 'Friday, 11:00 AM', students: 20 },
  ];

  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Student Attendance',
        data: [85, 90, 88, 92],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Your teaching overview and schedule</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md ${item.color} flex items-center space-x-4`}
          >
            <div>{item.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-600">{item.title}</p>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h3 className="font-medium text-gray-800">{session.subject}</h3>
                  <p className="text-sm text-gray-600">{session.time}</p>
                </div>
                <div className="text-sm text-gray-600">
                  {session.students} students
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Class Performance</h2>
          <div className="h-80">
            <Line data={performanceData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}