import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppState, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { config } from '@/core/config/env';
import { ThemeProvider, useTheme } from '@/core/theme/ThemeProvider';
import { I18nProvider } from '@/core/i18n/I18nProvider';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ToastProvider, useToast } from '@/shared/components/ToastProvider';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { linking } from '@/app/navigation/linking';
import {
  processOfflineQueue,
  registerSyncHandler,
  startSyncListener,
} from '@/core/sync/syncManager';
import { syncBookingFromQueue } from '@/modules/consultation/api/consultationApi';
import { useShopStore } from '@/modules/shop/store/shopStore';
import { initSession } from '@/core/api/client';
import { onSessionExpired } from '@/core/api/sessionHandler';
import { useI18n } from '@/core/i18n/I18nProvider';
import { logger } from '@/core/logger/logger';
import { reportError } from '@/core/monitoring/crashReporting';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: config.cache.staleTimeMs,
      gcTime: config.cache.gcTimeMs,
      retry: 2,
    },
  },
});

function NavigationRoot() {
  const { isDark, colors } = useTheme();

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme} linking={linking as never}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

function SessionWatcher() {
  const { showToast } = useToast();
  const { t } = useI18n();

  useEffect(() => {
    return onSessionExpired(() => {
      showToast(t('session.expired'), 'error');
      initSession('mock-token', Date.now() + 24 * 60 * 60 * 1000);
    });
  }, [showToast, t]);

  return null;
}

function AppBootstrap({ children }: { children: React.ReactNode }) {
  const hydrateShop = useShopStore(state => state.hydrate);

  useEffect(() => {
    initSession('mock-token', Date.now() + 24 * 60 * 60 * 1000);

    hydrateShop();
    registerSyncHandler((type, payload) => {
      if (type === 'CREATE_BOOKING') {
        return syncBookingFromQueue(payload);
      }
      return Promise.resolve();
    });
    const unsubscribeNet = startSyncListener();

    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        logger.info('App foregrounded — processing background sync');
        processOfflineQueue();
      }
    });

    processOfflineQueue();
    return () => {
      unsubscribeNet();
      appStateSub.remove();
    };
  }, [hydrateShop]);

  return <>{children}</>;
}

export function AppProviders() {
  return (
    <ErrorBoundary
      onReset={() => reportError(new Error('Error boundary reset'))}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <I18nProvider>
            <ThemeProvider>
              <ToastProvider>
                <SessionWatcher />
                <AppBootstrap>
                  <NavigationRoot />
                </AppBootstrap>
              </ToastProvider>
            </ThemeProvider>
          </I18nProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
