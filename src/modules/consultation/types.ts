export type TimeSlot = {
  id: string;
  doctorId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

export type BookingStatus = 'confirmed' | 'cancelled' | 'pending_sync';

export type Booking = {
  id: string;
  doctorId: string;
  doctorName: string;
  slotId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
};

export type DoctorFilters = {
  specialization?: string;
  city?: string;
  availableToday?: boolean;
  minRating?: number;
};
