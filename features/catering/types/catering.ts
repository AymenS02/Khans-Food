export type CateringPricingType =
  | "flat"
  | "per_person";

export interface PublicCateringItem {
  id: string;

  name: string;
  slug: string;

  description?: string;
  image?: string;

  price: number;
  pricingType: CateringPricingType;

  category?: string;

  minimumQuantity?: number;
}

export interface PublicCateringPackage {
  id: string;

  name: string;
  slug: string;

  description?: string;
  image?: string;

  price: number;
  pricingType: CateringPricingType;

  minimumGuests?: number;
  maximumGuests?: number;

  items: {
    name: string;
    quantity: number;
  }[];
}

export interface PublicCateringCatalog {
  packages: PublicCateringPackage[];
  items: PublicCateringItem[];
}