import { useState } from "react";

export default function ProductForm({ onAddProduct }) {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        image_url: "",
    });
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await fetch("http://localhost:5000/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: "success", text: "Product added successfully!" });
                setProduct({ name: "", price: "", description: "", image_url: "" });
                onAddProduct(data);
            } else {
                setMessage({ type: "error", text: data.message || "Something went wrong." });
            }
        } catch {
            setMessage({ type: "error", text: "Failed to connect to server." });
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div
                    className={`p-2 rounded text-sm ${message.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {message.text}
                </div>
            )}
            <input
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border rounded p-2"
                required
            />
            <input
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Price"
                type="number"
                className="w-full border rounded p-2"
                required
            />
            <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded p-2"
            />
            <input
                name="image_url"
                value={product.image_url}
                onChange={handleChange}
                placeholder="Image URL (optional)"
                className="w-full border rounded p-2"
            />
            <button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                {isLoading ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
}
