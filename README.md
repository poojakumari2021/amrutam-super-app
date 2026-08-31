# Amrutam Super App

Ayurvedic super app built with **React Native CLI**, **TypeScript**, and **React Navigation** for the Amrutam senior assignment. Three modules — Consultation, Shop, Health Records — plus Settings. All data is mocked locally at scale (5,000 doctors · 20,000 products · 10,000 health records).

---

## Quick start

```bash
npm install

# Android
npm run android

# iOS
cd ios && pod install && cd ..
npm run ios

# Tests
npm test -- --watchman=false --forceExit
```

### Release APK (Android)

```bash
npm run build:android:release
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

> Release builds are signed with the debug keystore for local testing. Replace `signingConfigs` in `android/app/build.gradle` before Play Store upload.

---

## Assignment coverage

### Module 1 — Consultation

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Doctor listing | ✅ | Paginated `FlatList`, 5K doctors |
| Search | ✅ | Debounced search by name / specialty |
| Filters | ✅ | Specialization, city, rating, available today |
| Doctor details | ✅ | `DoctorDetailScreen` |
| Available slots | ✅ | Hourly slots for today |
| Booking flow | ✅ | Select slot → confirm |
| Upcoming consultations | ✅ | `MyBookingsScreen` |
| Cancel booking | ✅ | Cancel with status update |
| Slot conflicts | ✅ | `SLOT_CONFLICT` error |
| Expired slots | ✅ | Unavailable slots + `SLOT_EXPIRED` |
| Double booking | ✅ | Same slot blocked on second attempt |

### Module 2 — Shop

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Product listing | ✅ | 20K products, 2-column grid |
| Infinite scroll | ✅ | `useInfiniteQuery` + `onEndReached` |
| Search | ✅ | Debounced product search |
| Multi-filter | ✅ | Category, in-stock, max price |
| Sorting | ✅ | Rating, price, name |
| Product details | ✅ | `ProductDetailScreen` |
| Cart | ✅ | `CartScreen` |
| Quantity updates | ✅ | +/- controls |
| Wishlist | ✅ | Toggle + dedicated `WishlistScreen` |
| Checkout summary | ✅ | `CheckoutScreen` |
| Persist cart | ✅ | AsyncStorage via Zustand |

### Module 3 — Health Records

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Lab report | ✅ | All 5 record types in generator |
| Prescription | ✅ | |
| Consultation | ✅ | |
| Vaccination | ✅ | |
| Allergy | ✅ | |
| Timeline view | ✅ | `SectionList` grouped by month/year |
| Filters | ✅ | Record type + tag chips |
| Search | ✅ | Title, summary, tags |
| Tags | ✅ | Display + filter |
| Attachment preview | ✅ | `AttachmentPreview` (PDF/IMG thumbnails) |
| Group by month/year | ✅ | `groupByMonthYear` |

### Technical constraints

| Requirement | Status |
|-------------|--------|
| React Native CLI | ✅ |
| TypeScript | ✅ |
| React Navigation | ✅ (tabs + stacks) |
| State management (choice) | ✅ Zustand + TanStack Query |
| No boilerplate starter | ✅ Fresh `react-native init` |

### Performance (5K / 20K / 10K)

| Technique | Status |
|-----------|--------|
| Virtualized lists | ✅ `FlatList` / `SectionList`, `removeClippedSubviews` |
| Memoization | ✅ `memo`, `useMemo`, `useCallback` on list items |
| Efficient state updates | ✅ Zustand selectors, React Query cache |
| Lazy loading | ✅ Infinite scroll pagination |
| Index-based scan | ✅ `paginateByIndex` — no full-array materialization |

### Offline first

| Requirement | Status |
|-------------|--------|
| Cached API responses | ✅ MMKV cache in `apiRequest` |
| Offline cart | ✅ AsyncStorage persistence |
| Offline bookings (queued) | ✅ `offlineQueue` |
| Auto sync on reconnect | ✅ NetInfo + `AppState` foreground |

### Reliability

| Scenario | Status |
|----------|--------|
| Slow network | ✅ Simulated in dev (`slowNetworkMs`) |
| API timeout | ✅ `Promise.race` with timeout |
| Random failures | ✅ `failureRate` in dev |
| Empty responses | ✅ Simulated + `EmptyState` UI |
| Partial responses | ✅ `PARTIAL_RESPONSE` handling |
| Invalid JSON | ✅ Cache parse guard + simulated errors |
| Session expiration | ✅ `SessionExpiredError` + global toast |

### Production engineering

| Item | Status |
|------|--------|
| Environment config | ✅ `src/core/config/env.ts` |
| API abstraction | ✅ `apiRequest` wrapper |
| Logging | ✅ `src/core/logger/logger.ts` |
| Error boundary | ✅ `ErrorBoundary` |
| Global toast | ✅ `ToastProvider` |
| Theme support | ✅ Design tokens + `ThemeProvider` |
| Dark mode | ✅ Light / Dark / System in Settings |
| Accessibility | ✅ `accessibilityRole`, labels on interactive elements |

### Testing

| Area | Status | Files |
|------|--------|-------|
| Business logic | ✅ | `booking.test.ts`, `cart.test.ts` |
| Custom hooks | ✅ | `useDebouncedSearch.test.ts` |
| Utilities | ✅ | `helpers.test.ts`, `paginatedScan.test.ts`, `generators.test.ts` |
| End-to-end flow | ✅ | `consultationFlow.test.ts` + `.maestro/consultation-flow.yaml` |

### Bonus (pick any 3 — implemented 7)

| Bonus | Status | Location |
|-------|--------|----------|
| Feature flags | ✅ | `src/core/featureFlags/` |
| Localization (EN + HI) | ✅ | `src/core/i18n/` |
| Secure local storage | ✅ | Encrypted MMKV (`encryptedStorage.ts`) |
| Deep linking | ✅ | `src/app/navigation/linking.ts` |
| Performance monitoring | ✅ | `src/core/monitoring/perfMonitor.ts` |
| Crash reporting abstraction | ✅ | `src/core/monitoring/crashReporting.ts` |
| Background synchronization | ✅ | `AppState` + NetInfo in `syncManager` |

*Not implemented: Remote Config, Biometric Auth, Push Notifications (not required — 3+ bonus items covered).*

---

## Folder structure

```
AmrutamSuperApp/
├── android/                  # Native Android project
├── ios/                      # Native iOS project
├── __tests__/                # Unit + integration tests
├── .maestro/                 # E2E flow (Maestro)
├── src/
│   ├── app/
│   │   ├── navigation/       # Tab + stack navigators, deep links
│   │   └── providers/        # AppProviders (Query, Theme, i18n, Toast)
│   ├── core/
│   │   ├── api/              # apiRequest, session handler, types
│   │   ├── config/           # Environment
│   │   ├── featureFlags/
│   │   ├── i18n/             # English + Hindi
│   │   ├── logger/
│   │   ├── monitoring/       # perf + crash reporting
│   │   ├── storage/          # MMKV, encrypted storage, AsyncStorage keys
│   │   ├── sync/             # Offline queue + sync manager
│   │   ├── theme/            # Tokens, ThemeProvider
│   │   └── utils/            # helpers, paginatedScan
│   ├── data/generators/      # Seeded mock data (doctors, products, records)
│   ├── modules/
│   │   ├── consultation/
│   │   ├── shop/
│   │   ├── health-records/
│   │   └── settings/
│   └── shared/
│       ├── components/       # Button, Card, SearchBar, etc.
│       └── hooks/            # useBooking, useCart, useDebouncedSearch
├── App.tsx
└── index.js
```

---

## Architectural decisions

**State:** Zustand owns client UI state (cart, wishlist, filter chips). TanStack Query owns anything async — including our mock API — with caching, pagination, and refetch.

**API layer:** Single `apiRequest` handles timeouts, offline cache, session checks, and dev-only failure simulation. Mutations (bookings) skip cache.

**Data:** Seeded generators produce deterministic records by index. `paginateByIndex` walks indices, filters, sorts, and only materializes one page — keeps memory flat at scale.

**Navigation:** Bottom tabs for modules; each module has its own native stack. Deep links: `amrutam://doctor/:doctorId`, `amrutam://cart`, `amrutam://records`, etc.

**Storage:** Encrypted MMKV for session + bookings. Plain MMKV for API cache. AsyncStorage for cart (not sensitive).

---

## Performance optimizations

- Paginated API (`pageSize: 20`) with infinite scroll — UI never mounts 20K rows
- `removeClippedSubviews`, `windowSize`, `maxToRenderPerBatch` tuned on lists
- Memoized `DoctorCard` / `ProductCard`
- React Query `staleTime` / `gcTime` from env config
- On-demand `generateDoctor(i)` — one object per visible row

---

## Offline strategy

1. **Read path:** If offline, serve last cached response from MMKV (stale-while-revalidate when back online).
2. **Cart:** Written to AsyncStorage on every change; hydrated on app launch.
3. **Bookings:** If offline at book time, action queued in `offlineQueue` and booking saved locally as `pending_sync`.
4. **Sync:** `NetInfo` listener + `AppState` `active` event drains the queue.

---

## Trade-offs

- **Attachment preview** is a styled thumbnail, not a native PDF viewer — keeps scope manageable.
- **Filter/sort** uses index scan (O(n) or O(n log n) on matches) — simple and correct for mock data; a real backend would push filtering server-side.
- **Release APK** uses debug signing for easy local install — swap keystore for production.
- **Maestro E2E** needs separate CLI install; integration test covers the same flow in Jest.

---

## Future improvements

- Real REST/GraphQL backend and auth (OTP / OAuth)
- Native document viewer for lab PDFs
- Push notifications for appointment reminders
- Remote config instead of local feature flags
- CI pipeline (GitHub Actions) for test + APK build

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Metro bundler |
| `npm run android` | Run debug on device/emulator |
| `npm run ios` | Run on iOS simulator |
| `npm test -- --watchman=false --forceExit` | Unit + integration tests |
| `npm run test:e2e` | Maestro consultation flow |
| `npm run build:android:release` | Build signed release APK |

---

## Deep links (examples)

```
amrutam://doctor/doc_12
amrutam://cart
amrutam://wishlist
amrutam://bookings
amrutam://records
amrutam://settings
```

---

Built for the Amrutam Senior React Assignment · React Native 0.87
