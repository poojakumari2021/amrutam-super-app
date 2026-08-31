import { useEffect, useMemo, useState } from 'react';
import { debounce } from '@/core/utils/helpers';

export function useDebouncedSearch(
  initialValue = '',
  delayMs = 300,
): [string, string, (value: string) => void] {
  const [localValue, setLocalValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  const debouncedSet = useMemo(
    () => debounce((value: string) => setDebouncedValue(value), delayMs),
    [delayMs],
  );

  useEffect(() => {
    debouncedSet(localValue);
  }, [localValue, debouncedSet]);

  return [localValue, debouncedValue, setLocalValue];
}
