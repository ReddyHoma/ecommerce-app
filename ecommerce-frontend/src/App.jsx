import { useState, useEffect } from "react";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";

export default function App() {
    const [activeTab, setActiveTab] = useState("form");
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/products")
            .then((res) => res.json())
            .then(setProducts)
            .catch((err) => console.error("Failed to load products", err));
    }, []);

    const handleSearch = async () => {
        const res = await fetch(`http://localhost:5000/products/search?q=${searchQuery}`);
        const data = await res.json();
        setProducts(data);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-center mb-6 text-green-600">Mini E-Commerce</h1>

            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 rounded-l-lg ${activeTab === "form" ? "bg-green-500 text-white" : "bg-white text-gray-700 border"}`}
                    onClick={() => setActiveTab("form")}
                >
                    Add Product
                </button>
                <button
                    className={`px-4 py-2 rounded-r-lg ${activeTab === "list" ? "bg-green-500 text-white" : "bg-white text-gray-700 border"}`}
                    onClick={() => setActiveTab("list")}
                >
                    View Products
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
                {activeTab === "form" ? (
                    <ProductForm onAddProduct={(p) => setProducts((prev) => [...prev, p])} />
                ) : (
                    <>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                onClick={handleSearch}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Search
                            </button>
                        </div>
                        <ProductList products={products} />
                    </>
                )}
            </div>
        </div>
    );
}
