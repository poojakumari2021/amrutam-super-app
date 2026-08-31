import { debounce } from '@/core/utils/helpers';

jest.useFakeTimers();

describe('useDebouncedSearch behavior', () => {
  it('debounces via shared debounce helper', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 300);

    debounced('a');
    debounced('b');
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('b');
  });
});
