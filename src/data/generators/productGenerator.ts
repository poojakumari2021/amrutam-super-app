import { pick, seededRandom } from '@/core/utils/helpers';

const CATEGORIES = [
  'Herbal Supplements',
  'Oils & Balms',
  'Teas & Infusions',
  'Skincare',
  'Hair Care',
  'Immunity',
  'Digestive Health',
  'Personal Care',
] as const;

const ADJECTIVES = ['Pure', 'Organic', 'Ayur', 'Himalayan', 'Classic', 'Premium', 'Natural'];
const PRODUCTS = ['Ashwagandha', 'Triphala', 'Brahmi', 'Neem', 'Turmeric', 'Amla', 'Shatavari'];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  description: string;
  tags: string[];
};

export function generateProduct(index: number): Product {
  const rand = seededRandom(index + 1000);
  const category = pick([...CATEGORIES], rand);
  const name = `${pick(ADJECTIVES, rand)} ${pick(PRODUCTS, rand)} ${pick(['Powder', 'Capsules', 'Oil', 'Cream', 'Syrup'], rand)}`;

  return {
    id: `prod_${index}`,
    name,
    category,
    price: 99 + Math.floor(rand() * 50) * 50,
    rating: Math.round((3 + rand() * 2) * 10) / 10,
    reviewCount: Math.floor(rand() * 500),
    inStock: rand() > 0.05,
    description: `Authentic Ayurvedic ${category.toLowerCase()} product crafted with traditional herbs.`,
    tags: [category.split(' ')[0]!, pick(['bestseller', 'new', 'organic', 'vegan'], rand)],
  };
}

export function generateProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => generateProduct(i));
}
