import { create } from 'zustand';
import type { DoctorFilters } from '@/modules/consultation/types';

type ConsultationState = {
  search: string;
  filters: DoctorFilters;
  setSearch: (search: string) => void;
  setFilters: (filters: DoctorFilters) => void;
  resetFilters: () => void;
};

export const useConsultationStore = create<ConsultationState>(set => ({
  search: '',
  filters: {},
  setSearch: search => set({ search }),
  setFilters: filters => set({ filters }),
  resetFilters: () => set({ filters: {} }),
}));
