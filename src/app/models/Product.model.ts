export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    category: 'Men' | 'Women'; // Optional property for the product image URL
  }
  