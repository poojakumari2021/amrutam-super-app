import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HealthStackParamList } from '@/app/navigation/types';
import { HealthTimelineScreen } from '@/modules/health-records/screens/HealthTimelineScreen';
import { useTheme } from '@/core/theme/ThemeProvider';

const Stack = createNativeStackNavigator<HealthStackParamList>();

export function HealthNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="HealthTimeline"
        component={HealthTimelineScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
