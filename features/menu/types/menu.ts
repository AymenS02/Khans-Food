export interface MenuItem {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  categoryName?: string;
  available: boolean;
  displayOrder: number;
}