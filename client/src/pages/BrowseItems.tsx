import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

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
  status: string;
  owner: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const BrowseItems = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/items");
      if (response.ok) {
        const data = await response.json();

        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
          setFilteredItems(data.items);

          const uniqueCategories = [
            ...new Set(data.items.map((item: Item) => item.category)),
          ] as string[];
          setCategories(uniqueCategories);
        } else {
          setError("Invalid data format received from server");
        }
      } else {
        throw new Error("Failed to fetch items");
      }
    } catch (err) {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    let filtered = items;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    setFilteredItems(filtered);
  }, [items, selectedCategory, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-blue-300">
      {/* Navbar */}
      <header className="bg-white/60 backdrop-blur-md shadow-lg border-b border-blue-100 px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img
              src="/logo.svg"
              alt="ReWear Logo"
              className="h-12 w-12 mr-3 drop-shadow-lg"
            />
            <span className="text-2xl font-extrabold text-blue-700 tracking-wide drop-shadow">
              ReWear
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-blue-700 font-semibold hover:text-blue-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-blue-900 font-bold border-b-2 border-blue-900"
            >
              Browse Items
            </Link>
            {user && (
              <>
                <Link
                  to="/swap"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors"
                >
                  Swap
                </Link>
                <Link
                  to="/list-item"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors"
                >
                  List Item
                </Link>
                <Link
                  to="/dashboard"
                  className="text-blue-700 font-semibold hover:text-blue-900 transition-colors"
                >
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-blue-700 font-semibold">
                  Welcome, {user.username || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Browse Items
          </h1>
          <p className="text-lg text-gray-600">
            Discover amazing second-hand items from our community
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search items by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-semibold text-gray-700">
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                title="Filter by category"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}{" "}
              found
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-blue-600 text-xl">Loading items...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-600 text-xl mb-4">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-600 text-xl mb-4">
                  No items found matching your criteria.
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <div className="rounded-lg h-48 mb-4 overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 text-lg">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mb-3">
                      <span className="text-blue-600 font-bold text-xl">
                        ₹{item.price}
                      </span>
                      <span className="text-sm text-gray-500 ml-2 capitalize">
                        ({item.condition})
                      </span>
                    </div>

                    <div className="mb-3 flex gap-1 flex-wrap">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {item.size}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "available"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 mb-3">
                      Listed by: {item.owner.username || item.owner.email}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/product/${item._id}`);
                        }}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                      >
                        View Details
                      </button>
                      {user && user._id !== item.owner._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/swap", {
                              state: { selectedItem: item },
                            });
                          }}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                        >
                          Swap
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseItems;
