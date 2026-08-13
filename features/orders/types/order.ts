import type {
  OrderStatus,
  OrderType,
  PaymentStatus,
} from "@/models/Order";

export interface OrderItem {
  menuItem?: string;

  name: string;
  price: number;
  quantity: number;
}

export interface OrderCateringInfo {
  requestId?: string;

  eventDate: string;
  guestCount: number;

  notes?: string;
}

export interface CustomerOrder {
  id: string;

  orderType: OrderType;

  items: OrderItem[];

  pickupDate?: string;
  pickupTime?: string;

  catering?: OrderCateringInfo;

  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  createdAt: string;
}

export interface AdminOrder {
  id: string;

  orderType: OrderType;

  customer?: string;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  items: OrderItem[];

  pickupDate?: string;
  pickupTime?: string;

  catering?: OrderCateringInfo;

  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  notes?: string;

  createdAt: string;
}