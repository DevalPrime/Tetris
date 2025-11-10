import { useEffect, useRef, useState, useCallback } from 'react';
import * as Complex from '../utils/complex.js';
import './ComplexVisualizer.css';

const ComplexVisualizer = () => {
  const canvasRef = useRef(null);
  const [selectedFunction, setSelectedFunction] = useState('square');
  const [showMagnitude, setShowMagnitude] = useState(true);
  const [showPhase, setShowPhase] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  const GRID_SIZE = 400;
  const GRID_RANGE = 3; // -3 to 3 on both axes
  const GRID_STEP = 0.2;

  // Convert complex number to canvas coordinates
  const complexToCanvas = useCallback((z) => {
    const x = (z.re / GRID_RANGE) * (GRID_SIZE / 2) + GRID_SIZE / 2;
    const y = -(z.im / GRID_RANGE) * (GRID_SIZE / 2) + GRID_SIZE / 2;
    return { x, y };
  }, []);

  // Get color based on magnitude and phase
  const getComplexColor = (z, showMag, showPh) => {
    if (!showMag && !showPh) return 'rgba(100, 100, 100, 0.5)';

    const mag = Complex.magnitude(z);
    const ph = Complex.phase(z);

    let hue = 0;
    let saturation = 0;
    let lightness = 50;

    if (showPh) {
      // Map phase (-π to π) to hue (0 to 360)
      hue = ((ph + Math.PI) / (2 * Math.PI)) * 360;
      saturation = 80;
    }

    if (showMag) {
      // Map magnitude to lightness
      const normalizedMag = Math.min(mag / 2, 1);
      lightness = 20 + normalizedMag * 60;
    }

    return `hsla(${hue}, ${saturation}%, ${lightness}%, 0.7)`;
  };

  // Draw grid and axes
  const drawGrid = (ctx) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Draw grid lines
    for (let i = -GRID_RANGE; i <= GRID_RANGE; i += 0.5) {
      // Vertical lines
      const x = (i / GRID_RANGE) * (GRID_SIZE / 2) + GRID_SIZE / 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, GRID_SIZE);
      ctx.stroke();

      // Horizontal lines
      const y = -(i / GRID_RANGE) * (GRID_SIZE / 2) + GRID_SIZE / 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(GRID_SIZE, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    // Real axis
    ctx.beginPath();
    ctx.moveTo(0, GRID_SIZE / 2);
    ctx.lineTo(GRID_SIZE, GRID_SIZE / 2);
    ctx.stroke();

    // Imaginary axis
    ctx.beginPath();
    ctx.moveTo(GRID_SIZE / 2, 0);
    ctx.lineTo(GRID_SIZE / 2, GRID_SIZE);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.fillText('Re', GRID_SIZE - 20, GRID_SIZE / 2 - 10);
    ctx.fillText('Im', GRID_SIZE / 2 + 10, 15);
  };

  // Draw complex function visualization
  const drawVisualization = useCallback(
    (func, progress) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, GRID_SIZE, GRID_SIZE);

      drawGrid(ctx);

      // Draw transformed grid
      for (let re = -GRID_RANGE; re <= GRID_RANGE; re += GRID_STEP) {
        for (let im = -GRID_RANGE; im <= GRID_RANGE; im += GRID_STEP) {
          const z = Complex.complex(re, im);

          // Apply transformation with animation
          let transformed;
          if (progress < 1 && isAnimating) {
            // Interpolate between original and transformed
            const fullTransform = Complex.applyFunction(func, z);
            transformed = Complex.complex(
              z.re + (fullTransform.re - z.re) * progress,
              z.im + (fullTransform.im - z.im) * progress
            );
          } else {
            transformed = Complex.applyFunction(func, z);
          }

          const { x, y } = complexToCanvas(transformed);

          // Only draw if within bounds
          if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
            const color = getComplexColor(transformed, showMagnitude, showPhase);
            ctx.fillStyle = color;
            ctx.fillRect(x - 2, y - 2, 4, 4);
          }
        }
      }

      // Highlight unit circle transformation
      ctx.strokeStyle = '#0f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      let firstPoint = true;
      for (let theta = 0; theta <= 2 * Math.PI; theta += 0.05) {
        const z = Complex.fromPolar(1, theta);

        let transformed;
        if (progress < 1 && isAnimating) {
          const fullTransform = Complex.applyFunction(func, z);
          transformed = Complex.complex(
            z.re + (fullTransform.re - z.re) * progress,
            z.im + (fullTransform.im - z.im) * progress
          );
        } else {
          transformed = Complex.applyFunction(func, z);
        }

        const { x, y } = complexToCanvas(transformed);

        if (firstPoint) {
          ctx.moveTo(x, y);
          firstPoint = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Highlight rotation z → i·z
      if (func === 'square' || !isAnimating) {
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;

        // Draw arrow showing z → i·z rotation for a sample point
        const sampleZ = Complex.complex(1.5, 0.5);
        const rotated = Complex.rotateByI(sampleZ);

        const start = complexToCanvas(sampleZ);
        const end = complexToCanvas(rotated);

        // Arrow line
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        // Arrow head
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - 10 * Math.cos(angle - Math.PI / 6),
          end.y - 10 * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - 10 * Math.cos(angle + Math.PI / 6),
          end.y - 10 * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
      }

      // Function label
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px monospace';
      const funcLabels = {
        square: 'f(z) = z²',
        exp: 'f(z) = eᶻ',
        reciprocal: 'f(z) = 1/z',
      };
      ctx.fillText(funcLabels[func], 10, 25);
    },
    [complexToCanvas, showMagnitude, showPhase, isAnimating]
  );

  // Animation loop
  useEffect(() => {
    if (!isAnimating) {
      drawVisualization(selectedFunction, 1);
      return;
    }

    const startTime = Date.now();
    const duration = 2000; // 2 seconds

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      drawVisualization(selectedFunction, progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, selectedFunction, showMagnitude, showPhase, drawVisualization]);

  // Redraw when settings change (without animation)
  useEffect(() => {
    if (!isAnimating) {
      drawVisualization(selectedFunction, 1);
    }
  }, [selectedFunction, showMagnitude, showPhase, isAnimating, drawVisualization]);

  const handleFunctionChange = (func) => {
    setSelectedFunction(func);
    setIsAnimating(true);
  };

  return (
    <div className="complex-visualizer">
      <div className="visualizer-header">
        <h2>Complex Function Visualizer</h2>
      </div>
      <canvas ref={canvasRef} width={GRID_SIZE} height={GRID_SIZE} className="visualizer-canvas" />
      <div className="visualizer-controls">
        <div className="function-selector">
          <h3>Select Function</h3>
          <div className="function-buttons">
            <button
              className={selectedFunction === 'square' ? 'active' : ''}
              onClick={() => handleFunctionChange('square')}
            >
              z²
            </button>
            <button
              className={selectedFunction === 'exp' ? 'active' : ''}
              onClick={() => handleFunctionChange('exp')}
            >
              eᶻ
            </button>
            <button
              className={selectedFunction === 'reciprocal' ? 'active' : ''}
              onClick={() => handleFunctionChange('reciprocal')}
            >
              1/z
            </button>
          </div>
        </div>
        <div className="overlay-toggles">
          <h3>Overlays</h3>
          <label>
            <input
              type="checkbox"
              checked={showMagnitude}
              onChange={(e) => setShowMagnitude(e.target.checked)}
            />
            Magnitude
          </label>
          <label>
            <input
              type="checkbox"
              checked={showPhase}
              onChange={(e) => setShowPhase(e.target.checked)}
            />
            Phase
          </label>
        </div>
        <button
          className="animate-button"
          onClick={() => {
            setIsAnimating(true);
          }}
        >
          Animate Transformation
        </button>
      </div>
      <div className="visualizer-info">
        <p>🟢 Green: Unit circle transformation</p>
        <p>🟡 Yellow: z → i·z rotation (90° CCW)</p>
        <p>Color hue represents phase, brightness represents magnitude</p>
      </div>
    </div>
  );
};

export default ComplexVisualizer;
