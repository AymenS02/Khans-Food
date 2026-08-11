export interface CustomerOrder {
  id: string;

  orderType: "regular" | "catering";

  items: {
    menuItem: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  pickupDate: string;
  pickupTime: string;

  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;

  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  createdAt: string;
}

export interface AdminOrder {
  id: string;

  orderType: "regular" | "catering";

  customer?: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  items: {
    menuItem: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  pickupDate: string;
  pickupTime: string;

  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;

  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";

  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "refunded";

  notes?: string;

  createdAt: string;
}