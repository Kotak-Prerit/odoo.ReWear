import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const renderUserAvatar = () => {
    if (user && user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.username || user.email || "User"}
          className="w-32 h-32 rounded-full border-4 border-blue-400 shadow-lg"
        />
      );
    } else if (user && (user.username || user.email)) {
      const letter = (user.username || user.email)[0].toUpperCase();
      return (
        <div className="w-32 h-32 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-4xl border-4 border-blue-400 shadow-lg">
          {letter}
        </div>
      );
    }
    return (
      <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-300 text-gray-600 font-bold text-4xl border-4 border-gray-400 shadow-lg">
        ?
      </div>
    );
  };

  // Mock data for listings and purchases
  const myListings = [
    {
      id: 1,
      title: "Blue Denim Jacket",
      price: "$45",
      image: "/placeholder1.jpg",
    },
    {
      id: 2,
      title: "Red Summer Dress",
      price: "$35",
      image: "/placeholder2.jpg",
    },
    {
      id: 3,
      title: "Black Sneakers",
      price: "$60",
      image: "/placeholder3.jpg",
    },
    { id: 4, title: "White T-Shirt", price: "$20", image: "/placeholder4.jpg" },
  ];

  const myPurchases = [
    { id: 1, title: "Green Hoodie", price: "$40", image: "/placeholder5.jpg" },
    { id: 2, title: "Brown Boots", price: "$80", image: "/placeholder6.jpg" },
    { id: 3, title: "Pink Crop Top", price: "$25", image: "/placeholder7.jpg" },
    { id: 4, title: "Dark Jeans", price: "$50", image: "/placeholder8.jpg" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-100 to-blue-300">
      {/* Header */}
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
          <div className="flex items-center space-x-4">
            <span className="text-blue-700 font-semibold">User Dashboard</span>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 py-8">
        {/* User Profile Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex justify-center md:justify-start">
              {renderUserAvatar()}
            </div>

            {/* User Details */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-lg p-4 border border-blue-100">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Username
                </label>
                <p className="text-lg font-medium text-gray-800">
                  {user.username || "Not set"}
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4 border border-blue-100">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Email
                </label>
                <p className="text-lg font-medium text-gray-800">
                  {user.email || "Not set"}
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4 border border-blue-100">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Phone
                </label>
                <p className="text-lg font-medium text-gray-800">
                  {user.phone || "Not set"}
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4 border border-blue-100">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Location
                </label>
                <p className="text-lg font-medium text-gray-800">
                  {user.location || "Not set"}
                </p>
              </div>
              <div className="bg-white/50 rounded-lg p-4 border border-blue-100 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Points Balance
                </label>
                <p className="text-2xl font-bold text-blue-600">
                  {user.points || 0} Points
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">My Listings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <div className="bg-gray-200 rounded-lg h-40 mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Item Image</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-blue-600 font-bold text-lg">{item.price}</p>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Edit
                  </button>
                  <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Purchases Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            My Purchases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myPurchases.map((item) => (
              <div
                key={item.id}
                className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <div className="bg-gray-200 rounded-lg h-40 mb-4 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Item Image</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-green-600 font-bold text-lg">{item.price}</p>
                <div className="mt-3">
                  <button className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
