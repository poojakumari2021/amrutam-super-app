import type { Route } from '@react-navigation/native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import type { RootTabParamList } from '@/app/navigation/types';

/** Root screen per tab — stack resets here when switching tabs. */
export const TAB_ROOT_SCREENS: Record<keyof RootTabParamList, string> = {
  ConsultationTab: 'DoctorList',
  ShopTab: 'ProductList',
  HealthTab: 'HealthTimeline',
  SettingsTab: 'Settings',
};

/** Nested screens where the bottom tab bar should be hidden. */
const HIDDEN_TAB_BAR_SCREENS: Partial<Record<keyof RootTabParamList, string[]>> = {
  ConsultationTab: ['DoctorDetail', 'MyBookings'],
  ShopTab: ['ProductDetail', 'Cart', 'Checkout', 'Wishlist'],
};

export function shouldShowTabBar(route: Partial<Route<string>>): boolean {
  const tabName = route.name as keyof RootTabParamList;
  const focused = getFocusedRouteNameFromRoute(route) ?? TAB_ROOT_SCREENS[tabName];
  const hidden = HIDDEN_TAB_BAR_SCREENS[tabName];
  return !hidden?.includes(focused);
}
