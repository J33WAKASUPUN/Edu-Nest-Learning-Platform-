"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Filter, Bell } from "lucide-react"

// Calendar Component
const CalendarView = ({ currentDate, setCurrentDate, events, viewMode }) => {
  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const renderCalendarDays = () => {
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-100"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === today.toDateString()
      const isPast = date < today && !isToday

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-100 p-1 ${
            isToday ? "bg-blue-50 border-blue-200" : isPast ? "bg-gray-50" : "bg-white hover:bg-gray-50"
          } transition-colors cursor-pointer`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-blue-600" : isPast ? "text-gray-400" : "text-gray-900"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className={`text-xs p-1 rounded truncate ${
                  event.type === "class"
                    ? "bg-blue-100 text-blue-700"
                    : event.type === "exam"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {event.time} {event.subject}
              </div>
            ))}
            {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return days
  }

  if (viewMode === "week") {
    return <WeekView currentDate={currentDate} events={events} />
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-0 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-b border-gray-100">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">{renderCalendarDays()}</div>
      </div>
    </div>
  )
}

// Week View Component
const WeekView = ({ currentDate, events }) => {
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    weekDays.push(day)
  }

  const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Week View</h2>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-8 gap-0">
            <div className="p-4 border-b border-gray-100"></div>
            {weekDays.map((day, idx) => (
              <div key={idx} className="p-4 text-center border-b border-gray-100">
                <div className="text-sm text-gray-600">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className="text-lg font-semibold text-gray-900">{day.getDate()}</div>
              </div>
            ))}
          </div>

          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-0 border-b border-gray-50">
              <div className="p-4 text-sm text-gray-600 border-r border-gray-100">{time}</div>
              {weekDays.map((day, idx) => {
                const dayEvents = events.filter((event) => {
                  const eventDate = new Date(event.date)
                  return eventDate.toDateString() === day.toDateString() && event.time.startsWith(time.slice(0, 2))
                })

                return (
                  <div key={idx} className="p-2 min-h-[60px] border-r border-gray-50">
                    {dayEvents.map((event, eventIdx) => (
                      <div
                        key={eventIdx}
                        className={`p-2 rounded text-xs font-medium ${
                          event.type === "class"
                            ? "bg-blue-100 text-blue-700"
                            : event.type === "exam"
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        <div className="font-semibold">{event.subject}</div>
                        <div className="text-xs opacity-75">{event.teacher}</div>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Upcoming Classes Component
const UpcomingClasses = ({ events }) => {
  const today = new Date()
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Upcoming Classes
        </h3>
      </div>

      <div className="p-6 space-y-4">
        {upcomingEvents.map((event, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  event.type === "class" ? "bg-blue-500" : event.type === "exam" ? "bg-red-500" : "bg-emerald-500"
                }`}
              ></div>
              <div>
                <div className="font-semibold text-gray-900">{event.subject}</div>
                <div className="text-sm text-gray-600 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {event.teacher}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{new Date(event.date).toLocaleDateString()}</div>
              <div className="text-sm text-gray-600">{event.time}</div>
            </div>
          </div>
        ))}

        {upcomingEvents.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming classes scheduled</p>
          </div>
        )}
      </div>
    </div>
  )
}

const SchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("month")
  const [filterStream, setFilterStream] = useState("all")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true)

        // Mock schedule data
        const mockEvents = [
          {
            id: 1,
            subject: "Physics",
            teacher: "Dr. Kamal Perera",
            date: "2024-12-02",
            time: "09:00 AM",
            duration: "1.5 hours",
            type: "class",
            stream: "science",
            location: "Online",
            meetingLink: "https://meet.google.com/abc-def-ghi",
          },
          {
            id: 2,
            subject: "Chemistry",
            teacher: "Prof. Nimal Silva",
            date: "2024-12-02",
            time: "02:00 PM",
            duration: "1.5 hours",
            type: "class",
            stream: "science",
            location: "Online",
          },
          {
            id: 3,
            subject: "Mathematics",
            teacher: "Mr. Sunil Jayawardena",
            date: "2024-12-03",
            time: "10:00 AM",
            duration: "2 hours",
            type: "class",
            stream: "science",
            location: "Online",
          },
          {
            id: 4,
            subject: "Biology",
            teacher: "Dr. Priya Fernando",
            date: "2024-12-04",
            time: "09:00 AM",
            duration: "1.5 hours",
            type: "class",
            stream: "science",
            location: "Online",
          },
          {
            id: 5,
            subject: "Economics",
            teacher: "Dr. Chaminda Rathnayake",
            date: "2024-12-04",
            time: "03:00 PM",
            duration: "1.5 hours",
            type: "class",
            stream: "arts",
            location: "Online",
          },
          {
            id: 6,
            subject: "Physics Exam",
            teacher: "Dr. Kamal Perera",
            date: "2024-12-06",
            time: "10:00 AM",
            duration: "3 hours",
            type: "exam",
            stream: "science",
            location: "Online",
          },
          {
            id: 7,
            subject: "ICT",
            teacher: "Mr. Dinesh Priyankara",
            date: "2024-12-05",
            time: "11:00 AM",
            duration: "2 hours",
            type: "class",
            stream: "technology",
            location: "Online",
          },
        ]

        setEvents(mockEvents)
      } catch (error) {
        console.error("Error fetching schedule:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedule()
  }, [])

  const filteredEvents = filterStream === "all" ? events : events.filter((event) => event.stream === filterStream)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Calendar className="w-4 h-4 mr-2" />
              Class Schedule
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">My Schedule</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Stay organized with your class schedule, upcoming exams, and important academic events.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode("month")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "month" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode("week")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    viewMode === "week" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Week
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select
                  value={filterStream}
                  onChange={(e) => setFilterStream(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Streams</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts</option>
                  <option value="technology">Technology</option>
                </select>
              </div>

              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Bell className="w-4 h-4" />
                Notifications
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Calendar */}
            <div className="xl:col-span-3">
              <CalendarView
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                events={filteredEvents}
                viewMode={viewMode}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <UpcomingClasses events={filteredEvents} />

              {/* Legend */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Legend</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-600">Regular Classes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-600">Exams</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                    <span className="text-sm text-gray-600">Special Events</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SchedulePage
