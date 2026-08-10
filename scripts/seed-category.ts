import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "@/models/Category";

dotenv.config({ path: ".env.local" });

async function seedCategory() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  await mongoose.connect(mongodbUri);

  console.log("Connected to MongoDB");

  const category = await Category.create({
    name: "Main Course",
    slug: "main-course",
    isActive: true,
  });

  console.log("Category created:");
  console.log(category);

  await mongoose.disconnect();

  console.log("Disconnected from MongoDB");
}

seedCategory().catch((error) => {
  console.error("Failed to seed category:", error);
  process.exit(1);
});