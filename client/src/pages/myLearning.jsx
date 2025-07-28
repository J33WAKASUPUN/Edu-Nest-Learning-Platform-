"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Play,
  CheckCircle,
  Calendar,
  User,
  Star,
  Download,
  Eye,
} from "lucide-react"
import { Link } from "react-router-dom"

// Progress Circle Component
const ProgressCircle = ({ percentage, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-600 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-900">{percentage}%</span>
      </div>
    </div>
  )
}

// Course Card Component
const CourseCard = ({ course }) => (
  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
    <div className="relative overflow-hidden">
      <img
        src={course.image || "/placeholder.svg?height=200&width=400"}
        alt={course.subject}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">{course.stream}</span>
      </div>
      <div className="absolute top-4 right-4">
        <ProgressCircle percentage={course.progress} size={50} strokeWidth={4} />
      </div>
    </div>

    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900">{course.subject}</h3>
        <div className="flex items-center text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium text-gray-700 ml-1">{course.rating}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 text-blue-600" />
          <span>{course.teacher}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-emerald-600" />
          <span>
            {course.totalHours} hours • {course.completedLessons}/{course.totalLessons} lessons
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 text-purple-600" />
          <span>Next class: {course.nextClass}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
          <Play className="w-4 h-4 mr-2" />
          Continue Learning
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
      </div>
    </div>
  </div>
)

// Recent Activity Component
const RecentActivity = ({ activities }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
    <div className="p-6 border-b border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-blue-600" />
        Recent Activity
      </h3>
    </div>

    <div className="p-6 space-y-4">
      {activities.map((activity, idx) => (
        <div
          key={idx}
          className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activity.type === "completed"
                ? "bg-emerald-100"
                : activity.type === "started"
                  ? "bg-blue-100"
                  : "bg-orange-100"
            }`}
          >
            {activity.type === "completed" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : activity.type === "started" ? (
              <Play className="w-5 h-5 text-blue-600" />
            ) : (
              <Download className="w-5 h-5 text-orange-600" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{activity.title}</div>
            <div className="text-sm text-gray-600">{activity.subject}</div>
            <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Stats Cards Component
const StatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</div>
          <div className="text-gray-600">Enrolled Courses</div>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{stats.completedLessons}</div>
          <div className="text-gray-600">Completed Lessons</div>
        </div>
        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{stats.studyHours}</div>
          <div className="text-gray-600">Study Hours</div>
        </div>
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{stats.averageGrade}</div>
          <div className="text-gray-600">Average Grade</div>
        </div>
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <Award className="w-6 h-6 text-orange-600" />
        </div>
      </div>
    </div>
  </div>
)

const MyLearningPage = () => {
  const [courses, setCourses] = useState([])
  const [activities, setActivities] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        setLoading(true)

        // Mock data
        const mockCourses = [
          {
            id: 1,
            subject: "Physics",
            stream: "Science",
            teacher: "Dr. Kamal Perera",
            progress: 75,
            rating: 4.9,
            totalHours: 40,
            completedLessons: 15,
            totalLessons: 20,
            nextClass: "Dec 2, 9:00 AM",
            image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&auto=format&fit=crop&q=60",
          },
          {
            id: 2,
            subject: "Chemistry",
            stream: "Science",
            teacher: "Prof. Nimal Silva",
            progress: 60,
            rating: 4.8,
            totalHours: 35,
            completedLessons: 12,
            totalLessons: 20,
            nextClass: "Dec 2, 2:00 PM",
            image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&auto=format&fit=crop&q=60",
          },
          {
            id: 3,
            subject: "Combined Mathematics",
            stream: "Science",
            teacher: "Mr. Sunil Jayawardena",
            progress: 85,
            rating: 4.7,
            totalHours: 50,
            completedLessons: 17,
            totalLessons: 20,
            nextClass: "Dec 3, 10:00 AM",
            image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
          },
          {
            id: 4,
            subject: "Biology",
            stream: "Science",
            teacher: "Dr. Priya Fernando",
            progress: 45,
            rating: 4.9,
            totalHours: 38,
            completedLessons: 9,
            totalLessons: 20,
            nextClass: "Dec 4, 9:00 AM",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&auto=format&fit=crop&q=60",
          },
        ]

        const mockActivities = [
          {
            type: "completed",
            title: "Completed Lesson: Quantum Mechanics",
            subject: "Physics",
            time: "2 hours ago",
          },
          {
            type: "started",
            title: "Started: Organic Chemistry Basics",
            subject: "Chemistry",
            time: "5 hours ago",
          },
          {
            type: "downloaded",
            title: "Downloaded: Calculus Practice Problems",
            subject: "Mathematics",
            time: "1 day ago",
          },
          {
            type: "completed",
            title: "Completed Quiz: Cell Biology",
            subject: "Biology",
            time: "2 days ago",
          },
        ]

        const mockStats = {
          enrolledCourses: 4,
          completedLessons: 53,
          studyHours: 163,
          averageGrade: "A-",
        }

        setCourses(mockCourses)
        setActivities(mockActivities)
        setStats(mockStats)
      } catch (error) {
        console.error("Error fetching learning data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLearningData()
  }, [])

  const filteredCourses =
    activeTab === "all"
      ? courses
      : courses.filter((course) => {
          if (activeTab === "in-progress") return course.progress > 0 && course.progress < 100
          if (activeTab === "completed") return course.progress === 100
          return true
        })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Learning Dashboard
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">My Learning Journey</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Track your progress, access your courses, and continue your path to academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Stats */}
          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Course Tabs */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === "all" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All Courses
                  </button>
                  <button
                    onClick={() => setActiveTab("in-progress")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === "in-progress"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === "completed"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                  <p className="text-gray-500">Try selecting a different tab or enroll in new courses.</p>
                  <Link
                    to="/subjects"
                    className="inline-flex items-center mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Browse Subjects
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <RecentActivity activities={activities} />

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/schedule"
                    className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-700">View Schedule</span>
                  </Link>
                  <Link
                    to="/subjects"
                    className="flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-emerald-700">Browse Subjects</span>
                  </Link>
                  <button className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors w-full text-left">
                    <Download className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-700">Download Materials</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MyLearningPage
