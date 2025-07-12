import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import ListItem from "./pages/ListItem";
import ProductDetail from "./pages/ProductDetail";
import SwapPage from "./pages/SwapPage";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/swap" element={<SwapPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/list-item"
        element={
          <ProtectedRoute>
            <ListItem />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
