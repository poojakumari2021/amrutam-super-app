import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/core/theme/ThemeProvider';
import { AppText } from '@/shared/components/AppText';

type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastMessage = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const insets = useSafeAreaInsets();
  const { colors, spacing, borderRadius } = useTheme();

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const toastColors: Record<ToastType, string> = {
    success: colors.success,
    error: colors.error,
    info: colors.primary,
    warning: colors.warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        style={[styles.container, { top: insets.top + spacing.sm }]}
        pointerEvents="none">
        {toasts.map(toast => (
          <View
            key={toast.id}
            style={[
              styles.toast,
              {
                backgroundColor: toastColors[toast.type],
                borderRadius: borderRadius.md,
                padding: spacing.md,
              },
            ]}
            accessibilityLiveRegion="polite">
            <AppText variant="label" style={styles.toastText}>
              {toast.message}
            </AppText>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    gap: 8,
    zIndex: 9999,
  },
  toast: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  toastText: {
    color: '#FFFFFF',
  },
});
