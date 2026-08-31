import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { createBooking } from '@/modules/consultation/api/consultationApi';
import type { TimeSlot } from '@/modules/consultation/types';
import { offlineQueue } from '@/core/sync/offlineQueue';
import { ApiError } from '@/core/api/types';

type BookingParams = {
  doctorId: string;
  doctorName: string;
  slot: TimeSlot;
};

export function useBooking() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ doctorId, doctorName, slot }: BookingParams) => {
      const net = await NetInfo.fetch();
      const isOnline = net.isConnected ?? false;
      const payload = {
        doctorId,
        doctorName,
        slotId: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
      };

      if (!isOnline) {
        offlineQueue.enqueue({ type: 'CREATE_BOOKING', payload });
        return createBooking({ ...payload, offline: true });
      }

      return createBooking(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const book = useCallback(
    (params: BookingParams) => mutation.mutateAsync(params),
    [mutation],
  );

  const getErrorMessage = useCallback((error: unknown) => {
    return error instanceof ApiError ? error.message : 'Booking failed';
  }, []);

  return {
    book,
    isBooking: mutation.isPending,
    error: mutation.error,
    getErrorMessage,
  };
}
