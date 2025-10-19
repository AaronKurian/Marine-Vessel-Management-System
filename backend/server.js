const express = require("express");
const cors = require("cors");

// Import routes
const signup = require("./routes/auth/signup");
const login = require("./routes/auth/login.js");
const vessels = require('./routes/vessels');
const users = require('./routes/users');
const ports = require('./routes/ports');
const voyages = require('./routes/voyages');


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
app.use('/vessels', vessels);
app.use('/users', users);
app.use('/ports', ports);
app.use('/voyages', voyages);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
