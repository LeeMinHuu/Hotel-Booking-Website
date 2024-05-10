const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());
app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const auth = require("./auth");

const errorController = require("./controllers/error");
const User = require("./models/user");

const dbConnect = require("./db/dbConnect");
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

const adminRoutes = require("./routes/admin");
const bookingRoutes = require("./routes/booking");

//Route for Admin and Booking page
app.use(adminRoutes);
app.use(bookingRoutes);

// BEGIN AUTH FUNC
// Signup API
app.post("/signup", async (req, res) => {
  const { username, password, fullName, phoneNumber, email, isAdmin } =
    req.body;
  try {
    let user = await User.findOne({ email });
    let usernameFind = await User.findOne({ username });
    if (user) {
      return res.status(400).send("Email already exists");
    }
    if (usernameFind) {
      return res.status(400).send("Username already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      password: hashedPassword,
      fullName,
      phoneNumber,
      email,
      isAdmin,
    });

    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }

    let loginData = {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      signInTime: Date.now(),
    };
    console.log(loginData);

    const token = jwt.sign(loginData, "secretKey");
    console.log(token);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Logout API
app.post("/logout", auth, (req, res) => {
  // Client will remove the token from local storage or cookies
  res.status(200).send("Logged out successfully");
});
// END AUTH FUNC

app.use(errorController.get404);

app.listen(5000);
