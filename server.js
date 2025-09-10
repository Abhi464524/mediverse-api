const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/doctor_patient_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }, // will store hashed password
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  isDoctor: { type: Boolean, required: true }
});

// Before saving hash password
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

// Routes
// Create new user (Doctor or Patient)
app.post("/api/users", async (req, res) => {
  try {
    const { username, password, email, contact, isDoctor } = req.body;

    const newUser = new User({ username, password, email, contact, isDoctor });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get doctors only
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ isDoctor: true });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patients only
app.get("/api/patients", async (req, res) => {
  try {
    const patients = await User.find({ isDoctor: false });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


