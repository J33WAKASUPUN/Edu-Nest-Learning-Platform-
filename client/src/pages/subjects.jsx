"use client"

import { useState, useEffect } from "react"
import { BookOpen, Clock, Users, Star, ChevronRight, Zap, Play, Calendar } from "lucide-react"
import { Link } from "react-router-dom"

// Subject Card Component
const SubjectCard = ({ subject, stream, teacher, duration, students, rating, price, image, description, features }) => (
  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200">
    <div className="relative overflow-hidden">
      <img
        src={image || "/placeholder.svg?height=200&width=400"}
        alt={subject}
        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">{stream}</span>
      </div>
      <div className="absolute top-4 right-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
          <Play className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>

    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900">{subject}</h3>
        <div className="flex items-center text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium text-gray-700 ml-1">{rating}</span>
        </div>
      </div>

      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-blue-600" />
          <span className="font-medium">{teacher}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-emerald-600" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 text-purple-600" />
          <span>{students} students enrolled</span>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-orange-600" />
          What You'll Learn
        </h4>
        <div className="space-y-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start text-gray-600 text-sm">
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
              </div>
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-blue-600">{price}</div>
        <div className="text-sm text-gray-500">per month</div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105">
          Enroll Now
        </button>
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300">
          Preview
        </button>
      </div>
    </div>
  </div>
)

// Stream Filter Component
const StreamFilter = ({ activeStream, setActiveStream }) => {
  const streams = [
    { id: "all", name: "All Subjects", color: "gray" },
    { id: "science", name: "Science Stream", color: "blue" },
    { id: "arts", name: "Arts Stream", color: "emerald" },
    { id: "technology", name: "Technology Stream", color: "purple" },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {streams.map((stream) => (
        <button
          key={stream.id}
          onClick={() => setActiveStream(stream.id)}
          className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
            activeStream === stream.id
              ? `bg-${stream.color}-600 text-white shadow-lg`
              : `bg-${stream.color}-100 text-${stream.color}-700 hover:bg-${stream.color}-200`
          }`}
        >
          {stream.name}
        </button>
      ))}
    </div>
  )
}

// Stats Component
const StatsSection = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
    <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
      <div className="text-gray-600">Available Subjects</div>
    </div>
    <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
      <div className="text-gray-600">Active Students</div>
    </div>
    <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
      <div className="text-gray-600">Expert Teachers</div>
    </div>
    <div className="text-center bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
      <div className="text-gray-600">Average Rating</div>
    </div>
  </div>
)

const SubjectsPage = () => {
  const [activeStream, setActiveStream] = useState("all")
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true)

        // Mock subjects data
       const mockSubjects = [
  // Science Stream
  {
    id: 1,
    subject: "Physics",
    stream: "Science",
    teacher: "Dr. Kamal Perera",
    duration: "3 hours/week",
    students: 120,
    rating: 4.9,
    price: "Rs. 22,500",
    image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500&auto=format&fit=crop&q=60",
    description: "Master the fundamental principles of physics with practical applications and problem-solving techniques.",
    features: [
      "Mechanics and motion analysis",
      "Electricity and magnetism",
      "Wave properties and optics",
      "Modern physics concepts",
    ],
  },
  {
    id: 2,
    subject: "Chemistry",
    stream: "Science",
    teacher: "Prof. Nimal Silva",
    duration: "3 hours/week",
    students: 95974,
    rating: 4.8,
    price: "Rs. 22,000",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&auto=format&fit=crop&q=60",
    description: "Explore chemical reactions, molecular structures, and laboratory techniques for A/L success.",
    features: [
      "Organic chemistry fundamentals",
      "Inorganic compound analysis",
      "Physical chemistry principles",
      "Laboratory safety and techniques",
    ],
  },
  {
    id: 3,
    subject: "Biology",
    stream: "Science",
    teacher: "Dr. Priya Fernando",
    duration: "3 hours/week",
    students: 110,
    rating: 4.9,
    price: "Rs. 22,500",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&auto=format&fit=crop&q=60",
    description: "Comprehensive study of life sciences from cellular level to ecosystem interactions.",
    features: [
      "Cell biology and genetics",
      "Human anatomy and physiology",
      "Ecology and environmental science",
      "Evolution and biodiversity",
    ],
  },
  {
    id: 4,
    subject: "Combined Mathematics",
    stream: "Science",
    teacher: "Mr. Sunil Jayawardena",
    duration: "4 hours/week",
    students: 85,
    rating: 4.7,
    price: "Rs. 25,000",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500&auto=format&fit=crop&q=60",
    description: "Advanced mathematical concepts including calculus, algebra, and statistical analysis.",
    features: [
      "Differential and integral calculus",
      "Complex numbers and matrices",
      "Probability and statistics",
      "Mathematical modeling",
    ],
  },
  // Arts Stream
  {
    id: 5,
    subject: "Sinhala Language & Literature",
    stream: "Arts",
    teacher: "Mrs. Kumari Wickramasinghe",
    duration: "3 hours/week",
    students: 75,
    rating: 4.8,
    price: "Rs. 20,000",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&auto=format&fit=crop&q=60",
    description: "Master Sinhala language skills, literature analysis, and creative writing techniques.",
    features: [
      "Classical and modern literature",
      "Grammar and composition",
      "Poetry analysis and appreciation",
      "Creative writing skills",
    ],
  },
  {
    id: 6,
    subject: "Geography",
    stream: "Arts",
    teacher: "Mr. Rohan Dissanayake",
    duration: "3 hours/week",
    students: 65,
    rating: 4.6,
    price: "Rs. 22,500",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&auto=format&fit=crop&q=60",
    description: "Explore physical and human geography with focus on Sri Lankan and global perspectives.",
    features: [
      "Physical geography and landforms",
      "Climate and weather patterns",
      "Human settlements and urbanization",
      "Economic geography and resources",
    ],
  },
  {
    id: 7,
    subject: "Economics",
    stream: "Arts",
    teacher: "Dr. Chaminda Rathnayake",
    duration: "3 hours/week",
    students: 80,
    rating: 4.7,
    price: "Rs. 25,000",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60",
    description: "Understand economic principles, market dynamics, and policy implications.",
    features: [
      "Microeconomic theory",
      "Macroeconomic analysis",
      "International trade and finance",
      "Development economics",
    ],
  },
  {
    id: 8,
    subject: "Buddhist Culture & Logic",
    stream: "Arts",
    teacher: "Ven. Medagoda Abhayatissa",
    duration: "2 hours/week",
    students: 55,
    rating: 4.9,
    price: "Rs. 20,000",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&auto=format&fit=crop&q=60",
    description: "Study Buddhist philosophy, ethics, and logical reasoning principles.",
    features: [
      "Buddhist philosophy and ethics",
      "Logical reasoning and argumentation",
      "Historical development of Buddhism",
      "Contemporary applications",
    ],
  },
  // Technology Stream
  {
    id: 9,
    subject: "Engineering & Bio System Technology",
    stream: "Technology",
    teacher: "Eng. Prasad Gunasekara",
    duration: "4 hours/week",
    students: 45,
    rating: 4.8,
    price: "Rs. 25,000",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60",
    description: "Integrate engineering principles with biological systems for innovative solutions.",
    features: [
      "Biomedical engineering concepts",
      "Agricultural technology systems",
      "Environmental engineering",
      "Sustainable technology design",
    ],
  },
  {
    id: 10,
    subject: "Science for Technology",
    stream: "Technology",
    teacher: "Dr. Anura Jayasuriya",
    duration: "3 hours/week",
    students: 50,
    rating: 4.7,
    price: "Rs. 22,500",
    image: "https://img.freepik.com/free-photo/professional-scientist-wearing-virtual-reality-glasses-using-medical-inovation-lab-team-researchers-working-with-equipment-device-future-medicine-healthcare-professional-vision-simulator_482257-12838.jpg?uid=R200573534&ga=GA1.1.1735072072.1739530267&semt=ais_hybrid&w=740",
    description: "Applied science concepts specifically designed for technology stream students.",
    features: [
      "Applied physics principles",
      "Materials science and engineering",
      "Energy systems and sustainability",
      "Scientific research methods",
    ],
  },
  {
    id: 11,
    subject: "Information & Communication Technology",
    stream: "Technology",
    teacher: "Mr. Dinesh Priyankara",
    duration: "4 hours/week",
    students: 70,
    rating: 4.9,
    price: "Rs. 25,000",
    image: "https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg?uid=R200573534&ga=GA1.1.1735072072.1739530267&semt=ais_hybrid&w=740",
    description: "Master modern ICT skills including programming, databases, and system design.",
    features: [
      "Programming and software development",
      "Database design and management",
      "Network systems and security",
      "Web development and digital media",
    ],
  },
  {
    id: 12,
    subject: "Agriculture & Applied Sciences",
    stream: "Technology",
    teacher: "Dr. Malini Herath",
    duration: "3 hours/week",
    students: 40,
    rating: 4.6,
    price: "Rs. 22,500",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60",
    description: "Explore modern agricultural practices and applied scientific methods.",
    features: [
      "Crop science and plant breeding",
      "Soil science and fertility management",
      "Agricultural biotechnology",
      "Sustainable farming practices",
    ],
  },
];

        setSubjects(mockSubjects)
      } catch (error) {
        console.error("Error fetching subjects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  const filteredSubjects =
    activeStream === "all" ? subjects : subjects.filter((subject) => subject.stream.toLowerCase() === activeStream)

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/30 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-8 border border-blue-400/40">
              <BookOpen className="w-4 h-4 mr-2" />
              Comprehensive Subject Catalog
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Explore Our
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Subjects{" "}
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-12 text-gray-200 leading-relaxed max-w-3xl mx-auto">
              Choose from our comprehensive range of subjects across Science, Arts, and Technology streams, taught by
              experienced educators with proven track records.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link
                to="/enroll"
                className="group bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  Start Learning Today
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <button className="group bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300">
                <span className="flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  View Schedule
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Stats Section */}
          <StatsSection />

          {/* Stream Filter */}
          <StreamFilter activeStream={activeStream} setActiveStream={setActiveStream} />

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject.subject}
                stream={subject.stream}
                teacher={subject.teacher}
                duration={subject.duration}
                students={subject.students}
                rating={subject.rating}
                price={subject.price}
                image={subject.image}
                description={subject.description}
                features={subject.features}
              />
            ))}
          </div>

          {filteredSubjects.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No subjects found</h3>
              <p className="text-gray-500">Try selecting a different stream or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of students who have achieved academic success with our expert guidance and comprehensive
                curriculum.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/enroll"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Enroll Now
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SubjectsPage
