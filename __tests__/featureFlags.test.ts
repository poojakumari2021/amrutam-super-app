import { isFeatureEnabled, setFeatureFlag } from '@/core/featureFlags/featureFlags';

describe('feature flags', () => {
  it('returns default flag values', () => {
    expect(isFeatureEnabled('wishlist_v2')).toBe(true);
  });

  it('persists flag overrides', () => {
    setFeatureFlag('wishlist_v2', false);
    expect(isFeatureEnabled('wishlist_v2')).toBe(false);
    setFeatureFlag('wishlist_v2', true);
  });
});
