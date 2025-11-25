# Complex Tetris & Visualizer

A modern web application combining a playable Tetris game with complex number visualizations. Built with React, Canvas API, and mathematical elegance.

## Features

### 🎮 Complex Tetris Game
- **Complex Number Rotations**: Tetris pieces rotate using complex number mathematics (z → i·z for 90° rotation)
- **Classic Gameplay**: Traditional Tetris mechanics with modern UI
- **Score Tracking**: Keep track of your score, level, and cleared lines
- **Responsive Controls**: Keyboard controls with visual feedback
- **Game States**: Pause, resume, and restart functionality

### 📊 Complex Function Visualizer
- **Three Complex Functions**:
  - f(z) = z² (square function)
  - f(z) = eᶻ (exponential function)
  - f(z) = 1/z (reciprocal function)
- **Animated Transformations**: Watch the complex plane transform in real-time
- **Magnitude & Phase Overlays**: Toggle visual representation of magnitude (brightness) and phase (color hue)
- **Unit Circle Tracking**: See how the unit circle transforms under each function
- **Rotation Visualization**: Highlighted z → i·z rotations showing 90° counterclockwise rotation

### 🎨 User Interface
- **Modern Design**: Gradient backgrounds and smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Side-by-side Panels**: Tetris game and visualizer displayed together
- **Interactive Controls**: Easy-to-use buttons and toggles

## Mathematical Background

### Complex Number Rotation Theory

This project demonstrates the **elegance of complex number rotations** compared to traditional matrix methods.

#### Why Complex Numbers for Rotation?

**Traditional approach** (Rotation matrix for 90° CCW):
```
[x']   [cos(90°)  -sin(90°)] [x]   [0  -1] [x]   [-y]
[y'] = [sin(90°)   cos(90°)] [y] = [1   0] [y] = [x]
```

**Complex number approach**:
```
z' = i · z
where z = x + yi and i² = -1

Proof:
i · (x + yi) = ix + i²y = ix - y = -y + ix
Therefore: (x, y) → (-y, x)  ✓
```

**Advantages**:
- Single multiplication operation instead of matrix multiplication
- More intuitive (rotation = multiplication by unit complex number)
- Easier to compose rotations: (i·z)·i = i²·z = -z (180° rotation)
- Generalizes to arbitrary angles: e^(iθ)·z rotates by angle θ

#### Tetris Implementation

Each piece is defined as an array of complex numbers relative to origin:
```javascript
T-piece: [(-1, 0), (0, 0), (1, 0), (0, 1)]
    □         blocks centered at origin
  □ ■ □       rotates around the middle block
```

Rotation is simply: `piece.map(z => i·z)`

### Complex Function Visualizer

The visualizer uses **domain coloring** to represent complex functions f: ℂ → ℂ.

#### Domain Coloring Technique

Since complex functions map 2D → 2D (would need 4D to graph traditionally), we use color encoding:
- **Hue (color)** = arg(f(z)) ∈ [-π, π] mapped to [0°, 360°]
- **Lightness (brightness)** = |f(z)| (magnitude)

**Color wheel mapping**:
- -π (negative real axis) → Red (0°)
- -π/2 (negative imaginary axis) → Green (90°)  
- 0 (positive real axis) → Cyan (180°)
- π/2 (positive imaginary axis) → Blue (270°)
- π wraps back to Red

#### The Three Functions

**1. f(z) = z²** (Polynomial)
- Doubles argument: arg(z²) = 2·arg(z)
- Squares magnitude: |z²| = |z|²
- Critical point at z = 0
- Conformal (angle-preserving) everywhere except origin
- Unit circle maps to itself (since |z|=1 ⇒ |z²|=1)

**2. f(z) = eᶻ** (Transcendental)
- Euler's formula: e^(x+iy) = e^x · (cos y + i sin y)
- Magnitude: |e^z| = e^(Re z) (depends only on real part)
- Phase: arg(e^z) = Im(z) (mod 2π) (periodic in imaginary direction)
- Maps vertical strips to sectors around origin
- Entire function (holomorphic everywhere)
- No zeros

**3. f(z) = 1/z** (Rational/Meromorphic)
- Inverts magnitude: |1/z| = 1/|z|
- Reverses phase: arg(1/z) = -arg(z)
- Pole (singularity) at z = 0
- Swaps interior/exterior of unit circle
- Möbius transformation (conformal mapping)
- Unit circle maps to itself with reversed orientation

This project uses **complex numbers** to elegantly handle Tetris piece rotations. In the complex plane:
- Each block position is represented as a complex number z = x + yi
- Rotation by 90° counterclockwise is achieved by multiplying by i: z → i·z
- This is mathematically equivalent to: (x, y) → (-y, x)

The visualizer demonstrates three fundamental complex functions:
- **z²**: Doubles the angle and squares the magnitude
- **eᶻ**: The complex exponential, fundamental to Fourier analysis
- **1/z**: Inverts and reflects across the real axis

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/DevalPrime/Tetris.git
cd Tetris

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open in your browser at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint source code
- `npm run lint:fix` - Lint and fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Game Controls

### Tetris
- **←/→ Arrow Keys**: Move piece left/right
- **↑ Arrow or Space**: Rotate piece (z → i·z)
- **↓ Arrow**: Soft drop (move down faster)
- **Enter**: Hard drop (instant drop)
- **P**: Pause/Resume game
- **R**: Restart game (when game over)

### Visualizer
- **Function Buttons**: Select z², eᶻ, or 1/z
- **Magnitude Checkbox**: Toggle magnitude overlay
- **Phase Checkbox**: Toggle phase overlay
- **Animate Button**: Replay transformation animation

## Project Structure

```
Tetris/
├── src/
│   ├── components/
│   │   ├── TetrisGame.jsx        # Tetris game component
│   │   ├── TetrisGame.css        # Tetris styles
│   │   ├── ComplexVisualizer.jsx # Function visualizer
│   │   └── ComplexVisualizer.css # Visualizer styles
│   ├── utils/
│   │   ├── complex.js            # Complex number library
│   │   └── tetris.js             # Tetris game logic
│   ├── tests/
│   │   ├── complex.test.js       # Complex number tests
│   │   └── tetris.test.js        # Tetris logic tests
│   ├── App.jsx                   # Main application
│   ├── App.css                   # App styles
│   └── main.jsx                  # Entry point
├── public/                       # Static assets
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── jest.config.js               # Jest configuration
├── .eslintrc.json               # ESLint configuration
├── .prettierrc.json             # Prettier configuration
├── package.json                 # Dependencies and scripts
└── LICENSE                      # MIT License

## Technologies Used

- **React 19**: Modern UI framework
- **Vite**: Fast build tool and dev server
- **Canvas API**: For rendering game and visualizations
- **Jest**: Unit testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Complex Number Math**: Custom implementation for rotations

## Testing

The project includes comprehensive unit tests for:
- Complex number arithmetic operations
- Rotation and transformation functions
- Tetris game logic (piece movement, collision detection, line clearing)
- Score calculation

Run tests with:
```bash
npm test
```

## Code Quality

The project follows best practices with:
- **ESLint**: Enforces code style and catches errors
- **Prettier**: Ensures consistent code formatting
- **Modular Architecture**: Separated concerns (UI, logic, utilities)
- **Comprehensive Tests**: Unit tests for core functionality
- **JSDoc Comments**: Documented functions with type information

## Browser Support

Works on all modern browsers supporting:
- ES2021 features
- Canvas API
- CSS Grid and Flexbox

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by classic Tetris and complex analysis
- Uses complex number mathematics for elegant rotation implementation
- Built with modern web technologies

## Future Enhancements

Potential improvements:
- Additional complex functions (sin, cos, log)
- 3D visualization of complex surfaces
- Multiplayer mode
- Custom color themes
- Sound effects and music
- High score persistence
- More piece types

---

**Enjoy playing Complex Tetris while exploring the beauty of complex mathematics!** 🎮📊✨

