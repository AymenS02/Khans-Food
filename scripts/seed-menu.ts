import dotenv from "dotenv";
import mongoose from "mongoose";
import MenuItem from "@/models/MenuItem";
import Category from "@/models/Category";

dotenv.config({
  path: ".env.local",
});

async function seedMenuItem() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  await mongoose.connect(mongodbUri);

  console.log("Connected to MongoDB");

  const category = await Category.findOne({
    slug: "main-course",
  });

  if (!category) {
    throw new Error(
      'Category "main-course" does not exist. Run npm run seed:category first.'
    );
  }

  const menuItem = await MenuItem.create({
    name: "Chicken Biryani",

    slug: "chicken-biryani",

    description:
      "Fragrant basmati rice with seasoned chicken.",

    price: 15,

    categoryId: category._id,

    available: true,

    displayOrder: 1,
  });

  console.log("Menu item created:");
  console.log(menuItem);

  await mongoose.disconnect();

  console.log("Disconnected from MongoDB");
}

seedMenuItem().catch((error) => {
  console.error("Failed to seed menu item:", error);
  process.exit(1);
});