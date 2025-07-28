import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

function ProductOverview() {
  const params = useParams();
  const productId = params.id;
  const [status , useStatus] = useState("loading");
  const [product , setProduct] = useState(null);
  const [error , setError] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`).then((response) => {
      console.log(response.data);
      setProduct(response.data);
      useStatus("success");
    }).catch((error) => {
      console.error("Error fetching product data:", error);
      setError(error);
      toast.error("Error fetching product details");
    });
  }, [
    productId
  ]);
   
  return (
    <div className="bg-primary text-accent">
      <h1>Product Overview {JSON.stringify(product)}</h1>
    </div>
  )
}

export default ProductOverview;