import { generateDoctor } from '@/data/generators/doctorGenerator';
import { generateProduct } from '@/data/generators/productGenerator';

describe('data generators', () => {
  it('generates consistent doctor data for same index', () => {
    const doctorA = generateDoctor(10);
    const doctorB = generateDoctor(10);
    expect(doctorA.id).toBe(doctorB.id);
    expect(doctorA.name).toBe(doctorB.name);
  });

  it('generates unique product ids', () => {
    const productA = generateProduct(1);
    const productB = generateProduct(2);
    expect(productA.id).not.toBe(productB.id);
  });
});
