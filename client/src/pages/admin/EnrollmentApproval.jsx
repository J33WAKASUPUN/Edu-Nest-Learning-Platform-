"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, Eye, Trash2, Calendar, BookOpen, User, Loader2 } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageModal from "../../components/ImageModal";

export default function EnrollmentApprovals() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    fetchEnrollments();
    clearNotifications();
    
    // Set up polling for new enrollments every 10 seconds
    const interval = setInterval(fetchEnrollments, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/enrollments`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setEnrollments(response.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const clearNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/enrollments/clear-notifications`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/enrollments/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success(`Enrollment ${status} successfully`);
      fetchEnrollments();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`Failed to ${status} enrollment`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/enrollments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success("Enrollment deleted successfully");
      fetchEnrollments();
    } catch (error) {
      console.error("Error deleting enrollment:", error);
      if (error.response?.status === 404) {
        toast.error("Enrollment not found");
      } else if (error.response?.status === 403) {
        toast.error("Admin access required");
      } else {
        toast.error("Failed to delete enrollment");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-center" />
      <h1 className="text-2xl font-bold mb-6">Enrollment Management</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {enrollment.user?.firstName} {enrollment.user?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{enrollment.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                      <span>{enrollment.subject}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span>
                        {new Date(enrollment.year, enrollment.month - 1).toLocaleString('default', { month: 'long' })} {enrollment.year}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      enrollment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      enrollment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setImageLoading(true);
                          setSelectedImage(enrollment.imageUrl);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                        title="View ID"
                        disabled={imageLoading}
                      >
                        {imageLoading && enrollment.imageUrl === selectedImage ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4 mr-1" />
                        )}
                        View
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(enrollment._id, enrollment.status === 'approved' ? 'rejected' : 'approved')}
                        className={`${
                          enrollment.status === 'approved' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        } flex items-center px-2 py-1 rounded-md hover:bg-gray-50 transition-colors`}
                        title={enrollment.status === 'approved' ? 'Reject' : 'Approve'}
                      >
                        {enrollment.status === 'approved' ? (
                          <X className="h-4 w-4 mr-1" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        {enrollment.status === 'approved' ? 'Reject' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleDelete(enrollment._id)}
                        className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => {
            setSelectedImage(null);
            setImageLoading(false);
          }}
        />
      )}
    </div>
  );
}