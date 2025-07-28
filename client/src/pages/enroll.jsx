"use client"
import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Upload,
  MessageSquare,
  Calendar,
  BookOpen,
  X,
  Check,
  AlertTriangle,
  GraduationCap,
  Clock,
  Shield,
  Star,
  Award,
  CheckCircle,
} from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const SUBJECTS = [
  "Sinhala",
  "Geography",
  "Economics",
  "Biology",
  "Buddhist Culture and Logic",
  "Physics",
  "Chemistry",
  "Combined Mathematics",
  "Engineering & Bio System Technology",
  "Science for Technology",
  "ICT",
  "Agriculture and Applied Sciences",
]

export default function EnrollPage() {
  const [formData, setFormData] = useState({
    message: "",
    subject: "",
    month: "",
    year: "",
  })
  const [photo, setPhoto] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [receiptConfirmed, setReceiptConfirmed] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const currentYear = new Date().getFullYear()
  // Only allow current year and next 2 years (max: currentYear + 2)
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i)
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }))

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error(
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-bold text-red-800">Invalid File Type</div>
            <div className="text-sm text-red-700">Please upload an image file (JPEG, PNG, etc.) for your payment receipt.</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 4000,
          className: "!bg-white !text-red-800 !shadow-lg !border !border-red-200 !rounded-xl",
        }
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-bold text-red-800">File Too Large</div>
            <div className="text-sm text-red-700">Payment receipt image should be less than 5MB.</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 4000,
          className: "!bg-white !text-red-800 !shadow-lg !border !border-red-200 !rounded-xl",
        }
      )
      return
    }

    setPhoto(file)
    setShowWarning(true)
    setReceiptConfirmed(false)
  }

  const removePhoto = () => {
    setPhoto(null)
    setShowWarning(false)
    setReceiptConfirmed(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Prepare FormData for multipart/form-data
      const form = new FormData();
      form.append('message', formData.message);
      form.append('subject', formData.subject);
      form.append('month', formData.month);
      form.append('year', formData.year);
      if (photo) {
        form.append('image', photo);
      }

      // Debug: log FormData entries
      for (let pair of form.entries()) {
        console.log('[DEBUG] FormData', pair[0], pair[1]);
      }

      // You need to get the token from your auth context or storage
      const token = localStorage.getItem("token"); // or however you store the token
      console.log('[DEBUG] Token:', token);

      await axios.post(
        '/api/enrollments/enroll',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        }
      );

      setIsLoading(false);
      setUploadProgress(100);
      toast.success(
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-bold text-green-800 mb-1">Enrollment Submitted Successfully! 🎉</div>
            <div className="text-sm text-green-700 mb-2">
              Your enrollment request and payment receipt have been received and are being processed.
            </div>
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
              <Clock className="w-4 h-4 inline mr-1" />
              <strong>You can get access within 24 hours</strong> after admin approval of your payment receipt.
            </div>
            <div className="text-xs text-green-600 mt-1">You will be redirected to the home page shortly...</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          className: "!bg-white !text-green-800 !shadow-lg !border !border-green-200 !rounded-xl",
          onClose: () => navigate("/home"),
        }
      );
    } catch (error) {
      setIsLoading(false);
      setUploadProgress(0);

      let errorMessage = "Failed to submit enrollment. Please try again.";

      if (error.response) {
        console.error('[ERROR] Backend response:', error.response.data);
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || "Invalid enrollment data";
        } else if (error.response.status === 403) {
          errorMessage = "Access denied. Please check your permissions.";
        } else if (error.response.status === 401) {
          errorMessage = "Session expired. Please login again.";
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else {
        console.error('[ERROR] Network or unknown error:', error);
      }

      toast.error(
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-bold text-red-800">Enrollment Failed</div>
            <div className="text-sm text-red-700">{errorMessage}</div>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "!bg-white !text-red-800 !shadow-lg !border !border-red-200 !rounded-xl",
        }
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/30 mb-6">
            <Award className="w-6 h-6 text-purple-600" />
            <span className="text-purple-700 font-semibold">Premium Education Enrollment</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-700 via-blue-600 to-purple-700 bg-clip-text text-transparent">
            Course Enrollment
          </h1>

          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            Join thousands of students in our comprehensive learning programs. Fill out the form below and upload your payment receipt to begin your educational journey.
          </p>

          {/* Features */}
          <div className="flex justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure Process</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>24hr Approval</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Expert Instructors</span>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/40 p-8 md:p-12 relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500 to-blue-600 opacity-10 rounded-bl-full"></div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Subject Selection */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-800 mb-3">
                <BookOpen className="w-5 h-5 inline mr-2 text-purple-600" />
                Select Your Subject
              </label>
              <div className="relative">
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
                  required
                >
                  <option value="">Choose your preferred subject...</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject} className="py-2">
                      {subject}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Month/Year Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-slate-800">
                  <Calendar className="w-5 h-5 inline mr-2 text-blue-600" />
                  Starting Month
                </label>
                <div className="relative">
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select month...</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-lg font-semibold text-slate-800">
                  <Calendar className="w-5 h-5 inline mr-2 text-green-600" />
                  Academic Year
                </label>
                <div className="relative">
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select year...</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-800">
                <MessageSquare className="w-5 h-5 inline mr-2 text-indigo-600" />
                Why do you want to enroll in this subject?
              </label>
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md resize-none"
                  placeholder="Share your motivation, goals, and what you hope to achieve from this course..."
                  required
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">{formData.message.length}/500</div>
              </div>
            </div>

            {/* Payment Receipt Upload */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-slate-800">
                <Upload className="w-5 h-5 inline mr-2 text-rose-600" />
                Payment Receipt
              </label>

              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-80 border-3 border-slate-300 border-dashed rounded-3xl cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 transition-all duration-300 relative group">
                    {photo ? (
                      <>
                        <img
                          src={URL.createObjectURL(photo) || "/placeholder.svg"}
                          alt="Payment Receipt Preview"
                          className="w-full h-full object-contain rounded-3xl p-4"
                        />
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg"
                          title="Remove receipt"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-8 pb-8 group-hover:scale-105 transition-transform duration-300">
                        <div className="p-4 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mb-4 shadow-lg">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <p className="mb-2 text-lg font-semibold text-slate-700">Click to upload your payment receipt</p>
                        <p className="text-sm text-slate-500 text-center max-w-xs">
                          Upload a clear image of your payment receipt for course enrollment
                        </p>
                        <p className="text-xs text-slate-400 mt-2">PNG, JPG, JPEG (MAX. 5MB)</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      id="receipt-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      required
                    />
                  </label>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-slate-600 text-center font-medium">Uploading Receipt: {uploadProgress}%</div>
                  </div>
                )}

                {showWarning && photo && !receiptConfirmed && (
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-amber-800 mb-2">Confirm Your Payment Receipt</p>
                        <p className="text-sm text-amber-700 mb-4">
                          Please verify this is the correct payment receipt. Ensure the image is clear, readable, and includes all payment details (e.g., amount, date, transaction ID). Once submitted, you cannot change it.
                        </p>
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => { setReceiptConfirmed(true); setShowWarning(false); }}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md"
                          >
                            <Check className="h-4 w-4" />
                            Yes, this is correct
                          </button>
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="flex items-center gap-2 bg-gradient-to-r from-slate-400 to-slate-500 text-white px-4 py-2 rounded-xl hover:from-slate-500 hover:to-slate-600 transition-all duration-200 font-medium shadow-md"
                          >
                            <X className="h-4 w-4" />
                            Choose another receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !receiptConfirmed}
                className={`w-full flex justify-center items-center gap-3 py-5 px-6 rounded-2xl text-lg font-bold transition-all duration-300 transform shadow-lg ${
                  isLoading
                    ? "bg-gradient-to-r from-slate-400 to-slate-500 cursor-not-allowed scale-95"
                    : !receiptConfirmed
                      ? "bg-gradient-to-r from-slate-300 to-slate-400 cursor-not-allowed text-slate-600"
                      : "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>{uploadProgress > 0 ? `Uploading Receipt (${uploadProgress}%)` : "Processing Enrollment..."}</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-6 w-6" />
                    <span>Submit Enrollment Application</span>
                  </>
                )}
              </button>

              {!receiptConfirmed && photo && (
                <p className="text-center text-sm text-slate-500 mt-3">
                  Please confirm your payment receipt to enable submission
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/30 max-w-xl mx-auto">
            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Quick Processing</h3>
            <p className="text-slate-600 leading-relaxed">
              Your enrollment and payment receipt will be reviewed within 24 hours. Once approved, you'll receive immediate access to all course materials and can begin your learning journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}