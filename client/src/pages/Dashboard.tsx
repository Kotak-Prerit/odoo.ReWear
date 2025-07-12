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
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Purchase {
  _id: string;
  buyer: {
    _id: string;
    username: string;
    email: string;
  };
  seller: {
    _id: string;
    username: string;
    email: string;
  };
  item: Item;
  purchasePrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface SwapRequest {
  _id: string;
  requester: {
    _id: string;
    username: string;
    email: string;
  };
  requestedItem: Item & {
    owner: {
      _id: string;
      username: string;
      email: string;
    };
  };
  offeredItem: Item;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const [myListings, setMyListings] = useState<Item[]>([]);
  const [myPurchases, setMyPurchases] = useState<Purchase[]>([]);
  const [outgoingSwapRequests, setOutgoingSwapRequests] = useState<
    SwapRequest[]
  >([]);
  const [incomingSwapRequests, setIncomingSwapRequests] = useState<
    SwapRequest[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyListings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/items/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyListings(data);
      } else {
        throw new Error("Failed to fetch listings");
      }
    } catch (err) {
      setError("Failed to load your listings");
    }
  }, []);

  const fetchMyPurchases = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/purchases/my-purchases", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMyPurchases(data);
      } else {
        throw new Error("Failed to fetch purchases");
      }
    } catch (err) {
      setError("Failed to load your purchases");
    }
  }, []);

  const fetchOutgoingSwapRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/swaps/my-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOutgoingSwapRequests(data);
      } else {
        throw new Error("Failed to fetch outgoing swap requests");
      }
    } catch (err) {
      setError("Failed to load your swap requests");
    }
  }, []);

  const fetchIncomingSwapRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/swaps/received", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIncomingSwapRequests(data);
      } else {
        throw new Error("Failed to fetch incoming swap requests");
      }
    } catch (err) {
      setError("Failed to load received swap requests");
    }
  }, []);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const loadData = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        if (user && user.email) {
          await Promise.all([
            fetchMyListings(),
            fetchMyPurchases(),
            fetchOutgoingSwapRequests(),
            fetchIncomingSwapRequests(),
          ]);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load data");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [
    fetchMyListings,
    fetchMyPurchases,
    fetchOutgoingSwapRequests,
    fetchIncomingSwapRequests,
    user,
  ]);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMyListings((prev) => prev.filter((item) => item._id !== itemId));
        alert("Item deleted successfully!");
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (err) {
      alert("Failed to delete item. Please try again.");
    }
  }, []);

  const handleSwapResponse = useCallback(
    async (swapId: string, status: "accepted" | "rejected") => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/swaps/${swapId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });

        if (response.ok) {
          const data = await response.json();
          alert(data.message);
          await Promise.all([
            fetchIncomingSwapRequests(),
            fetchOutgoingSwapRequests(),
            fetchMyListings(), // Refresh listings as items might have been swapped
          ]);
        } else {
          const errorData = await response.json();
          alert(errorData.message || `Failed to ${status} swap request`);
        }
      } catch (err) {
        alert(`Failed to ${status} swap request. Please try again.`);
      }
    },
    [fetchIncomingSwapRequests, fetchOutgoingSwapRequests, fetchMyListings]
  );

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
                  ₹{user.points || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* My Listings Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-800">My Listings</h2>
            <button
              onClick={() => navigate("/list-item")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New Item
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-blue-600 text-lg">
                Loading your listings...
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 text-lg">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : myListings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600 text-lg mb-4">
                You haven't listed any items yet.
              </div>
              <button
                onClick={() => navigate("/list-item")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                List Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myListings.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <div className="rounded-lg h-40 mb-4 overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
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
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-item/${item._id}`)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Purchases Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            My Purchases
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-blue-600 text-lg">
                Loading your purchases...
              </div>
            </div>
          ) : myPurchases.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600 text-lg mb-4">
                You haven't made any purchases yet.
              </div>
              <button
                onClick={() => navigate("/")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {myPurchases.map((purchase) => (
                <div
                  key={purchase._id}
                  className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4 hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <div className="rounded-lg h-40 mb-4 overflow-hidden">
                    {purchase.item.images && purchase.item.images.length > 0 ? (
                      <img
                        src={purchase.item.images[0]}
                        alt={purchase.item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {purchase.item.title}
                  </h3>
                  <div className="mb-2">
                    <span className="text-green-600 font-bold text-lg">
                      ₹{purchase.purchasePrice}
                    </span>
                    <span className="text-sm text-gray-500 ml-2 capitalize">
                      ({purchase.item.condition})
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">
                      Purchased from:{" "}
                      {purchase.seller.username || purchase.seller.email}
                    </span>
                  </div>
                  <div className="mb-3 flex gap-1 flex-wrap">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {purchase.item.category}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {purchase.item.size}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">
                      Purchased:{" "}
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => navigate(`/product/${purchase.item._id}`)}
                      className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Outgoing Swap Requests Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8 mt-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            My Swap Requests
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-blue-600 text-lg">
                Loading swap requests...
              </div>
            </div>
          ) : outgoingSwapRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600 text-lg mb-4">
                You haven't made any swap requests yet.
              </div>
              <button
                onClick={() => navigate("/swap")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Swapping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {outgoingSwapRequests.map((swapRequest) => (
                <div
                  key={swapRequest._id}
                  className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Your Item */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Your Item
                      </h4>
                      <div className="flex items-center space-x-3">
                        {swapRequest.offeredItem.images &&
                        swapRequest.offeredItem.images[0] ? (
                          <img
                            src={swapRequest.offeredItem.images[0]}
                            alt={swapRequest.offeredItem.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs">
                              No img
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">
                            {swapRequest.offeredItem.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹{swapRequest.offeredItem.price}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center">
                      <span className="text-2xl text-gray-400">⇄</span>
                    </div>

                    {/* Requested Item */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Requested Item
                      </h4>
                      <div className="flex items-center space-x-3">
                        {swapRequest.requestedItem.images &&
                        swapRequest.requestedItem.images[0] ? (
                          <img
                            src={swapRequest.requestedItem.images[0]}
                            alt={swapRequest.requestedItem.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500 text-xs">
                              No img
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold">
                            {swapRequest.requestedItem.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            ₹{swapRequest.requestedItem.price}
                          </p>
                          <p className="text-xs text-gray-500">
                            Owner:{" "}
                            {swapRequest.requestedItem.owner.username ||
                              swapRequest.requestedItem.owner.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col justify-center items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          swapRequest.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : swapRequest.status === "accepted" ||
                              swapRequest.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {swapRequest.status.charAt(0).toUpperCase() +
                          swapRequest.status.slice(1)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(swapRequest.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming Swap Requests Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-blue-100 p-8 mt-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            Swap Requests Received
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-blue-600 text-lg">
                Loading received requests...
              </div>
            </div>
          ) : incomingSwapRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-600 text-lg">
                No swap requests received yet.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingSwapRequests.map((swapRequest) => (
                <div
                  key={swapRequest._id}
                  className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg border border-blue-100 p-4"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          Swap request from{" "}
                          {swapRequest.requester.username ||
                            swapRequest.requester.email}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {swapRequest.requester.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Requested:{" "}
                          {new Date(swapRequest.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          swapRequest.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : swapRequest.status === "accepted" ||
                              swapRequest.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {swapRequest.status.charAt(0).toUpperCase() +
                          swapRequest.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Their Item */}
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-700 mb-2">
                          They're offering:
                        </h5>
                        <div className="flex items-center space-x-3">
                          {swapRequest.offeredItem.images &&
                          swapRequest.offeredItem.images[0] ? (
                            <img
                              src={swapRequest.offeredItem.images[0]}
                              alt={swapRequest.offeredItem.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                No img
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">
                              {swapRequest.offeredItem.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              ₹{swapRequest.offeredItem.price}
                            </p>
                            <p className="text-xs text-gray-500">
                              {swapRequest.offeredItem.condition}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex items-center justify-center">
                        <span className="text-2xl text-gray-400">⇄</span>
                      </div>

                      {/* Your Item */}
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-700 mb-2">
                          For your item:
                        </h5>
                        <div className="flex items-center space-x-3">
                          {swapRequest.requestedItem.images &&
                          swapRequest.requestedItem.images[0] ? (
                            <img
                              src={swapRequest.requestedItem.images[0]}
                              alt={swapRequest.requestedItem.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                No img
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">
                              {swapRequest.requestedItem.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              ₹{swapRequest.requestedItem.price}
                            </p>
                            <p className="text-xs text-gray-500">
                              {swapRequest.requestedItem.condition}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {swapRequest.status === "pending" && (
                      <div className="flex space-x-3 mt-4">
                        <button
                          onClick={() =>
                            handleSwapResponse(swapRequest._id, "accepted")
                          }
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Accept Swap
                        </button>
                        <button
                          onClick={() =>
                            handleSwapResponse(swapRequest._id, "rejected")
                          }
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          Reject Swap
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
