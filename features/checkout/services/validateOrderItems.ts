import { Types } from "mongoose";
import Menu from "@/models/MenuItem";
import { connectToDatabase } from "@/lib/mongodb";

export interface CartItemInput {
  menuItemId: string;
  quantity: number;
}

export interface ValidatedOrderItem {
  menuItem: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

interface ValidateOrderItemsResult {
  items: ValidatedOrderItem[];
  subtotal: number;
}

export async function validateOrderItems(
  cartItems: CartItemInput[]
): Promise<ValidateOrderItemsResult> {
  if (!cartItems.length) {
    throw new Error("Your cart is empty.");
  }

  for (const item of cartItems) {
    if (!Types.ObjectId.isValid(item.menuItemId)) {
      throw new Error("Invalid menu item.");
    }

    if (
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      throw new Error("Invalid item quantity.");
    }
  }

  await connectToDatabase();

  const menuItemIds = cartItems.map(
    (item) => new Types.ObjectId(item.menuItemId)
  );

  const menuItems = await Menu.find({
    _id: { $in: menuItemIds },
    available: true,
  }).lean();

  if (menuItems.length !== cartItems.length) {
    throw new Error(
      "One or more items are unavailable."
    );
  }

  const validatedItems: ValidatedOrderItem[] = [];

  let subtotal = 0;

  for (const cartItem of cartItems) {
    const menuItem = menuItems.find(
      (item) =>
        item._id.toString() === cartItem.menuItemId
    );

    if (!menuItem) {
      throw new Error(
        `${cartItem.menuItemId} is unavailable.`
      );
    }

    const itemTotal =
      menuItem.price * cartItem.quantity;

    subtotal += itemTotal;

    validatedItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: cartItem.quantity,
    });
  }

  return {
    items: validatedItems,
    subtotal,
  };
}