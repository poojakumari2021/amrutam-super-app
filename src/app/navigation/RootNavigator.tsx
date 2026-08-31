import React, { useCallback, useMemo } from 'react';
import {
  createBottomTabNavigator,
  type BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
import { CommonActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootTabParamList } from '@/app/navigation/types';
import { ConsultationNavigator } from '@/app/navigation/ConsultationNavigator';
import { ShopNavigator } from '@/app/navigation/ShopNavigator';
import { HealthNavigator } from '@/app/navigation/HealthNavigator';
import { SettingsNavigator } from '@/app/navigation/SettingsNavigator';
import { shouldShowTabBar, TAB_ROOT_SCREENS } from '@/app/navigation/tabBarConfig';
import { useTheme } from '@/core/theme/ThemeProvider';
import { useI18n } from '@/core/i18n/I18nProvider';
import { AppIcon, type AppIconName } from '@/shared/components/AppIcon';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_BAR_CONTENT_HEIGHT = 56;

const TAB_ICONS: Record<keyof RootTabParamList, { active: AppIconName; inactive: AppIconName }> = {
  ConsultationTab: { active: 'medical', inactive: 'medical-outline' },
  ShopTab: { active: 'bag-handle', inactive: 'bag-handle-outline' },
  HealthTab: { active: 'document-text', inactive: 'document-text-outline' },
  SettingsTab: { active: 'settings', inactive: 'settings-outline' },
};

function resetTabToRoot(
  navigation: NavigationProp<ParamListBase>,
  tabName: keyof RootTabParamList,
) {
  const state = navigation.getState();
  const tabIndex = state.routes.findIndex(r => r.name === tabName);
  if (tabIndex === -1) {
    return;
  }

  const tabRoute = state.routes[tabIndex];
  if (!tabRoute.state || tabRoute.state.index === 0) {
    return;
  }

  const rootScreen = TAB_ROOT_SCREENS[tabName];
  navigation.dispatch({
    ...CommonActions.reset({
      ...state,
      routes: state.routes.map((route, index) =>
        index === tabIndex
          ? {
              ...route,
              state: {
                routes: [{ name: rootScreen }],
                index: 0,
              },
            }
          : route,
      ),
      index: state.index,
    }),
  });
}

export function RootNavigator() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom;

  const defaultTabBarStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      borderTopWidth: StyleSheet.hairlineWidth,
      paddingTop: 6,
      paddingBottom: bottomInset,
      height: TAB_BAR_CONTENT_HEIGHT + bottomInset,
    }),
    [bottomInset, colors.border, colors.surface],
  );

  const makeTabListeners = useCallback(
    (tabName: keyof RootTabParamList) =>
      ({ navigation }: { navigation: BottomTabNavigationProp<RootTabParamList> }) => ({
        blur: () => resetTabToRoot(navigation, tabName),
      }),
    [],
  );

  return (
    <Tab.Navigator
      safeAreaInsets={{ top: 0, right: 0, bottom: 0, left: 0 }}
      screenOptions={({ route }) => {
        const showTabBar = shouldShowTabBar(route);
        return {
          headerShown: false,
          tabBarStyle: showTabBar
            ? defaultTabBarStyle
            : { ...defaultTabBarStyle, display: 'none' },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
          tabBarIcon: ({ color, focused }) => {
            const icons = TAB_ICONS[route.name as keyof RootTabParamList];
            return (
              <AppIcon
                name={focused ? icons.active : icons.inactive}
                size={22}
                color={color}
              />
            );
          },
        };
      }}>
      <Tab.Screen
        name="ConsultationTab"
        component={ConsultationNavigator}
        options={{ tabBarLabel: t('tabs.consult') }}
        listeners={makeTabListeners('ConsultationTab')}
      />
      <Tab.Screen
        name="ShopTab"
        component={ShopNavigator}
        options={{ tabBarLabel: t('tabs.shop') }}
        listeners={makeTabListeners('ShopTab')}
      />
      <Tab.Screen
        name="HealthTab"
        component={HealthNavigator}
        options={{ tabBarLabel: t('tabs.records') }}
        listeners={makeTabListeners('HealthTab')}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsNavigator}
        options={{ tabBarLabel: t('tabs.settings') }}
        listeners={makeTabListeners('SettingsTab')}
      />
    </Tab.Navigator>
  );
}
