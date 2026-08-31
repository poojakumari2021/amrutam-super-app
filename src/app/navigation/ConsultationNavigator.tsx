import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ConsultationStackParamList } from '@/app/navigation/types';
import { DoctorListScreen } from '@/modules/consultation/screens/DoctorListScreen';
import { DoctorDetailScreen } from '@/modules/consultation/screens/DoctorDetailScreen';
import { MyBookingsScreen } from '@/modules/consultation/screens/MyBookingsScreen';
import { useTheme } from '@/core/theme/ThemeProvider';

const Stack = createNativeStackNavigator<ConsultationStackParamList>();

export function ConsultationNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="DoctorList"
        component={DoctorListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DoctorDetail"
        component={DoctorDetailScreen}
        options={{ title: 'Doctor' }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ title: 'My Bookings' }}
      />
    </Stack.Navigator>
  );
}
