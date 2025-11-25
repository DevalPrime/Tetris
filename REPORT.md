# Repository Report: Complex Tetris & Visualizer

## Overview

This repository contains a modern web application that combines a playable Tetris game with complex number visualizations. The project demonstrates the mathematical elegance of using complex numbers for geometric transformations, particularly rotations, as an alternative to traditional matrix-based approaches.

**Tech Stack:**
- React 19 (UI framework)
- Vite 7 (build tool and dev server)
- Canvas API (game rendering and visualizations)
- Jest 30 (testing framework)
- ESLint 9 / Prettier 3 (code quality)

## Project Structure

```
Tetris/
├── src/
│   ├── components/
│   │   ├── TetrisGame.jsx           # Standard Tetris game component
│   │   ├── TetrisGame.css           # Tetris game styles
│   │   ├── ComplexTetrisGame.jsx    # Experimental complex mode game
│   │   ├── ComplexVisualizer.jsx    # Complex function visualizer
│   │   └── ComplexVisualizer.css    # Visualizer styles
│   ├── utils/
│   │   ├── complex.js               # Complex number library
│   │   └── tetris.js                # Tetris game logic
│   ├── tests/
│   │   ├── complex.test.js          # Complex number unit tests
│   │   └── tetris.test.js           # Tetris logic unit tests
│   ├── App.jsx                      # Main application component
│   ├── App.css                      # Global application styles
│   └── main.jsx                     # Application entry point
├── .github/
│   └── workflows/
│       └── ci.yml                   # CI/CD pipeline configuration
├── index.html                       # HTML template
├── vite.config.js                   # Vite configuration
├── jest.config.js                   # Jest configuration
├── eslint.config.js                 # ESLint configuration
├── .prettierrc.json                 # Prettier configuration
├── package.json                     # Project dependencies and scripts
├── LICENSE                          # MIT License
└── README.md                        # Project documentation
```

## Core Components

### 1. TetrisGame.jsx

The main Tetris game component implementing classic Tetris mechanics with complex number rotations.

**Key Features:**
- Canvas-based rendering of the game board
- Real-time piece movement and rotation
- Score, level, and line tracking
- Game state management (pause, game over)
- Keyboard controls for gameplay

**Controls:**
- `←/→` Arrow Keys: Move piece left/right
- `↑` Arrow / Space: Rotate piece (z → i·z)
- `↓` Arrow: Soft drop
- Enter: Hard drop
- P: Pause/Resume
- R: Restart (when game over)

### 2. ComplexVisualizer.jsx

A visualization tool for complex functions that demonstrates the mathematical concepts used in the game.

**Visualized Functions:**
1. **f(z) = i·z** - Tetris rotation (90° counterclockwise)
2. **f(z) = z²** - Square function (doubles angle, squares magnitude)
3. **f(z) = eᶻ** - Complex exponential
4. **f(z) = 1/z** - Reciprocal (inversion)

**Features:**
- Domain coloring visualization
- Animated transformations
- Toggle for magnitude/phase overlays
- Unit circle transformation tracking
- Real-time Tetris piece visualization

## Utility Modules

### complex.js

A comprehensive complex number library providing:

| Function | Description |
|----------|-------------|
| `complex(re, im)` | Creates a complex number |
| `add(z1, z2)` | Addition |
| `subtract(z1, z2)` | Subtraction |
| `multiply(z1, z2)` | Multiplication |
| `divide(z1, z2)` | Division |
| `magnitude(z)` | Calculates \|z\| |
| `phase(z)` | Calculates arg(z) |
| `rotateByI(z)` | Rotation by i (90° CCW) |
| `rotate(z, angle)` | Rotation by arbitrary angle |
| `exp(z)` | Complex exponential eᶻ |
| `square(z)` | z² function |
| `reciprocal(z)` | 1/z function |
| `toPolar(z)` | Convert to polar form |
| `fromPolar(r, θ)` | Create from polar coordinates |
| `applyFunction(type, z)` | Apply named transformation |

### tetris.js

Tetris game logic using complex numbers for piece representation:

**Piece Definitions:**
- All 7 standard Tetriminos (I, O, T, S, Z, J, L)
- Each piece defined as array of complex number positions
- Colors mapped to each piece type

**Core Functions:**
| Function | Description |
|----------|-------------|
| `createEmptyBoard()` | Initialize 10x20 game board |
| `getRandomPieceType()` | Select random piece |
| `rotatePiece(piece)` | Rotate using complex multiplication |
| `translatePiece(piece, offset)` | Move piece by offset |
| `complexToBoard(pos, center)` | Convert to board coordinates |
| `isValidPosition(piece, pos, board)` | Check collision/bounds |
| `lockPiece(piece, pos, board, color)` | Place piece on board |
| `clearLines(board)` | Clear completed rows |
| `calculateScore(lines, level)` | Calculate score |
| `createInitialState()` | Initialize game state |

**Constants:**
- `BOARD_WIDTH`: 10 cells
- `BOARD_HEIGHT`: 20 cells
- `CELL_SIZE`: 30 pixels

## Testing

The project includes comprehensive unit tests using Jest:

### complex.test.js
- Complex number creation
- Arithmetic operations (add, subtract, multiply, divide)
- Division by zero handling
- Magnitude and phase calculations
- Rotation functions (rotateByI, rotate)
- Complex functions (exp, square, reciprocal)
- Polar coordinate conversions
- applyFunction dispatcher

### tetris.test.js
- Board creation and dimensions
- Piece definitions and colors
- Piece rotation (verifies 4 rotations return to original)
- Piece translation
- Coordinate conversion
- Position validation (boundaries, collisions)
- Piece locking
- Line clearing (single, multiple, incomplete)
- Score calculation at different levels
- Initial game state

## CI/CD Pipeline

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that runs on:
- Push to `main` and `copilot/*` branches
- Pull requests to `main`

**Pipeline Steps:**
1. Checkout code
2. Setup Node.js (matrix: 18.x, 20.x)
3. Install dependencies (`npm ci`)
4. Run linter (`npm run lint`)
5. Check formatting (`npm run format:check`)
6. Run tests (`npm test`)
7. Build project (`npm run build`)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | ESLint source code |
| `npm run lint:fix` | Lint and auto-fix |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |

## Mathematical Background

### Why Complex Numbers for Rotation?

Traditional 2D rotation requires matrix multiplication:
```
[x']   [cos θ  -sin θ] [x]
[y'] = [sin θ   cos θ] [y]
```

Complex number rotation is simpler:
```
z' = e^(iθ) · z
```

For 90° rotation (Tetris):
```
z' = i · z
(x + yi) · i = -y + xi
Therefore: (x, y) → (-y, x)
```

**Advantages:**
- Single multiplication vs matrix multiplication
- Intuitive (rotation = multiplication by unit complex number)
- Composable: `(i·z)·i = i²·z = -z` (180° rotation)
- Generalizes to arbitrary angles

---

## Experimental Section: Complex Tetris Mode

> ⚠️ **EXPERIMENTAL FEATURE** - This section documents features that are experimental and may behave unexpectedly.

### ComplexTetrisGame.jsx

The Complex Tetris Mode is an experimental game variant that allows players to transform Tetris pieces using arbitrary complex functions, not just standard 90° rotations.

**Key Differences from Standard Mode:**

1. **Multiple Transformation Functions:**
   - `i·z` - Standard 90° rotation
   - `z²` - Square transformation
   - `eᶻ` - Exponential transformation
   - `1/z` - Reciprocal/inversion transformation

2. **Grid Snapping:**
   - Since complex functions can produce non-integer coordinates, results are snapped to the nearest grid position
   - This can cause unexpected piece shapes after transformation

3. **Transform Selection UI:**
   - Players select which transformation to apply before pressing the rotate key
   - Transform buttons display mathematical notation (i·z, z², eᶻ, 1/z)

4. **Wall Kick System:**
   - When a transformation produces invalid positions, the game attempts horizontal offsets (-2 to +2)
   - This allows more transformations to succeed

### Technical Implementation

```javascript
const applyComplexTransform = useCallback((piece, transform) => {
  // Apply the selected complex function
  const transformed = piece.map(pos => Complex.applyFunction(transform, pos));
  // Snap to nearest grid position
  const snapped = transformed.map(pos => 
    Complex.complex(Math.round(pos.re), Math.round(pos.im))
  );
  return snapped;
}, []);
```

### Known Limitations

1. **Non-standard Piece Shapes:** Functions like z² and 1/z can create unusual piece configurations that don't resemble standard Tetriminos.

2. **Unpredictable Behavior:** The exponential function (eᶻ) can produce very large or very small values depending on the piece position, leading to extreme transformations.

3. **Grid Snapping Artifacts:** Rounding to integer positions can cause overlapping blocks or disconnected pieces.

4. **Game Balance:** The experimental mode is not balanced for traditional Tetris gameplay; it's designed for mathematical exploration.

### Usage

To access Complex Tetris Mode:
1. Click the "🎮 Try Complex Tetris Mode →" button in the header
2. Select a transformation function from the buttons above the game board
3. Use ↑/Space to apply the selected transformation
4. Click "← Back to Normal Tetris" to return to standard mode

### Future Experimental Ideas

The codebase is structured to support additional experimental features:
- Additional complex functions (sin, cos, log)
- Custom function input
- Visualization of transformation history
- Piece animation during transformation

---

## Browser Support

The application requires modern browser features:
- ES2021
- Canvas API
- CSS Grid and Flexbox

## License

MIT License - see [LICENSE](LICENSE) for details.

---

*Report generated for the DevalPrime/Tetris repository*
