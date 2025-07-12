import React from "react";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">
        Welcome, {user.username || user.email || "User"}!
      </h2>
      <p>Email: {user.email}</p>
      {user.avatar && (
        <img
          src={user.avatar}
          alt="avatar"
          className="w-24 h-24 rounded-full mt-4"
        />
      )}
      <p className="mt-4">Points: {user.points}</p>
      <p className="mt-2">Admin: {user.isAdmin ? "Yes" : "No"}</p>
    </div>
  );
};

export default Dashboard;
