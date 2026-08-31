import { Linking } from 'react-native';

export const linking = {
  prefixes: ['amrutam://', 'https://amrutam.app'],
  config: {
    screens: {
      ConsultationTab: {
        screens: {
          DoctorDetail: 'doctor/:doctorId',
          MyBookings: 'bookings',
        },
      },
      ShopTab: {
        screens: {
          ProductDetail: 'product/:productId',
          Cart: 'cart',
          Wishlist: 'wishlist',
        },
      },
      HealthTab: {
        screens: {
          HealthTimeline: 'records',
        },
      },
      SettingsTab: {
        screens: {
          Settings: 'settings',
        },
      },
    },
  },
  async getInitialURL() {
    return Linking.getInitialURL();
  },
  subscribe(listener: (url: string) => void) {
    const subscription = Linking.addEventListener('url', ({ url }) => listener(url));
    return () => subscription.remove();
  },
};
