import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/productCard";


export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products`
        );
        setProducts(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array for one-time fetch on mount

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}