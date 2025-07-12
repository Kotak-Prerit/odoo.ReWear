import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fake carousel images
  const carouselImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=400&fit=crop",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=400&fit=crop",
  ];

  // Categories data
  const categories = [
    { name: "T-Shirts", icon: "👕" },
    { name: "Jeans", icon: "👖" },
    { name: "Crop-Top", icon: "👚" },
    { name: "Leggings", icon: "🩱" },
    { name: "Dresses", icon: "👗" },
    { name: "Shoes", icon: "👟" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowUserMenu(false);
    setUser(null);
    navigate("/");
  };

  const renderUserAvatar = () => {
    if (user && user.avatar) {
      return (
        <div
          className="relative"
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <img
            src={user.avatar}
            alt={user.username || user.email || "User"}
            className="h-10 w-10 rounded-full border-2 border-blue-400 shadow cursor-pointer"
          />
          {showUserMenu && (
            <div
              className="absolute right-0 top-10 z-50 bg-white rounded-lg shadow-lg border border-blue-100 min-w-[160px] py-2 px-4 animate-fade-in"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button
                className="block w-full text-left py-2 px-2 text-blue-700 hover:bg-blue-50 rounded"
                onClick={() => navigate("/dashboard")}
              >
                Profile
              </button>
              <button
                className="block w-full text-left py-2 px-2 text-red-600 hover:bg-red-50 rounded mt-1"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else if (user && (user.username || user.email)) {
      const letter = (user.username || user.email)[0].toUpperCase();
      return (
        <div
          className="relative"
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg border-2 border-blue-400 shadow cursor-pointer">
            {letter}
          </div>
          {showUserMenu && (
            <div
              className="absolute right-0 top-10 z-50 bg-white rounded-lg shadow-lg border border-blue-100 min-w-[160px] py-2 px-4 animate-fade-in"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <button
                className="block w-full text-left py-2 px-2 text-blue-700 hover:bg-blue-50 rounded"
                onClick={() => navigate("/dashboard")}
              >
                Profile
              </button>
              <button
                className="block w-full text-left py-2 px-2 text-red-600 hover:bg-red-50 rounded mt-1"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-blue-300 animate-gradient-move">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur-md shadow-lg rounded-b-2xl border-b border-blue-100 relative">
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
        <div className="flex items-center space-x-6">
          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => navigate("/swap")}
              className="text-blue-700 hover:text-blue-900 font-semibold transition-colors"
            >
              Start Swapping
            </button>
            <button
              onClick={() => navigate("/browse")}
              className="text-blue-700 hover:text-blue-900 font-semibold transition-colors"
            >
              Browse Items
            </button>
            <button
              onClick={() => navigate("/list-item")}
              className="text-blue-700 hover:text-blue-900 font-semibold transition-colors"
            >
              List an Item
            </button>
          </nav>

          {/* User Authentication */}
          <div className="flex items-center space-x-4 relative">
            {user ? (
              renderUserAvatar()
            ) : (
              <>
                <button
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 active:scale-95 transition-all duration-150"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  className="px-5 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 active:scale-95 transition-all duration-150"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="px-8 py-4">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            placeholder="Search for clothes, brands, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-full border-2 border-blue-200 focus:border-blue-500 focus:outline-none bg-white/80 backdrop-blur-sm shadow-lg text-lg"
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="px-8 py-4">
        <div className="max-w-6xl mx-auto relative">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-blue-100">
            <div className="relative h-64 md:h-80">
              <img
                src={carouselImages[currentImageIndex]}
                alt="Featured clothing"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  Discover Amazing Fashion
                </h2>
              </div>
              {/* Carousel Navigation */}
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) =>
                      (prev - 1 + carouselImages.length) % carouselImages.length
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Previous image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prev) => (prev + 1) % carouselImages.length
                  )
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Next image"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            {/* Carousel Indicators */}
            <div className="flex justify-center py-4 space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Listings Section */}
      <div className="px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
            Product Listings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder product cards */}
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">Product Image</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Product Title
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  Product description will go here...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">$29.99</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 bg-white/60 backdrop-blur-md text-center text-gray-600 mt-auto shadow-inner border-t border-blue-100">
        <span className="font-semibold text-blue-700">
          &copy; {new Date().getFullYear()} ReWear
        </span>
        . All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
