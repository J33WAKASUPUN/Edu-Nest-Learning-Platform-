"use client"

import { useEffect, useState } from "react"
import { Loader2, X, AlertCircle, ZoomIn, ZoomOut, Download } from "lucide-react"

export default function ImageModal({ imageUrl, onClose, title = "Document Preview" }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    // Handle escape key press
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)

    // Handle click outside modal content
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        onClose()
      }
    }
    window.addEventListener("mousedown", handleOutsideClick)

    // Trigger fade-in animation after mount
    setTimeout(() => setFadeIn(true), 10)

    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleEscape)
      window.removeEventListener("mousedown", handleOutsideClick)
      document.body.style.overflow = "auto"
    }
  }, [onClose])

  const handleImageLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleImageError = () => {
    setLoading(false)
    setError(true)
  }

  const toggleZoom = () => {
    setZoomed(!zoomed)
  }

  const downloadImage = () => {
    if (error || !imageUrl) return

    const link = document.createElement("a")
    link.href = imageUrl
    link.download = "document-image.jpg" // Default name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${fadeIn ? "opacity-100" : "opacity-0"} modal-backdrop`}
    >
      <div
        className={`bg-white dark:bg-gray-900 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl transition-transform duration-300 ${fadeIn ? "scale-100" : "scale-95"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b dark:border-gray-700 p-4 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <div className="flex items-center gap-2">
            {!error && (
              <>
                <button
                  onClick={toggleZoom}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title={zoomed ? "Zoom out" : "Zoom in"}
                >
                  {zoomed ? (
                    <ZoomOut className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <ZoomIn className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                <button
                  onClick={downloadImage}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Download image"
                >
                  <Download className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Close"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`relative overflow-auto ${zoomed ? "h-[70vh]" : "h-[60vh]"}`}>
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading document...</p>
            </div>
          )}

          {error ? (
            <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800/30">
              <div className="text-red-500 mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-full">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">Unable to Load Document</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                The document could not be displayed. It may be unavailable or you may not have permission to view it.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div
              className={`flex items-center justify-center min-h-full transition-all duration-300 ease-in-out ${zoomed ? "overflow-auto" : "overflow-hidden"}`}
            >
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Document preview"
                className={`max-w-full object-contain transition-all duration-300 ${loading ? "opacity-0" : "opacity-100"} ${zoomed ? "max-h-none cursor-zoom-out" : "max-h-[60vh] cursor-zoom-in"}`}
                onClick={toggleZoom}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t dark:border-gray-700 p-4 flex justify-between items-center sticky bottom-0 bg-white dark:bg-gray-900">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {!error && !loading && "Click image to toggle zoom"}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}