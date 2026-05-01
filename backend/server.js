const express = require("express");
const app = express();

app.use(express.json());

// ✅ Add this
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// your routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running"));