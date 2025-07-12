const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./database/.env" });
const connectDB = require("./database/db");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const itemRoutes = require("./routes/itemRoutes");
const swapRoutes = require("./routes/swapRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Placeholder route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/purchases", purchaseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});
