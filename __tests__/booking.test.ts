import {
  __testClearBookings,
  createBooking,
} from '@/modules/consultation/api/consultationApi';
import { ApiError } from '@/core/api/types';

describe('booking business logic', () => {
  beforeEach(() => {
    __testClearBookings();
  });

  it('creates a booking for an available slot', async () => {
    const start = new Date();
    start.setHours(start.getHours() + 2, 0, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const booking = await createBooking({
      doctorId: 'doc_1',
      doctorName: 'Dr. Test',
      slotId: 'doc_1_slot_test',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    });

    expect(booking.status).toBe('confirmed');
    expect(booking.doctorId).toBe('doc_1');
  });

  it('rejects double booking on the same slot', async () => {
    const start = new Date();
    start.setHours(start.getHours() + 3, 0, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const payload = {
      doctorId: 'doc_2',
      doctorName: 'Dr. Test',
      slotId: 'doc_2_slot_conflict',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    await createBooking(payload);
    await expect(createBooking(payload)).rejects.toBeInstanceOf(ApiError);
    await expect(createBooking(payload)).rejects.toMatchObject({
      code: 'SLOT_CONFLICT',
    });
  });

  it('rejects expired slots', async () => {
    const start = new Date();
    start.setHours(start.getHours() - 2);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    await expect(
      createBooking({
        doctorId: 'doc_3',
        doctorName: 'Dr. Test',
        slotId: 'doc_3_expired',
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      }),
    ).rejects.toMatchObject({ code: 'SLOT_EXPIRED' });
  });
});
