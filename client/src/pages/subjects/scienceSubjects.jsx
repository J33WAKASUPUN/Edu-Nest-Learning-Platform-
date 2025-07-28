
"use client"
import { useNavigate } from "react-router-dom"
import {
  BookOpen,
  FileText,
  Video,
  ArrowLeft,
  Users,
  GraduationCap,
  FlaskConical,
  Microscope,
  Brain,
  Atom,
  Lock,
  Star,
  Award,
  TrendingUp,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import axios from "axios"
import "react-toastify/dist/ReactToastify.css"

const ScienceSubjects = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState("")
  const [subjects, setSubjects] = useState([])
  const [accessibleSubjects, setAccessibleSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  // Check if user is logged in and fetch subject data
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]))
        setIsLoggedIn(true)
        setUserRole(userData.role)

        // Fetch accessible subjects if logged in
        fetchAccessibleSubjects(token)
      } catch (error) {
        console.error("Error parsing token:", error)
        localStorage.removeItem("token")
      }
    }

    fetchSubjectData()
  }, [])

  const fetchAccessibleSubjects = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setAccessibleSubjects(response.data.accessibleSubjects || [])
    } catch (error) {
      console.error("Error fetching accessible subjects:", error)
    }
  }

  const fetchSubjectData = async () => {
    try {
      const { data: sessions } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/sessions`)
      const { data: notes } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notes`)

      const subjectList = [
        {
          id: "Physics",
          name: "Physics",
          description: "Study of matter, energy, and the fundamental forces of nature",
          color: "from-blue-500 to-indigo-600",
          bgColor: "from-blue-50 to-indigo-50",
          icon: <Atom className="w-6 h-6 text-white" />,
          rating: 4.9,
        },
        {
          id: "Chemistry",
          name: "Chemistry",
          description: "Exploration of substances, their properties, and reactions",
          color: "from-emerald-500 to-teal-600",
          bgColor: "from-emerald-50 to-teal-50",
          icon: <FlaskConical className="w-6 h-6 text-white" />,
          rating: 4.8,
        },
        {
          id: "Biology",
          name: "Biology",
          description: "In-depth study of living organisms and their interactions",
          color: "from-green-500 to-lime-600",
          bgColor: "from-green-50 to-lime-50",
          icon: <Microscope className="w-6 h-6 text-white" />,
          rating: 4.7,
        },
        {
          id: "Combined Mathematics",
          name: "Combined Mathematics",
          description: "Advanced mathematical concepts for scientific applications",
          color: "from-purple-500 to-violet-600",
          bgColor: "from-purple-50 to-violet-50",
          icon: <Brain className="w-6 h-6 text-white" />,
          rating: 4.6,
        },
      ]

      const updatedSubjects = subjectList.map((subject) => {
        const sessionCount = sessions.filter((session) => session.subject === subject.id).length
        const noteCount = notes.filter((note) => note.subject === subject.id).length

        return {
          ...subject,
          sessions: sessionCount,
          notes: noteCount,
        }
      })

      setSubjects(updatedSubjects)
    } catch (error) {
      console.error("Error fetching subject data:", error)
      toast.error("Failed to load subject data. Please try again.", {
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
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewSessions = (subjectId, subjectName) => {
    if (!isLoggedIn) {
      toast.error(`Please login first to access ${subjectName} sessions`, {
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
      })
      return
    }

    // Check if user has access to this subject
    if (!accessibleSubjects.includes(subjectId) && userRole !== "admin") {
      toast.error(`Your enrollment for ${subjectName} is not approved yet`, {
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
      })
      return
    }

    try {
      const formattedSubjectId = subjectId.toLowerCase().replace(/\s+/g, '-')
      navigate(`/science/scienceSessions?subject=${encodeURIComponent(formattedSubjectId)}`)
    } catch (error) {
      console.error("Navigation error (sessions):", error)
      toast.error("Failed to navigate to sessions. Please try again.", {
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
      })
    }
  }

  const handleViewNotes = (subjectId, subjectName) => {
    if (!isLoggedIn) {
      toast.error(`Please login first to access ${subjectName} notes`, {
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
      })
      return
    }

    // Check if user has access to this subject
    if (!accessibleSubjects.includes(subjectId) && userRole !== "admin") {
      toast.error(`Your enrollment for ${subjectName} is not approved yet`, {
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
      })
      return
    }

    try {
      const formattedSubjectId = subjectId.toLowerCase().replace(/\s+/g, '-')
      navigate(`/science/scienceNotes?subject=${encodeURIComponent(formattedSubjectId)}`)
    } catch (error) {
      console.error("Navigation error (notes):", error)
      toast.error("Failed to navigate to notes. Please try again.", {
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
      })
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Science Stream Subjects...</p>
        </div>
      </div>
    )
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
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-8 py-4 mb-8 bg-gradient-to-r from-slate-600 via-blue-600 to-purple-600 hover:from-slate-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.05] border border-slate-500/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300" />
            <span className="text-lg">Back to Streams</span>
          </button>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-6">
              <Award className="w-6 h-6 text-purple-600" />
              <span className="text-purple-700 font-semibold">Premium Education</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-700 via-blue-600 to-purple-700 bg-clip-text text-transparent leading-tight">
              Science Stream Subjects
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto flex items-center justify-center gap-3 leading-relaxed">
              <GraduationCap className="w-7 h-7 text-purple-600" />
              Comprehensive science-focused curriculum designed for academic excellence
            </p>

            {/* Stats Bar */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-700">{subjects.length}</div>
                <div className="text-sm text-slate-600 font-medium">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-700">
                  {subjects.reduce((total, subject) => total + (subject.sessions || 0), 0)}
                </div>
                <div className="text-sm text-slate-500 font-medium">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-700">
                  {subjects.reduce((total, subject) => total + (subject.notes || 0), 0)}
                </div>
                <div className="text-sm text-slate-500 font-medium">Study Notes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/40 group hover:-translate-y-3 relative overflow-hidden"
            >
              {/* Decorative Corner */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${subject.color} opacity-10 rounded-bl-full`}
              ></div>

              {/* Subject Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 bg-gradient-to-r ${subject.color} rounded-2xl shadow-lg`}>{subject.icon}</div>
                  <div className="flex items-center gap-2">
                    {renderStars(subject.rating)}
                    <span className="text-sm font-semibold text-slate-600 ml-1">{subject.rating}</span>
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4 text-slate-800 group-hover:bg-gradient-to-r group-hover:from-slate-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {subject.name}
                </h2>

                <p className="text-slate-600 leading-relaxed text-lg mb-6">{subject.description}</p>

                {/* Subject Metadata (No difficulty or duration) */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full text-sm font-medium text-purple-600 bg-purple-100 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </span>
                </div>
              </div>

              {/* Enhanced Stats Section */}
              <div
                className={`grid grid-cols-2 gap-4 mb-8 p-6 bg-gradient-to-r ${subject.bgColor} rounded-2xl border border-white/50 shadow-inner`}
              >
                <div className="text-center">
                  <div className={`p-3 bg-gradient-to-r ${subject.color} rounded-xl mx-auto w-fit mb-3 shadow-lg`}>
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Video Sessions</p>
                  <p className="font-bold text-2xl text-slate-700">{subject.sessions || "0"}</p>
                </div>
                <div className="text-center">
                  <div className={`p-3 bg-gradient-to-r ${subject.color} rounded-xl mx-auto w-fit mb-3 shadow-lg`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Study Notes</p>
                  <p className="font-bold text-2xl text-slate-700">{subject.notes || "0"}</p>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleViewSessions(subject.id, subject.name)}
                  className={`flex-1 ${
                    isLoggedIn && (accessibleSubjects.includes(subject.id) || userRole === "admin")
                      ? `bg-gradient-to-r ${subject.color} hover:shadow-xl hover:shadow-purple-500/25`
                      : "bg-gradient-to-r from-gray-600 to-gray-400 cursor-not-allowed"
                  } text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform ${
                    isLoggedIn && (accessibleSubjects.includes(subject.id) || userRole === "admin")
                      ? "hover:scale-[1.02] active:scale-[0.98]"
                      : ""
                  } shadow-lg flex items-center justify-center gap-3 text-lg`}
                  disabled={!isLoggedIn || (!accessibleSubjects.includes(subject.id) && userRole !== "admin")}
                >
                  {isLoggedIn && (accessibleSubjects.includes(subject.id) || userRole === "admin") ? (
                    <>
                      <Video className="w-5 h-5" />
                      <span>View Sessions</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Access Restricted</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleViewNotes(subject.id, subject.name)}
                  className={`flex-1 ${
                    isLoggedIn && (accessibleSubjects.includes(subject.id) || userRole === "admin")
                      ? "bg-gradient-to-r from-slate-400 to-slate-300 hover:from-slate-200 hover:to-slate-300 text-slate-700 hover:shadow-xl"
                      : "bg-gradient-to-r from-gray-600 to-gray-500 cursor-not-allowed text-white relative overflow-hidden"
                  } font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform ${
                    isLoggedIn && (accessibleSubjects.includes(subject.id) || userRole === "admin")
                      ? "hover:scale-[1.02] active:scale-[0.98]"
                      : "hover:shadow-inner"
                  } shadow-lg flex items-center justify-center gap-3 border-2 border-gray-400/50 text-lg`}
                  disabled={!isLoggedIn || (!accessibleSubjects.includes(subject.id) && userRole !== "admin")}
                >
                  {isLoggedIn && (accessibleSubjects.includes(subject.id) || userRole === "admin") ? (
                    <>
                      <FileText className="w-5 h-5" />
                      <span>View Notes</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Access Restricted</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-600/50 to-gray-500/50 animate-pulse opacity-20"></div>
                    </>
                  )}
                </button>
              </div>

              {/* Enhanced Status Indicators */}
              {!isLoggedIn ? (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl shadow-inner">
                  <p className="text-amber-700 font-medium flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    Please login to access premium course materials
                  </p>
                </div>
              ) : !accessibleSubjects.includes(subject.id) && userRole !== "admin" ? (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-inner">
                  <p className="text-blue-700 font-medium flex items-center gap-3">
                    <BookOpen className="w-5 h-5" />
                    Enrollment approval required for this subject
                  </p>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-inner">
                  <p className="text-green-700 font-medium flex items-center gap-3">
                    <Award className="w-5 h-5" />
                    Full access granted - Start learning now!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Additional Info Section */}
        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/40 max-w-4xl mx-auto relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-6 shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-3xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-slate-700 to-purple-600 bg-clip-text">
                Comprehensive Learning Experience
              </h3>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
                Access interactive video sessions, comprehensive study notes, and expert guidance across all Science stream
                subjects. Build a strong foundation in scientific studies with our premium educational platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-700 mb-2">Interactive Sessions</h4>
                  <p className="text-sm text-slate-600">Engaging video content with expert instructors</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-700 mb-2">Detailed Notes</h4>
                  <p className="text-sm text-slate-600">Comprehensive study materials and resources</p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-700 mb-2">Expert Guidance</h4>
                  <p className="text-sm text-slate-600">Professional instruction and academic support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScienceSubjects
