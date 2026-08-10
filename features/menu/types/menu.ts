export interface MenuItem {
  _id: string;

  name: string;

  description: string;

  price: number;

  image?: string;

  category: string;

  available: boolean;
}