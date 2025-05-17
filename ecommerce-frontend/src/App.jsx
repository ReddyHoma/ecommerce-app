import { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

export default function App() {
  const [activeTab, setActiveTab] = useState("form");
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Function to fetch products based on query (or all if empty)
  const fetchProducts = async (query = "") => {
    const url = query
      ? `http://localhost:5000/products/search?q=${encodeURIComponent(query)}`
      : "http://localhost:5000/products";

    try {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  // Fetch products when switching to list tab
  useEffect(() => {
    if (activeTab === "list") {
      fetchProducts(searchQuery);
    }
  }, [activeTab]);

  // Fetch products when search query changes
  useEffect(() => {
    if (activeTab === "list") {
      const delayDebounce = setTimeout(() => {
        fetchProducts(searchQuery);
      }, 300); // Add debounce to reduce API calls

      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery]);

  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-green-600">Mini E-Commerce</h1>

      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-l-lg ${activeTab === "form"
            ? "bg-green-500 text-white"
            : "bg-white text-gray-700 border"
            }`}
          onClick={() => setActiveTab("form")}
        >
          Add Product
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${activeTab === "list"
            ? "bg-green-500 text-white"
            : "bg-white text-gray-700 border"
            }`}
          onClick={() => setActiveTab("list")}
        >
          View Products
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        {activeTab === "form" ? (
          <ProductForm onAddProduct={handleAddProduct} />
        ) : (
          <>
            <input
              type="text"
              placeholder="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border mb-4 p-2 rounded"
            />
            <ProductList products={products} />
          </>
        )}
      </div>
    </div>
  );
}
