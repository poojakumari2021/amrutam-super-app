import { pick, seededRandom } from '@/core/utils/helpers';

export type HealthRecordType =
  | 'lab_report'
  | 'prescription'
  | 'consultation'
  | 'vaccination'
  | 'allergy';

export type HealthRecord = {
  id: string;
  type: HealthRecordType;
  title: string;
  date: string;
  doctorName?: string;
  tags: string[];
  summary: string;
  attachmentType?: 'image' | 'pdf';
  attachmentLabel?: string;
};

const RECORD_TYPES: HealthRecordType[] = [
  'lab_report',
  'prescription',
  'consultation',
  'vaccination',
  'allergy',
];

const TAGS = ['routine', 'urgent', 'follow-up', 'chronic', 'preventive', 'ayurveda'];

export function generateHealthRecord(index: number): HealthRecord {
  const rand = seededRandom(index + 5000);
  const type = pick(RECORD_TYPES, rand);
  const daysAgo = Math.floor(rand() * 365 * 3);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const titles: Record<HealthRecordType, string> = {
    lab_report: 'Complete Blood Count',
    prescription: 'Herbal Medicine Prescription',
    consultation: 'Ayurvedic Consultation',
    vaccination: 'Seasonal Flu Vaccine',
    allergy: 'Peanut Allergy Record',
  };

  return {
    id: `rec_${index}`,
    type,
    title: titles[type],
    date: date.toISOString(),
    doctorName: type !== 'allergy' ? `Dr. ${pick(['Sharma', 'Patel', 'Iyer'], rand)}` : undefined,
    tags: [pick(TAGS, rand), pick(TAGS, rand)].filter((v, i, a) => a.indexOf(v) === i),
    summary: `Health record for ${titles[type].toLowerCase()} from ${date.toLocaleDateString()}.`,
    attachmentType: rand() > 0.5 ? 'pdf' : 'image',
    attachmentLabel: type === 'lab_report' ? 'Lab_Report.pdf' : 'Attachment',
  };
}

export function generateHealthRecords(count: number): HealthRecord[] {
  return Array.from({ length: count }, (_, i) => generateHealthRecord(i))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
