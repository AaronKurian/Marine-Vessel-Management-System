const express = require("express");
const cors = require("cors");

// Import routes
const signup = require("./routes/auth/signup");
const login = require("./routes/auth/login.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Use routes
app.use("/signup", signup);
app.use("/login", login);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
