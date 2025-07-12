import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [showUserMenu, setShowUserMenu] = useState(false);

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
        <div className="space-x-4 flex items-center relative">
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
      </nav>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-2xl mt-12 mb-8 border border-blue-100">
          <h1 className="text-5xl font-extrabold mb-6 text-blue-800 drop-shadow-lg tracking-tight">
            Welcome to <span className="text-green-600">ReWear</span>
          </h1>
          <p className="mb-10 text-xl text-gray-700 max-w-2xl">
            ReWear is your community clothing exchange platform. List unused
            clothes, request swaps, and redeem items using points. Join a
            sustainable fashion movement today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center mb-6">
            <button
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-150"
              onClick={() => navigate("/swap")}
            >
              Start Swapping
            </button>
            <button
              className="px-8 py-3 bg-blue-500 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-blue-600 active:scale-95 transition-all duration-150"
              onClick={() => navigate("/browse")}
            >
              Browse Items
            </button>
            <button
              className="px-8 py-3 bg-green-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-green-700 active:scale-95 transition-all duration-150"
              onClick={() => navigate("/list-item")}
            >
              List an Item
            </button>
          </div>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 mt-2 justify-center">
              <button
                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-150"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button
                className="px-8 py-3 bg-green-600 text-white rounded-xl text-lg font-bold shadow-lg hover:bg-green-700 active:scale-95 transition-all duration-150"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </main>

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
