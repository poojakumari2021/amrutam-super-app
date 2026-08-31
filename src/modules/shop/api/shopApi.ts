import { apiRequest } from '@/core/api/client';
import { ApiError, type PaginatedResponse } from '@/core/api/types';
import { config } from '@/core/config/env';
import {
  generateProduct,
  type Product,
} from '@/data/generators/productGenerator';
import { paginateByIndex } from '@/core/utils/paginatedScan';

export type ProductSort = 'price_asc' | 'price_desc' | 'rating' | 'name';

export type ProductFilters = {
  categories?: string[];
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
};

function productMatches(
  index: number,
  search: string,
  filters: ProductFilters,
): boolean {
  const product = generateProduct(index);
  const matchesSearch =
    !search ||
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase());
  const matchesCategory =
    !filters.categories?.length ||
    filters.categories.includes(product.category);
  const matchesStock = !filters.inStockOnly || product.inStock;
  const matchesMin = !filters.minPrice || product.price >= filters.minPrice;
  const matchesMax = !filters.maxPrice || product.price <= filters.maxPrice;

  return (
    matchesSearch && matchesCategory && matchesStock && matchesMin && matchesMax
  );
}

function sortComparator(sort: ProductSort): (a: Product, b: Product) => number {
  switch (sort) {
    case 'price_asc':
      return (a, b) => a.price - b.price;
    case 'price_desc':
      return (a, b) => b.price - a.price;
    case 'name':
      return (a, b) => a.name.localeCompare(b.name);
    case 'rating':
    default:
      return (a, b) => b.rating - a.rating;
  }
}

export async function fetchProducts(params: {
  page: number;
  pageSize?: number;
  search?: string;
  filters?: ProductFilters;
  sort?: ProductSort;
}): Promise<PaginatedResponse<Product>> {
  const pageSize = params.pageSize ?? config.data.pageSize;
  const search = params.search ?? '';
  const filters = params.filters ?? {};
  const sort = params.sort ?? 'rating';
  const cacheKey = `products:${params.page}:${search}:${JSON.stringify(filters)}:${sort}`;

  return apiRequest(
    cacheKey,
    async () =>
      paginateByIndex({
        totalCount: config.data.productCount,
        page: params.page,
        pageSize,
        matches: index => productMatches(index, search, filters),
        generate: generateProduct,
        compare: sortComparator(sort),
      }),
    { cacheKey },
  );
}

export async function fetchProductById(id: string): Promise<Product> {
  const index = Number(id.replace('prod_', ''));
  if (Number.isNaN(index)) {
    throw new ApiError('Product not found', 'NOT_FOUND', 404);
  }
  return apiRequest(`product:${id}`, async () => generateProduct(index));
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  return ids.map(id => {
    const index = Number(id.replace('prod_', ''));
    return generateProduct(Number.isNaN(index) ? 0 : index);
  });
}

export async function fetchProductCategories(): Promise<string[]> {
  return apiRequest('product-categories', async () => {
    const categories = new Set<string>();
    for (let i = 0; i < 100; i++) {
      categories.add(generateProduct(i * 200).category);
    }
    return Array.from(categories).sort();
  });
}
