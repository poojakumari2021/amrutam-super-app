import { apiRequest } from '@/core/api/client';
import { ApiError, type PaginatedResponse } from '@/core/api/types';
import { config } from '@/core/config/env';
import {
  generateDoctor,
  type Doctor,
} from '@/data/generators/doctorGenerator';
import type { Booking, DoctorFilters, TimeSlot } from '@/modules/consultation/types';
import { encryptedStorage } from '@/core/storage/encryptedStorage';
import { STORAGE_KEYS } from '@/core/storage/storage';
import { uniqueId } from '@/core/utils/helpers';
import { paginateByIndex } from '@/core/utils/paginatedScan';

const BOOKINGS_KEY = STORAGE_KEYS.bookings;

function getBookings(): Booking[] {
  return encryptedStorage.getObject<Booking[]>(BOOKINGS_KEY) ?? [];
}

function saveBookings(bookings: Booking[]): void {
  encryptedStorage.setObject(BOOKINGS_KEY, bookings);
}

function doctorMatches(
  index: number,
  search: string,
  filters: DoctorFilters,
): boolean {
  const doctor = generateDoctor(index);
  const matchesSearch =
    !search ||
    doctor.name.toLowerCase().includes(search.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(search.toLowerCase());
  const matchesSpec =
    !filters.specialization || doctor.specialization === filters.specialization;
  const matchesCity = !filters.city || doctor.city === filters.city;
  const matchesAvailable =
    filters.availableToday === undefined ||
    doctor.availableToday === filters.availableToday;
  const matchesRating =
    !filters.minRating || doctor.rating >= filters.minRating;

  return (
    matchesSearch &&
    matchesSpec &&
    matchesCity &&
    matchesAvailable &&
    matchesRating
  );
}

export async function fetchDoctors(params: {
  page: number;
  pageSize?: number;
  search?: string;
  filters?: DoctorFilters;
}): Promise<PaginatedResponse<Doctor>> {
  const pageSize = params.pageSize ?? config.data.pageSize;
  const search = params.search ?? '';
  const filters = params.filters ?? {};
  const cacheKey = `doctors:${params.page}:${search}:${JSON.stringify(filters)}`;

  return apiRequest(
    cacheKey,
    async () =>
      paginateByIndex({
        totalCount: config.data.doctorCount,
        page: params.page,
        pageSize,
        matches: index => doctorMatches(index, search, filters),
        generate: generateDoctor,
        compare: (a, b) => b.rating - a.rating,
      }),
    { cacheKey },
  );
}

export async function fetchDoctorById(id: string): Promise<Doctor> {
  const index = Number(id.replace('doc_', ''));
  if (Number.isNaN(index)) {
    throw new ApiError('Doctor not found', 'NOT_FOUND', 404);
  }
  return apiRequest(`doctor:${id}`, async () => generateDoctor(index));
}

export async function fetchDoctorSlots(
  doctorId: string,
  date: string,
): Promise<TimeSlot[]> {
  return apiRequest(`slots:${doctorId}:${date}`, async () => {
    const bookings = getBookings();
    const slots: TimeSlot[] = [];
    const baseDate = new Date(date);
    const now = new Date();

    for (let hour = 9; hour < 18; hour++) {
      const start = new Date(baseDate);
      start.setHours(hour, 0, 0, 0);
      const end = new Date(baseDate);
      end.setHours(hour + 1, 0, 0, 0);

      const slotId = `${doctorId}_${date}_${hour}`;
      const isBooked = bookings.some(
        b => b.slotId === slotId && b.status !== 'cancelled',
      );
      const isExpired = start < now;

      slots.push({
        id: slotId,
        doctorId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        isAvailable: !isBooked && !isExpired,
      });
    }

    return slots;
  });
}

export async function createBooking(params: {
  doctorId: string;
  doctorName: string;
  slotId: string;
  startTime: string;
  endTime: string;
  offline?: boolean;
}): Promise<Booking> {
  return apiRequest('create-booking', async () => {
    const bookings = getBookings();
    const conflict = bookings.find(
      b => b.slotId === params.slotId && b.status !== 'cancelled',
    );

    if (conflict) {
      throw new ApiError('Slot already booked', 'SLOT_CONFLICT', 409);
    }

    const slotStart = new Date(params.startTime);
    if (slotStart < new Date()) {
      throw new ApiError('Slot has expired', 'SLOT_EXPIRED', 400);
    }

    const booking: Booking = {
      id: uniqueId('booking'),
      doctorId: params.doctorId,
      doctorName: params.doctorName,
      slotId: params.slotId,
      startTime: params.startTime,
      endTime: params.endTime,
      status: params.offline ? 'pending_sync' : 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);
    saveBookings(bookings);
    return booking;
  }, { cache: false });
}

export async function cancelBooking(bookingId: string): Promise<Booking> {
  return apiRequest(`cancel-booking:${bookingId}`, async () => {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) {
      throw new ApiError('Booking not found', 'NOT_FOUND', 404);
    }
    bookings[index] = { ...bookings[index]!, status: 'cancelled' };
    saveBookings(bookings);
    return bookings[index]!;
  }, { cache: false });
}

export async function fetchUpcomingBookings(): Promise<Booking[]> {
  return apiRequest('upcoming-bookings', async () => {
    const now = new Date();
    return getBookings().filter(
      b => b.status !== 'cancelled' && new Date(b.startTime) >= now,
    );
  });
}

export function syncBookingFromQueue(payload: unknown): Promise<void> {
  const data = payload as Omit<Parameters<typeof createBooking>[0], 'offline'>;
  return createBooking({ ...data, offline: false }).then(() => undefined);
}

export function __testGetBookings(): Booking[] {
  return getBookings();
}

export function __testClearBookings(): void {
  saveBookings([]);
}
