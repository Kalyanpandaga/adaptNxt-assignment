// scripts/createAdmin.js
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();
const { MONGO_URI } = require("../config/constants");
console.log(MONGO_URI);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");

    const existingAdmin = await User.findOne({ role: "ADMIN" });
    if (existingAdmin) {
      console.log("An admin already exists:", existingAdmin.emailId);
      return;
    }

    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      emailId: "admin@shoploom.com",
      password: "Admin@1234", // Must meet strong password criteria
      role: "ADMIN",
    });

    await admin.save();
    console.log("Admin user created successfully:", admin.emailId);
    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin user:", error);
    mongoose.disconnect();
  }
}

createAdmin();
