"use client"

import { useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { ArrowLeft, Copy, ExternalLink, Calendar, Clock, Users } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"

const ArtSessions = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const subjectId = new URLSearchParams(location.search).get("subject")
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showLink, setShowLink] = useState({})

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem("token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const { data } = await axios.get("http://localhost:5080/api/sessions", {
          headers,
        })

        const filteredSessions = data.filter(
          (session) => session.subject.toLowerCase() === (subjectId || "").toLowerCase(),
        )
        setSessions(filteredSessions)
      } catch (error) {
        console.error("Error fetching sessions:", error)
        setError(error.response?.data?.message || "Failed to fetch sessions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (subjectId) fetchSessions()
  }, [subjectId])

  const handleCopyLink = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })
      .catch((err) => {
        console.error("Failed to copy link:", err)
        toast.error("Failed to copy link. Please try again.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      })
  }

  const toggleShowLink = (sessionId) => {
    setShowLink((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId],
    }))
  }

  const handleImageError = (e) => {
    e.target.src = "/../public/teacher.png"
    e.target.onerror = null
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-100">
      <div className="container mx-auto p-6 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-3 px-8 py-4 mb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.05] border border-emerald-500/20"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform duration-300" />
            <span className="text-lg">Back to Subjects</span>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-700 via-teal-600 to-blue-700 bg-clip-text text-transparent">
              {subjectId ? subjectId.charAt(0).toUpperCase() + subjectId.slice(1).toLowerCase() : "Unknown Subject"}{" "}
              Sessions
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover and join engaging learning sessions with expert instructors
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
            <p className="text-slate-600 text-lg">Loading sessions...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/30 group hover:-translate-y-2"
              >
                {/* Session Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-slate-800 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {session.subject}
                    </h2>
                    <span className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-200">
                      Live
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{session.description}</p>
                </div>

                {/* Session Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-slate-600">
                    <Calendar className="w-4 h-4 mr-3 text-emerald-500" />
                    <span className="text-sm font-medium">{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="w-4 h-4 mr-3 text-teal-500" />
                    <span className="text-sm font-medium">
                      {session.startTime} - {session.endTime}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Users className="w-4 h-4 mr-3 text-blue-500" />
                    <span className="text-sm font-medium">Max {session.maxStudents} students</span>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl mb-6 border border-emerald-100">
                  <img
                    src={
                      session.teacher?.img ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" ||
                      "/placeholder.svg"
                    }
                    alt={`${session.teacher?.firstName} ${session.teacher?.lastName}'s profile`}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    onError={handleImageError}
                  />
                  <div>
                    <p className="font-semibold text-slate-800">
                      {session.teacher?.firstName} {session.teacher?.lastName || ""}
                    </p>
                    <p className="text-sm text-slate-500">Instructor</p>
                  </div>
                </div>

                {/* Session Link */}
                {session.link && (
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleShowLink(session._id)}
                      className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      {showLink[session._id] ? "Hide Session Link" : "Get Session Link"}
                    </button>

                    {showLink[session._id] && (
                      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl border border-emerald-200">
                        <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-emerald-100 shadow-sm">
                          <span className="text-sm text-slate-700 truncate flex-1 mr-3">{session.link}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleCopyLink(session.link)}
                              className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Copy Link"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <a
                              href={session.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                              title="Join Session"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto shadow-lg border border-white/30">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No sessions found</h3>
              <p className="text-slate-600 mb-6">There are currently no sessions available for {subjectId}.</p>
              <button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold"
              >
                Browse Other Subjects
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtSessions
