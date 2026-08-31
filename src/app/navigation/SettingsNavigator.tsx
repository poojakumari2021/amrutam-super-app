import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/navigation/types';
import { SettingsScreen } from '@/modules/settings/screens/SettingsScreen';
import { useTheme } from '@/core/theme/ThemeProvider';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
