export type CateringRequestStatus =
  | "submitted"
  | "reviewing"
  | "approved"
  | "rejected"
  | "cancelled";

export type CateringSelectionType =
  | "package"
  | "custom";

export interface AdminCateringRequest {
  id: string;

  customer?: string;

  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  eventDate: string;
  guestCount: number;

  selectionType:
    CateringSelectionType;

  package?: {
    name: string;
    price: number;

    pricingType:
      | "flat"
      | "per_person";
  };

  customItems: {
    name: string;
    price: number;

    pricingType:
      | "flat"
      | "per_person";

    quantity: number;
  }[];

  notes?: string;
  adminNotes?: string;

  status:
    CateringRequestStatus;

  quotedSubtotal?: number;
  taxRate?: number;
  tax?: number;
  quotedTotal?: number;

  order?: string;

  createdAt: string;
}