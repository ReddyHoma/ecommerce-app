export default function ProductList({ products }) {
    if (!products) return <p>Loading…</p>;
    if (products.length === 0) return <p>No products yet.</p>;

    return (
        <div className="space-y-4">
            {products.map((p) => (
                <div key={p.id} className="border p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">{p.name}</h2>
                    <p className="text-gray-600">{p.description}</p>
                    <span className="text-green-600 font-bold">Rs.{p.price}</span>
                    {p.image_url && (
                        <img
                            src={p.image_url}
                            alt={p.name}
                            className="mt-2 max-h-48 object-cover rounded"
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
