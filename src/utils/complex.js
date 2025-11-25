/**
 * Complex number utility library for Tetris rotations and visualizations
 */

/**
 * Creates a complex number from real and imaginary parts
 * @param {number} real - Real part
 * @param {number} imag - Imaginary part
 * @returns {Object} Complex number object {re, im}
 */
export const complex = (real, imag) => ({ re: real, im: imag });

/**
 * Adds two complex numbers
 * @param {Object} z1 - First complex number
 * @param {Object} z2 - Second complex number
 * @returns {Object} Sum of z1 and z2
 */
export const add = (z1, z2) => complex(z1.re + z2.re, z1.im + z2.im);

/**
 * Subtracts two complex numbers
 * @param {Object} z1 - First complex number
 * @param {Object} z2 - Second complex number
 * @returns {Object} Difference z1 - z2
 */
export const subtract = (z1, z2) => complex(z1.re - z2.re, z1.im - z2.im);

/**
 * Multiplies two complex numbers
 * @param {Object} z1 - First complex number
 * @param {Object} z2 - Second complex number
 * @returns {Object} Product of z1 and z2
 */
export const multiply = (z1, z2) =>
  complex(z1.re * z2.re - z1.im * z2.im, z1.re * z2.im + z1.im * z2.re);

/**
 * Divides two complex numbers
 * @param {Object} z1 - Numerator
 * @param {Object} z2 - Denominator
 * @returns {Object} Quotient z1 / z2
 */
export const divide = (z1, z2) => {
  const denominator = z2.re * z2.re + z2.im * z2.im;
  if (denominator === 0) {
    return complex(Infinity, Infinity);
  }
  return complex(
    (z1.re * z2.re + z1.im * z2.im) / denominator,
    (z1.im * z2.re - z1.re * z2.im) / denominator
  );
};

/**
 * Calculates magnitude (modulus) of a complex number
 * @param {Object} z - Complex number
 * @returns {number} Magnitude |z|
 */
export const magnitude = (z) => Math.sqrt(z.re * z.re + z.im * z.im);

/**
 * Calculates phase (argument) of a complex number in radians
 * @param {Object} z - Complex number
 * @returns {number} Phase in radians
 */
export const phase = (z) => Math.atan2(z.im, z.re);

/**
 * Rotates a complex number by multiplying by i (90° counterclockwise)
 * This implements the key rotation z → i·z
 * Mathematical: (x + yi) × i = xi + yi² = -y + xi, so (x,y) → (-y, x)
 * Note: In screen coordinates where Y-down, this appears as clockwise rotation
 * @param {Object} z - Complex number  
 * @returns {Object} Rotated complex number
 */
export const rotateByI = (z) => complex(-z.im, z.re);

/**
 * Rotates a complex number by an angle in radians
 * @param {Object} z - Complex number
 * @param {number} angle - Angle in radians
 * @returns {Object} Rotated complex number
 */
export const rotate = (z, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return complex(z.re * cos - z.im * sin, z.re * sin + z.im * cos);
};

/**
 * Complex exponential function e^z
 * @param {Object} z - Complex number
 * @returns {Object} e^z
 */
export const exp = (z) => {
  const expReal = Math.exp(z.re);
  return complex(expReal * Math.cos(z.im), expReal * Math.sin(z.im));
};

/**
 * Complex square function z²
 * @param {Object} z - Complex number
 * @returns {Object} z²
 */
export const square = (z) => multiply(z, z);

/**
 * Complex reciprocal 1/z
 * @param {Object} z - Complex number
 * @returns {Object} 1/z
 */
export const reciprocal = (z) => divide(complex(1, 0), z);

/**
 * Converts complex number to polar form
 * @param {Object} z - Complex number
 * @returns {Object} Polar form {r: magnitude, theta: phase}
 */
export const toPolar = (z) => ({
  r: magnitude(z),
  theta: phase(z),
});

/**
 * Creates complex number from polar coordinates
 * @param {number} r - Magnitude
 * @param {number} theta - Phase in radians
 * @returns {Object} Complex number
 */
export const fromPolar = (r, theta) => complex(r * Math.cos(theta), r * Math.sin(theta));

/**
 * Applies a complex function to visualize transformations
 * @param {string} functionType - Type of function ('square', 'exp', 'reciprocal')
 * @param {Object} z - Complex number
 * @returns {Object} Transformed complex number
 */
export const applyFunction = (functionType, z) => {
  switch (functionType) {
    case 'rotation':
      return rotateByI(z);
    case 'square':
      return square(z);
    case 'exp':
      return exp(z);
    case 'reciprocal':
      return reciprocal(z);
    default:
      return z;
  }
};
