export type Locale = 'en' | 'hi';

export type TranslationKey =
  | 'tabs.consult'
  | 'tabs.shop'
  | 'tabs.records'
  | 'tabs.settings'
  | 'consult.title'
  | 'consult.subtitle'
  | 'consult.search'
  | 'consult.bookings'
  | 'consult.availableToday'
  | 'consult.specialty'
  | 'consult.location'
  | 'consult.preferences'
  | 'consult.results'
  | 'consult.pickSlot'
  | 'consult.confirmBooking'
  | 'consult.bookConsultation'
  | 'consult.bookAnother'
  | 'shop.title'
  | 'shop.cart'
  | 'shop.wishlist'
  | 'shop.inStockOnly'
  | 'shop.checkout'
  | 'shop.categories'
  | 'shop.sortBy'
  | 'shop.budget'
  | 'shop.results'
  | 'health.title'
  | 'health.search'
  | 'health.recordTypes'
  | 'health.popularTags'
  | 'health.results'
  | 'settings.title'
  | 'settings.theme'
  | 'settings.language'
  | 'settings.light'
  | 'settings.dark'
  | 'settings.system'
  | 'common.loading'
  | 'common.empty'
  | 'session.expired';

const en: Record<TranslationKey, string> = {
  'tabs.consult': 'Consult',
  'tabs.shop': 'Shop',
  'tabs.records': 'Records',
  'tabs.settings': 'More',
  'consult.title': 'Find a doctor',
  'consult.subtitle': 'Ayurvedic specialists near you',
  'consult.search': 'Name or specialty',
  'consult.bookings': 'My visits',
  'consult.availableToday': 'Free slots today',
  'consult.specialty': 'Specialty',
  'consult.location': 'City',
  'consult.preferences': 'Preferences',
  'consult.results': 'Doctors',
  'consult.pickSlot': 'Pick a time slot',
  'consult.confirmBooking': 'Confirm booking',
  'consult.bookConsultation': 'Book a consultation',
  'consult.bookAnother': 'Book another visit',
  'shop.title': 'Shop',
  'shop.cart': 'Cart',
  'shop.wishlist': 'Saved',
  'shop.inStockOnly': 'In stock',
  'shop.checkout': 'Place order',
  'shop.categories': 'Categories',
  'shop.sortBy': 'Sort by',
  'shop.budget': 'Budget',
  'shop.results': 'Products',
  'health.title': 'Your records',
  'health.search': 'Search reports, tags…',
  'health.recordTypes': 'Record type',
  'health.popularTags': 'Popular tags',
  'health.results': 'Timeline',
  'settings.title': 'Preferences',
  'settings.theme': 'Appearance',
  'settings.language': 'Language',
  'settings.light': 'Light',
  'settings.dark': 'Dark',
  'settings.system': 'Auto',
  'common.loading': 'Just a sec…',
  'common.empty': 'Nothing here',
  'session.expired': 'You were logged out — please try again.',
};

const hi: Record<TranslationKey, string> = {
  'tabs.consult': 'परामर्श',
  'tabs.shop': 'दुकान',
  'tabs.records': 'रिकॉर्ड',
  'tabs.settings': 'और',
  'consult.title': 'डॉक्टर खोजें',
  'consult.subtitle': 'आपके पास आयुर्वेद विशेषज्ञ',
  'consult.search': 'नाम या विशेषज्ञता',
  'consult.bookings': 'मेरी बुकिंग',
  'consult.availableToday': 'आज स्लॉट उपलब्ध',
  'consult.specialty': 'विशेषज्ञता',
  'consult.location': 'शहर',
  'consult.preferences': 'विकल्प',
  'consult.results': 'डॉक्टर',
  'consult.pickSlot': 'समय चुनें',
  'consult.confirmBooking': 'बुकिंग पुष्टि करें',
  'consult.bookConsultation': 'परामर्श बुक करें',
  'consult.bookAnother': 'और विज़िट बुक करें',
  'shop.title': 'दुकान',
  'shop.cart': 'कार्ट',
  'shop.wishlist': 'सेव किया',
  'shop.inStockOnly': 'स्टॉक में',
  'shop.checkout': 'ऑर्डर करें',
  'shop.categories': 'श्रेणियाँ',
  'shop.sortBy': 'क्रमबद्ध करें',
  'shop.budget': 'बजट',
  'shop.results': 'उत्पाद',
  'health.title': 'आपके रिकॉर्ड',
  'health.search': 'रिपोर्ट, टैग खोजें…',
  'health.recordTypes': 'रिकॉर्ड प्रकार',
  'health.popularTags': 'लोकप्रिय टैग',
  'health.results': 'समयरेखा',
  'settings.title': 'सेटिंग्स',
  'settings.theme': 'दिखावट',
  'settings.language': 'भाषा',
  'settings.light': 'लाइट',
  'settings.dark': 'डार्क',
  'settings.system': 'ऑटो',
  'common.loading': 'थोड़ा रुकें…',
  'common.empty': 'यहाँ कुछ नहीं',
  'session.expired': 'लॉग आउट हो गए — दोबारा कोशिश करें।',
};

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  en,
  hi,
};
