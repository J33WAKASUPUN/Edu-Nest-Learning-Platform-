import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  // Get the image to display (first image normally, second image on hover if available)
  const displayImage =
    product.images && product.images.length > 0
      ? isHovered && product.images.length > 1
        ? product.images[1]
        : product.images[0]
      : null;

  return (
    <Link to = {"/overview/"+product.productId}
      className="w-[300px] h-[450px] bg-white shadow-lg rounded-lg flex flex-col items-center justify-between p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      {displayImage ? (
        <div className="w-full h-[200px]">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
        </div>
      ) : (
        <div className="w-full h-[200px] flex items-center justify-center bg-gray-100 rounded-md">
          <p className="text-gray-500">No image available</p>
        </div>
      )}

      {/* Product Details */}
      <div className="flex flex-col items-center text-center flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-3 mt-1">
          {product.description}
        </p>
      </div>

      {/* Stock Status */}
      <p
        className={`text-sm font-medium ${
          product.isAvailable ? "text-green-600" : "text-red-600"
        }`}
      >
        {product.isAvailable ? "In Stock" : "Out of Stock"}
      </p>

      {/* Price Section */}
      <div className="flex items-center gap-2 mt-2">
        {product.labelledPrice && product.labelledPrice > product.price ? (
          <p className="text-gray-500 line-through text-sm">
            Rs. {product.labelledPrice.toFixed(2)}
          </p>
        ) : null}
        <p className="text-red-600 font-bold text-lg">
          Rs. {product.price.toFixed(2)}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          className={`px-4 py-2 rounded text-white ${
            product.isAvailable
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!product.isAvailable}
        >
          Add to Cart
        </button>
        <button
          className={`px-4 py-2 rounded text-white ${
            product.isAvailable
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!product.isAvailable}
        >
          Buy Now
        </button>
      </div>
    </Link>
  );
}