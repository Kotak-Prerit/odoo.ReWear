import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Item | null>(null);
  const [user, setUser] = useState<User | null>(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [userProducts, setUserProducts] = useState<Item[]>([]);
  const [allProducts, setAllProducts] = useState<Item[]>([]);
  const [selectedSwapProduct, setSelectedSwapProduct] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/items/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          throw new Error("Product not found");
        }
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchUserProducts = async () => {
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
    };

    fetchUserProducts();
  }, [user]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch("/api/items");
        if (response.ok) {
          const data = await response.json();
          if (data.items && Array.isArray(data.items)) {
            const filteredProducts = data.items
              .filter((item: Item) => item._id !== id)
              .slice(0, 8);
            setAllProducts(filteredProducts);
          }
        }
      } catch (err) {
      }
    };

    fetchAllProducts();
  }, [id]);

  const handleSwap = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (userProducts.length === 0) {
      alert("You have no products to swap with this product");
      return;
    }

    setShowSwapModal(true);
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!product) return;

    if (user.points < product.price) {
      alert(
        `Insufficient points! You need ₹${product.price} but have only ₹${user.points}`
      );
      return;
    }

    if (
      confirm(
        `Are you sure you want to purchase ${product.title} for ₹${product.price}?`
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/items/${product._id}/purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const updatedUser = { ...user, points: data.newBalance };
          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUser(updatedUser);
          alert("Purchase successful!");
          navigate("/dashboard");
        } else {
          const errorData = await response.json();
          alert(errorData.message || "Purchase failed");
        }
      } catch (err) {
        alert("Purchase failed. Please try again.");
      }
    }
  };

  const handleSwapSubmit = async () => {
    if (!selectedSwapProduct || !product || !user) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/swaps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetItem: product._id,
          requesterItem: selectedSwapProduct,
        }),
      });

      if (response.ok) {
        alert("Swap request sent successfully!");
        setShowSwapModal(false);
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Swap request failed");
      }
    } catch (err) {
      alert("Swap request failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Product not found"}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && user._id === product.owner._id;

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
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-blue-600 font-semibold">
                  Points: ₹{user.points}
                </span>
              )}
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Product Details */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-xl overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                    <span className="text-gray-500 text-xl">No Image</span>
                  </div>
                )}
              </div>

              {/* Image thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span>
                    By {product.owner.username || product.owner.email}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Category</h4>
                    <p className="text-gray-600">{product.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Condition</h4>
                    <p className="text-gray-600">{product.condition}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Size</h4>
                    <p className="text-gray-600">{product.size}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Price</h4>
                    <p className="text-blue-600 font-bold text-xl">
                      ₹{product.price}
                    </p>
                  </div>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isOwner && (
                <div className="flex space-x-4 pt-6">
                  <button
                    onClick={handlePurchase}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Buy for ₹{product.price}
                  </button>
                  <button
                    onClick={handleSwap}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Swap Product
                  </button>
                </div>
              )}

              {isOwner && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-center">
                    This is your product. You cannot purchase or swap with your
                    own item.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            More Products You Might Like
          </h2>

          {allProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {allProducts.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/product/${item._id}`)}
                >
                  <div className="rounded-t-xl h-48 overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="mb-2">
                      <span className="text-blue-600 font-bold text-lg">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-2 capitalize">
                        ({item.condition})
                      </span>
                    </div>

                    <div className="flex gap-1 flex-wrap mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {item.size}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${item._id}`);
                      }}
                      className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No other products available at the moment.
              </p>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/browse")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Browse All Products
            </button>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Select Product to Swap</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {userProducts.map((userProduct) => (
                <label
                  key={userProduct._id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSwapProduct === userProduct._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="swapProduct"
                    value={userProduct._id}
                    checked={selectedSwapProduct === userProduct._id}
                    onChange={(e) => setSelectedSwapProduct(e.target.value)}
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
                        ₹{userProduct.price}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSwapModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSwapSubmit}
                disabled={!selectedSwapProduct}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                  selectedSwapProduct
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

export default ProductDetail;
