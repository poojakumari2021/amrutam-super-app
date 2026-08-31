export type ConsultationStackParamList = {
  DoctorList: undefined;
  DoctorDetail: { doctorId: string };
  MyBookings: undefined;
};

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  Wishlist: undefined;
};

export type HealthStackParamList = {
  HealthTimeline: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type RootTabParamList = {
  ConsultationTab: undefined;
  ShopTab: undefined;
  HealthTab: undefined;
  SettingsTab: undefined;
};
