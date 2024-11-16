const ComingSoon = () => {
  const products = [
    {
      id: "1",
      name: "Prawns",
      image: "../images/prawns.jpg",
      weight: "1000g",
      pieces: "6 - 8",
      servings: "3 - 4",
      price: "₹220",
    },
    {
      id: "2",
      name: "Crab",
      image: "../images/crab.jpg",
      weight: "1000g",
      pieces: "12 - 14",
      servings: "3 - 4",
      price: "₹600",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-center text-2xl font-bold mb-6">Coming Soon</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center mx-auto max-w-6xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-200 border border-gray-400 rounded-lg p-4 shadow-lg"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-lg mb-4 grayscale"
            />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoon;
