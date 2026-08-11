import type { OrderStatus } from "@/models/Order";

export const orderStatusTransitions: Record<
  OrderStatus,
  OrderStatus[]
> = {
  pending: ["cancelled"],

  confirmed: [
    "preparing",
    "cancelled",
  ],

  preparing: [
    "ready",
    "cancelled",
  ],

  ready: ["completed"],

  completed: [],

  cancelled: [],
};