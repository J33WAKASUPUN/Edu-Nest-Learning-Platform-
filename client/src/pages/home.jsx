"use client"

import { useState, useEffect } from "react"
import { User, Clock, BookOpen, MessageSquare, ChevronRight, Users, Award, Target, Zap } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

// Image Slider Component
const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const images = [
    "https://cdn.pixabay.com/photo/2022/01/28/12/17/distance-learning-6974511_640.jpg",
    "https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg?uid=R200573534&ga=GA1.1.1735072072.1739530267&semt=ais_hybrid&w=740",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxlYXJuaW5nfGVufDB8fDB8fHww",
    "https://images.pexels.com/photos/1181595/pexels-photo-1181595.jpeg?auto=compress&cs=tinysrgb&w=600",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative w-full h-full">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image || "/placeholder.svg"}
            alt={`Education slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

// Slider Dots Component
const SliderDots = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
      {[0, 1, 2, 3].map((index) => (
        <button
          key={index}
          onClick={() => setCurrentSlide(index)}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            index === currentSlide ? "bg-white shadow-lg scale-125" : "bg-white/40 hover:bg-white/60"
          }`}
        />
      ))}
    </div>
  )
}

// Teacher Card Component
const TeacherCard = ({ image, name, subject, experience }) => (
  <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200">
    <div className="relative overflow-hidden">
      <img
        src={image || "/placeholder.svg"}
        alt={name}
        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
      <p className="text-blue-600 font-semibold mb-2">{subject}</p>
      <p className="text-gray-600 text-sm">{experience}</p>
    </div>
  </div>
)

// Feature Card Component
const FeatureCard = ({ icon, title, description, color }) => (
  <div className="group text-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500">
    <div
      className={`bg-${color}-100 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
)

// Testimonial Card Component
const TestimonialCard = ({ image, name, role, quote, rating }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200">
    <div className="flex items-center mb-6">
      <div>
        <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
        <p className="text-gray-600 text-sm">{role}</p>
        <div className="flex mt-1">
          {[...Array(rating)].map((_, i) => (
            <div key={i} className="w-4 h-4 text-yellow-400">
              ★
            </div>
          ))}
        </div>
      </div>
    </div>
    <p className="text-gray-700 leading-relaxed italic">"{quote}"</p>
  </div>
)

const HomePage = () => {
  const [teachers, setTeachers] = useState([])
  const [streams, setStreams] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAllTeachers, setShowAllTeachers] = useState(false)
  const navigate = useNavigate()

  const handleEnrollClick = () => {
    navigate("/enroll")
  }

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("http://localhost:5080/api/users")

        // Filter users where role is "teacher"
        const teachers = response.data.filter((user) => user.role === "teacher")

        console.log("Teachers:", teachers)
        setTeachers(teachers)
      } catch (error) {
        console.error("Error fetching teachers:", error)
      }
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch teachers
        await fetchTeachers()

        // Mock data for streams and testimonials
        const mockStreams = [
          {
            id: 1,
            name: "Arts Stream",
            description: "Humanities and language-focused curriculum",
            subjects: ["Sinhala", "Geography", "Economics", "Buddhist Culture and Logic"],
            features: ["Expert teachers with years of experience", "Comprehensive study materials"],
            price: "Rs. 5,000 per smonth",
            image: "https://img.freepik.com/free-photo/view-vintage-paint-brushes-easel_23-2150315229.jpg",
          },
          {
            id: 2,
            name: "Science Stream",
            description: "Comprehensive science education curriculum",
            subjects: ["Physics", "Chemistry", "Biology", "Combined Mathematics"],
            features: ["Practical demonstrations and problems", "Exam-focused preparation"],
            price: "Rs. 5,000 per session",
            image:
              "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c2NpZW5jZXxlbnwwfHwwfHx8MA%3D%3D",
          },
          {
            id: 3,
            name: "Technology Stream",
            description: "Modern technology and applied sciences",
            subjects: [
              "Engineering & Bio System Technology",
              "Science for Technology",
              "ICT",
              "Agriculture and Applied Sciences",
            ],
            features: ["Practical and theoretical approach", "Industry-relevant curriculum"],
            price: "Rs. 6,000 per session",
            image:
              "https://img.freepik.com/premium-photo/businessman-search-new-opportunities-international-business-typing-laptop-background-world-map-hologram_269648-16699.jpg",
          },
        ]

        const mockTestimonials = [
          {
            id: 1,
            name: "Chamika Perera",
            role: "A/L Student",
            quote:
              "EduNest has transformed my learning experience. The teachers are highly qualified and the online platform is very user-friendly.",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
          },
          {
            id: 2,
            name: "Hiruni Fernando",
            role: "Parent",
            quote:
              "My daughter has shown remarkable improvement in her studies since joining EduNest. I'm impressed with the quality of education provided.",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
          },
          {
            id: 3,
            name: "Kavinda Silva",
            role: "A/L Student",
            quote:
              "The flexibility of attending classes online has been a game-changer for me. I can now balance my studies with other activities.",
            image: "/placeholder.svg?height=80&width=80",
            rating: 5,
          },
        ]

        setStreams(mockStreams)
        setTestimonials(mockTestimonials)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

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
    <div className="min-h-screen w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          <ImageSlider />
        </div>

        {/* Dark Overlays */}
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-purple-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/60"></div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/30 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-8 border border-blue-400/40">
              <Award className="w-4 h-4 mr-2" />
              Sri Lanka's Premier Online Education Platform
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight drop-shadow-lg">
              Unlock Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                Academic{" "}
              </span>
              Potential
            </h1>

            <p className="text-xl lg:text-2xl mb-12 text-gray-200 leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              Join our comprehensive online education platform offering specialized courses in Arts, Science, and
              Technology streams with experienced teachers.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <Link to="/enroll">
                <button className="group cursor-pointer bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm">
                  <span className="flex items-center justify-center">
                    Get Started Today
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <Link to="/subjects">
                <button className="group cursor-pointer bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300">
                  <span className="flex items-center justify-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Subjects
                  </span>
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-gray-200 text-sm">Active Students</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-purple-400 mb-2">{teachers.length}+</div>
                <div className="text-gray-200 text-sm">Expert Teachers</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-emerald-400 mb-2">95%</div>
                <div className="text-gray-200 text-sm">Success Rate</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-orange-400 mb-2">3</div>
                <div className="text-gray-200 text-sm">Study Streams</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation Dots */}
        <SliderDots />
      </section>

      {/* Streams Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Target className="w-4 h-4 mr-2" />
              Academic Streams
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Choose Your Path to Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We offer specialized courses across three major academic streams, each designed with a comprehensive
              curriculum to help you excel in your chosen field.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {streams.map((stream) => (
              <div
                key={stream.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={stream.image || "/placeholder.svg"}
                    alt={stream.name}
                    className="w-full cursor-zoom-in h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{stream.name}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{stream.description}</p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                      Core Subjects
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {stream.subjects.map((subject, idx) => (
                        <div key={idx} className="flex items-center text-gray-600 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3"></div>
                          {subject}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-emerald-600" />
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {stream.features.map((feature, idx) => (
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
                    <div className="text-2xl font-bold text-blue-600">{stream.price}</div>
                    <div className="text-sm text-gray-500">per session</div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleEnrollClick}
                      className="flex-1 cursor-pointer bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Enroll Now
                    </button>
                    <Link
                      to={
                        stream.name === "Arts Stream"
                          ? "/arts-subjects"
                          : stream.name === "Science Stream"
                            ? "/science-subjects"
                            : "/technology-subjects"
                      }
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all duration-300 text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Why Choose EduNest
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Excellence in Every Aspect</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our platform offers unique advantages for students seeking quality education with modern teaching
              methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Users className="w-8 h-8 text-blue-600" />}
              title="Expert Teachers"
              description="Learn from highly qualified teachers with years of experience and proven results in their respective fields."
              color="blue"
            />

            <FeatureCard
              icon={<Clock className="w-8 h-8 text-emerald-600" />}
              title="Flexible Schedule"
              description="Choose from multiple sessions per week to fit your personal schedule and learning pace perfectly."
              color="emerald"
            />

            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-purple-600" />}
              title="Comprehensive Materials"
              description="Access high-quality study materials, notes, and resources to support your learning journey."
              color="purple"
            />

            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-orange-600" />}
              title="Personal Support"
              description="Get individual attention and support from teachers for all your academic questions and concerns."
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              Our Faculty
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Meet Our Professional Teachers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Learn from the best educators with extensive experience and proven teaching methods that deliver results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {teachers.slice(0, showAllTeachers ? teachers.length : 4).map((teacher) => (
              <TeacherCard
                key={teacher._id}
                image={teacher.img}
                name={`${teacher.firstName} ${teacher.lastName}`}
                subject={teacher.subject}
                experience={teacher.userExperience || "Experienced educator"}
              />
            ))}
          </div>

          {teachers.length > 4 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllTeachers(!showAllTeachers)}
                className="bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  {showAllTeachers ? "Show Less" : "View All Teachers"}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 rounded-full text-orange-700 text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4 mr-2" />
              Student Success Stories
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Hear from our students and parents about their transformative experience with EduNest.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                image={testimonial.image}
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Staff Login Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Staff Portal</h3>
              <p className="text-gray-600">Access the staff dashboard and management tools</p>
            </div>

            <button
              onClick={() => navigate("/staff-login")}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Staff Login
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
