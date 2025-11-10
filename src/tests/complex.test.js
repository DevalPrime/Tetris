import * as Complex from '../utils/complex.js';

describe('Complex Number Utilities', () => {
  describe('complex creation', () => {
    test('creates a complex number', () => {
      const z = Complex.complex(3, 4);
      expect(z.re).toBe(3);
      expect(z.im).toBe(4);
    });
  });

  describe('basic arithmetic', () => {
    test('adds two complex numbers', () => {
      const z1 = Complex.complex(1, 2);
      const z2 = Complex.complex(3, 4);
      const result = Complex.add(z1, z2);
      expect(result.re).toBe(4);
      expect(result.im).toBe(6);
    });

    test('subtracts two complex numbers', () => {
      const z1 = Complex.complex(5, 7);
      const z2 = Complex.complex(2, 3);
      const result = Complex.subtract(z1, z2);
      expect(result.re).toBe(3);
      expect(result.im).toBe(4);
    });

    test('multiplies two complex numbers', () => {
      const z1 = Complex.complex(1, 2);
      const z2 = Complex.complex(3, 4);
      const result = Complex.multiply(z1, z2);
      // (1+2i)(3+4i) = 3 + 4i + 6i + 8i² = 3 + 10i - 8 = -5 + 10i
      expect(result.re).toBe(-5);
      expect(result.im).toBe(10);
    });

    test('divides two complex numbers', () => {
      const z1 = Complex.complex(1, 0);
      const z2 = Complex.complex(0, 1);
      const result = Complex.divide(z1, z2);
      expect(result.re).toBeCloseTo(0);
      expect(result.im).toBeCloseTo(-1);
    });

    test('handles division by zero', () => {
      const z1 = Complex.complex(1, 0);
      const z2 = Complex.complex(0, 0);
      const result = Complex.divide(z1, z2);
      expect(result.re).toBe(Infinity);
      expect(result.im).toBe(Infinity);
    });
  });

  describe('magnitude and phase', () => {
    test('calculates magnitude correctly', () => {
      const z = Complex.complex(3, 4);
      expect(Complex.magnitude(z)).toBe(5);
    });

    test('calculates phase correctly', () => {
      const z = Complex.complex(1, 1);
      expect(Complex.phase(z)).toBeCloseTo(Math.PI / 4);
    });

    test('calculates phase for negative real axis', () => {
      const z = Complex.complex(-1, 0);
      expect(Complex.phase(z)).toBeCloseTo(Math.PI);
    });
  });

  describe('rotations', () => {
    test('rotates by i (90 degrees counterclockwise)', () => {
      const z = Complex.complex(1, 0);
      const rotated = Complex.rotateByI(z);
      expect(rotated.re).toBeCloseTo(0);
      expect(rotated.im).toBeCloseTo(1);
    });

    test('rotates by i twice (180 degrees)', () => {
      const z = Complex.complex(1, 0);
      const rotated = Complex.rotateByI(Complex.rotateByI(z));
      expect(rotated.re).toBeCloseTo(-1);
      expect(rotated.im).toBeCloseTo(0);
    });

    test('rotates by angle', () => {
      const z = Complex.complex(1, 0);
      const rotated = Complex.rotate(z, Math.PI / 2);
      expect(rotated.re).toBeCloseTo(0);
      expect(rotated.im).toBeCloseTo(1);
    });
  });

  describe('complex functions', () => {
    test('calculates exponential', () => {
      const z = Complex.complex(0, Math.PI);
      const result = Complex.exp(z);
      // e^(iπ) = -1
      expect(result.re).toBeCloseTo(-1);
      expect(result.im).toBeCloseTo(0);
    });

    test('calculates square', () => {
      const z = Complex.complex(1, 1);
      const result = Complex.square(z);
      // (1+i)² = 1 + 2i + i² = 2i
      expect(result.re).toBeCloseTo(0);
      expect(result.im).toBeCloseTo(2);
    });

    test('calculates reciprocal', () => {
      const z = Complex.complex(0, 1);
      const result = Complex.reciprocal(z);
      // 1/i = -i
      expect(result.re).toBeCloseTo(0);
      expect(result.im).toBeCloseTo(-1);
    });
  });

  describe('polar coordinates', () => {
    test('converts to polar form', () => {
      const z = Complex.complex(1, 1);
      const polar = Complex.toPolar(z);
      expect(polar.r).toBeCloseTo(Math.sqrt(2));
      expect(polar.theta).toBeCloseTo(Math.PI / 4);
    });

    test('creates from polar coordinates', () => {
      const z = Complex.fromPolar(1, Math.PI / 2);
      expect(z.re).toBeCloseTo(0);
      expect(z.im).toBeCloseTo(1);
    });
  });

  describe('applyFunction', () => {
    test('applies square function', () => {
      const z = Complex.complex(2, 0);
      const result = Complex.applyFunction('square', z);
      expect(result.re).toBe(4);
      expect(result.im).toBe(0);
    });

    test('applies exp function', () => {
      const z = Complex.complex(0, 0);
      const result = Complex.applyFunction('exp', z);
      expect(result.re).toBeCloseTo(1);
      expect(result.im).toBeCloseTo(0);
    });

    test('applies reciprocal function', () => {
      const z = Complex.complex(2, 0);
      const result = Complex.applyFunction('reciprocal', z);
      expect(result.re).toBeCloseTo(0.5);
      expect(result.im).toBeCloseTo(0);
    });

    test('returns identity for unknown function', () => {
      const z = Complex.complex(2, 3);
      const result = Complex.applyFunction('unknown', z);
      expect(result).toEqual(z);
    });
  });
});
