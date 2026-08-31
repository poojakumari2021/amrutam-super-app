import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useInfiniteQuery, useQuery, keepPreviousData } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  fetchProductCategories,
  fetchProducts,
  type ProductFilters,
  type ProductSort,
} from '@/modules/shop/api/shopApi';
import { ProductCard } from '@/modules/shop/components/ProductCard';
import type { ShopStackParamList } from '@/app/navigation/types';
import type { Product } from '@/data/generators/productGenerator';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch';
import { useCart } from '@/shared/hooks/useCart';
import { AppText } from '@/shared/components/AppText';
import { AppIcon } from '@/shared/components/AppIcon';
import { Card } from '@/shared/components/Card';
import { EmptyState } from '@/shared/components/EmptyState';
import { FilterChips } from '@/shared/components/FilterChips';
import { ListFetchIndicator } from '@/shared/components/ListFetchIndicator';
import { LoadingState } from '@/shared/components/LoadingState';
import { OptionPills } from '@/shared/components/OptionPills';
import { ScreenContainer } from '@/shared/components/ScreenContainer';
import { ScreenHeader } from '@/shared/components/ScreenHeader';
import { ScreenSection } from '@/shared/components/ScreenSection';
import { SearchBar } from '@/shared/components/SearchBar';
import { SectionDivider } from '@/shared/components/SectionDivider';
import { SectionLabel } from '@/shared/components/SectionLabel';
import { ToggleRow } from '@/shared/components/ToggleRow';

type Props = NativeStackScreenProps<ShopStackParamList, 'ProductList'>;

const SORT_OPTIONS: { label: string; value: ProductSort }[] = [
  { label: 'Top rated', value: 'rating' },
  { label: 'Cheapest', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
  { label: 'A–Z', value: 'name' },
];

const PRICE_OPTIONS = [
  { label: 'Under ₹500', value: 500 },
  { label: 'Under ₹1000', value: 1000 },
  { label: 'Under ₹2000', value: 2000 },
] as const;

export function ProductListScreen({ navigation }: Props) {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  const { count: cartCount } = useCart();
  const [localSearch, debouncedSearch, setLocalSearch] = useDebouncedSearch();
  const [sort, setSort] = useState<ProductSort>('rating');
  const [filters, setFilters] = useState<ProductFilters>({});

  const { data: categories = [] } = useQuery({
    queryKey: ['product-categories'],
    queryFn: fetchProductCategories,
  });

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ['products', debouncedSearch, sort, filters],
      queryFn: ({ pageParam }) =>
        fetchProducts({ page: pageParam, search: debouncedSearch, sort, filters }),
      initialPageParam: 1,
      getNextPageParam: lastPage =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
      placeholderData: keepPreviousData,
    });

  const products = data?.pages.flatMap(page => page.items) ?? [];
  const isInitialLoading = isLoading && products.length === 0;
  const isUpdatingResults = isFetching && !isFetchingNextPage && !isInitialLoading;

  const handleProductPress = useCallback(
    (product: Product) =>
      navigation.navigate('ProductDetail', { productId: product.id }),
    [navigation],
  );

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => {
      const current = prev.categories ?? [];
      const next = current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category];
      return { ...prev, categories: next.length ? next : undefined };
    });
  }, []);

  const listHeader = (
    <View style={{ paddingBottom: spacing.sm }}>
      <ScreenHeader
        title={t('shop.title')}
        right={
          <>
            <Pressable
              onPress={() => navigation.navigate('Wishlist')}
              accessibilityRole="button"
              accessibilityLabel={t('shop.wishlist')}
              hitSlop={8}>
              <AppIcon name="heart-outline" size={24} color={colors.primary} />
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate('Cart')}
              accessibilityRole="button"
              accessibilityLabel={`${t('shop.cart')}, ${cartCount} items`}
              hitSlop={8}
              style={styles.cartButton}>
              <AppIcon name="cart-outline" size={24} color={colors.primary} />
              {cartCount > 0 ? (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <AppText variant="caption" style={styles.badgeText}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </AppText>
                </View>
              ) : null}
            </Pressable>
          </>
        }
      />

      <ScreenSection style={{ marginBottom: spacing.block }}>
        <SearchBar
          value={localSearch}
          onChangeText={setLocalSearch}
          placeholder="Search products"
        />
        <ListFetchIndicator visible={isUpdatingResults} />
      </ScreenSection>

      <Card elevated style={{ marginBottom: spacing.block }}>
        <ScreenSection title={t('shop.categories')} compact>
          <FilterChips
            options={categories}
            selected={filters.categories ?? []}
            onToggle={toggleCategory}
          />
        </ScreenSection>

        <SectionDivider />

        <ScreenSection title={t('shop.sortBy')} compact>
          <OptionPills
            options={SORT_OPTIONS}
            value={sort}
            onChange={value => value && setSort(value)}
          />
        </ScreenSection>

        <SectionDivider />

        <ScreenSection title={t('shop.budget')} compact>
          <OptionPills
            options={[...PRICE_OPTIONS]}
            value={filters.maxPrice}
            onChange={price =>
              setFilters(prev => ({
                ...prev,
                maxPrice: price,
              }))
            }
          />
        </ScreenSection>

        <SectionDivider />

        <ScreenSection compact>
          <ToggleRow
            label={t('shop.inStockOnly')}
            value={filters.inStockOnly ?? false}
            onValueChange={value =>
              setFilters(prev => ({
                ...prev,
                inStockOnly: value || undefined,
              }))
            }
          />
        </ScreenSection>
      </Card>

      <SectionLabel title={t('shop.results')} count={products.length} />
    </View>
  );

  if (isInitialLoading) {
    return (
      <ScreenContainer>
        <LoadingState message={t('common.loading')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: spacing.gutter, marginBottom: spacing.gutter }}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={handleProductPress} />
        )}
        ListHeaderComponent={listHeader}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.6}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={7}
        removeClippedSubviews
        ListEmptyComponent={
          <EmptyState
            title="No products found"
            description="Adjust filters or try another search."
            icon="bag-handle-outline"
          />
        }
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} />
        }
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
