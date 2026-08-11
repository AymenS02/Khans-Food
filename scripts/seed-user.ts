import dotenv from "dotenv";
import mongoose from "mongoose";

import User from "../models/User";
import { hashPassword } from "../services/password.service";

dotenv.config({ path: ".env.local" });

const mongodbUri = process.env.MONGODB_URI ?? "";

if (!mongodbUri) {
  throw new Error("Missing MONGODB_URI environment variable");
}

async function seedUser() {
  try {
    await mongoose.connect(mongodbUri);

    console.log("Connected to MongoDB");

    const existingUser = await User.findOne({
      email: "aymenshoteri@gmail.com",
    }).select("+password");

    if (existingUser) {
      console.log("User already exists");
      return;
    }

    const password = await hashPassword("123456");

    await User.create({
      firstName: "Firsttest",
      lastName: "Lasttest",
      email: "aymenshoteri@gmail.com",
      phone: "2896891515",
      password,
      role: "customer",
      isActive: true,
      emailVerified: true,
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Failed to seed user:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedUser();