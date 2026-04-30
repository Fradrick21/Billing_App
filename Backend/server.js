const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.use(cors());
app.use(express.json());

app.use("/products", require("./routes/productRoutes"));
app.use("/bills", require("./routes/billingRoutes"));
app.use("/reports", require("./routes/reportRoutes"));
app.use("/auth", require("./routes/authRoutes"));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time");
    res.json({ ok: true, serverTime: result.rows[0].server_time });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(500).json({
      ok: false,
      code: error.code,
      message: error.message,
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled request error:", err);
  res.status(500).json({ message: "Internal server error" });
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

const server = app.listen(PORT, HOST, (error) => {
  if (error) {
    handleStartupError(error);
    return;
  }

  console.log(`Server running on ${HOST}:${PORT}`);
});

server.on("error", handleStartupError);

function handleStartupError(error) {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the other Node process or set a different PORT.`);
  } else {
    console.error("Server failed to start:", error);
  }

  process.exit(1);
}
