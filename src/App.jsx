/* eslint-disable no-unused-vars */
import { useState } from 'react';
import TetrisGame from './components/TetrisGame';
import ComplexVisualizer from './components/ComplexVisualizer';
/* eslint-enable no-unused-vars */
import './App.css';

function App() {
  const [currentTetrisPiece, setCurrentTetrisPiece] = useState(null);

  const handlePieceRotate = (pieceData) => {
    setCurrentTetrisPiece(pieceData);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Complex Tetris & Visualizer</h1>
        <p className="subtitle">Tetris with complex number rotations + function visualization</p>
      </header>
      <main className="app-main">
        <div className="panel tetris-panel">
          <TetrisGame onRotate={handlePieceRotate} />
        </div>
        <div className="panel visualizer-panel">
          <ComplexVisualizer tetrisPiece={currentTetrisPiece} />
        </div>
      </main>
      <footer className="app-footer">
        <p>
          Using complex numbers for rotations: z → i·z (90° rotation) | Visualizing f(z) = z², eᶻ,
          1/z
        </p>
      </footer>
    </div>
  );
}

export default App;
