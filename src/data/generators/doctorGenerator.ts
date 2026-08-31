import { pick, seededRandom } from '@/core/utils/helpers';

const SPECIALIZATIONS = [
  'Ayurveda',
  'Panchakarma',
  'Yoga Therapy',
  'Naturopathy',
  'Herbal Medicine',
  'Diet & Nutrition',
  'Skin Care',
  'Pain Management',
] as const;

const LANGUAGES = ['Hindi', 'English', 'Sanskrit', 'Tamil', 'Marathi', 'Gujarati'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Jaipur', 'Ahmedabad', 'Chennai'];

const FIRST_NAMES = ['Ananya', 'Ravi', 'Priya', 'Arjun', 'Meera', 'Vikram', 'Kavya', 'Rohan'];
const LAST_NAMES = ['Sharma', 'Patel', 'Iyer', 'Gupta', 'Reddy', 'Nair', 'Joshi', 'Singh'];

const BIOS = [
  'Practices at Amrutam clinic — focuses on diet-led healing.',
  'Former hospital physician, now full-time Ayurveda.',
  'Known for gentle Panchakarma protocols.',
  'Consults in Hindi and English; weekend slots fill fast.',
  'Trained in Kerala; 10+ years in private practice.',
];

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  consultationFee: number;
  languages: string[];
  city: string;
  availableToday: boolean;
  bio: string;
};

export function generateDoctor(index: number): Doctor {
  const rand = seededRandom(index + 42);
  const first = pick(FIRST_NAMES, rand);
  const last = pick(LAST_NAMES, rand);
  const specialization = pick([...SPECIALIZATIONS], rand);

  return {
    id: `doc_${index}`,
    name: `Dr. ${first} ${last}`,
    specialization,
    experienceYears: 3 + Math.floor(rand() * 25),
    rating: Math.round((3.5 + rand() * 1.5) * 10) / 10,
    consultationFee: 300 + Math.floor(rand() * 12) * 100,
    languages: [pick(LANGUAGES, rand), pick(LANGUAGES, rand)].filter(
      (v, i, a) => a.indexOf(v) === i,
    ),
    city: pick(CITIES, rand),
    availableToday: rand() > 0.3,
    bio: pick(BIOS, rand),
  };
}

export function generateDoctors(count: number): Doctor[] {
  return Array.from({ length: count }, (_, i) => generateDoctor(i));
}
