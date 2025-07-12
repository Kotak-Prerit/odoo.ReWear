import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  tags: string[];
  size: string;
  price: number;
  currency: string;
  owner: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  points: number;
  avatar?: string;
}

const SwapPage = () => {
  const navigate = useNavigate();
  const [user] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [products, setProducts] = useState<Item[]>([]);
  const [userProducts, setUserProducts] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
  const [selectedUserProduct, setSelectedUserProduct] = useState<string>("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/items?excludeOwn=true`);

      if (response.ok) {
        const data = await response.json();
        const filteredProducts =
          data.items?.filter(
            (product: Item) => product.owner._id !== user?._id
          ) || [];
        setProducts(filteredProducts);
      } else {
        throw new Error("Failed to fetch products");
      }
    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProducts = useCallback(async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/items/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserProducts(data);
      }
    } catch (err) {
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchUserProducts();
    }
  }, [fetchProducts, fetchUserProducts, user]);

  const handleSwapClick = (product: Item) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (userProducts.length === 0) {
      alert("You have no products to swap with this product");
      return;
    }

    setSelectedProduct(product);
    setShowSwapModal(true);
  };

  const handleSwapSubmit = async () => {
    if (!selectedUserProduct || !selectedProduct || !user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/swaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetItem: selectedProduct._id,
          requesterItem: selectedUserProduct,
        }),
      });

      if (response.ok) {
        alert("Swap request sent successfully!");
        setShowSwapModal(false);
        setSelectedProduct(null);
        setSelectedUserProduct("");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Swap request failed");
      }
    } catch (err) {
      alert("Swap request failed. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Please Login
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the swap page.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div
              onClick={() => navigate("/")}
              className="text-2xl font-bold text-blue-700 cursor-pointer hover:text-blue-800 transition-colors"
            >
              ReWear
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/list-item")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                List Item
              </button>
              {user && (
                <span className="text-blue-600 font-semibold">
                  Points: ₹{user.points}
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Swap Products
          </h1>
          <p className="text-gray-600">
            Find products you'd like to swap with your items
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                          <span className="text-gray-500 text-lg">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        {product.condition}
                      </div>
                    </div>

                    <h3
                      className="font-semibold text-gray-800 mb-2 truncate"
                      title={product.title}
                    >
                      {product.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        Size {product.size}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-gray-500 text-sm">
                        Owner: {product.owner.username || product.owner.email}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 font-bold">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={() => handleSwapClick(product)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                      >
                        Swap
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">
                  No products available for swapping at the moment.
                </p>
                <button
                  onClick={() => navigate("/list-item")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  List Your First Item
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Swap Modal */}
      {showSwapModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Select Product to Swap with "{selectedProduct.title}"
            </h3>

            <div className="space-y-3 mb-6">
              {userProducts.map((userProduct) => (
                <label
                  key={userProduct._id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedUserProduct === userProduct._id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="swapProduct"
                    value={userProduct._id}
                    checked={selectedUserProduct === userProduct._id}
                    onChange={(e) => setSelectedUserProduct(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-3">
                    {userProduct.images && userProduct.images[0] ? (
                      <img
                        src={userProduct.images[0]}
                        alt={userProduct.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm">
                        {userProduct.title}
                      </p>
                      <p className="text-gray-600 text-xs">
                        ₹{userProduct.price} • {userProduct.condition}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowSwapModal(false);
                  setSelectedProduct(null);
                  setSelectedUserProduct("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSwapSubmit}
                disabled={!selectedUserProduct}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  selectedUserProduct
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Send Swap Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwapPage;
