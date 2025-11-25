import { useEffect, useRef, useState, useCallback } from 'react';
import * as Tetris from '../utils/tetris.js';
import './TetrisGame.css';

const TetrisGame = ({ onRotate }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(Tetris.createInitialState());
  const [showRotationVisualization, setShowRotationVisualization] = useState(false);
  const dropIntervalRef = useRef(null);

  // Draw the game board and current piece
  const draw = useCallback((state) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { board, currentPiece, piecePosition, currentPieceType } = state;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let y = 0; y <= Tetris.BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * Tetris.CELL_SIZE);
      ctx.lineTo(Tetris.BOARD_WIDTH * Tetris.CELL_SIZE, y * Tetris.CELL_SIZE);
      ctx.stroke();
    }
    for (let x = 0; x <= Tetris.BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * Tetris.CELL_SIZE, 0);
      ctx.lineTo(x * Tetris.CELL_SIZE, Tetris.BOARD_HEIGHT * Tetris.CELL_SIZE);
      ctx.stroke();
    }

    // Draw locked pieces on board
    board.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(
            x * Tetris.CELL_SIZE + 1,
            y * Tetris.CELL_SIZE + 1,
            Tetris.CELL_SIZE - 2,
            Tetris.CELL_SIZE - 2
          );
          ctx.strokeStyle = '#000';
          ctx.strokeRect(
            x * Tetris.CELL_SIZE + 1,
            y * Tetris.CELL_SIZE + 1,
            Tetris.CELL_SIZE - 2,
            Tetris.CELL_SIZE - 2
          );
        }
      });
    });

    // Draw current piece
    if (currentPiece && currentPieceType) {
      const color = Tetris.PIECE_COLORS[currentPieceType];
      ctx.fillStyle = color;
      currentPiece.forEach((pos) => {
        const { x, y } = Tetris.complexToBoard(pos, piecePosition);
        if (y >= 0) {
          ctx.fillRect(
            x * Tetris.CELL_SIZE + 1,
            y * Tetris.CELL_SIZE + 1,
            Tetris.CELL_SIZE - 2,
            Tetris.CELL_SIZE - 2
          );
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.strokeRect(
            x * Tetris.CELL_SIZE + 1,
            y * Tetris.CELL_SIZE + 1,
            Tetris.CELL_SIZE - 2,
            Tetris.CELL_SIZE - 2
          );
        }
      });
    }
  }, []);

  // Move piece down
  const moveDown = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) return prevState;

      const newPosition = {
        x: prevState.piecePosition.x,
        y: prevState.piecePosition.y + 1,
      };

      if (Tetris.isValidPosition(prevState.currentPiece, newPosition, prevState.board)) {
        return { ...prevState, piecePosition: newPosition };
      } else {
        // Lock piece and spawn new one
        const newBoard = Tetris.lockPiece(
          prevState.currentPiece,
          prevState.piecePosition,
          prevState.board,
          Tetris.PIECE_COLORS[prevState.currentPieceType]
        );

        const { newBoard: clearedBoard, linesCleared } = Tetris.clearLines(newBoard);
        const newScore = prevState.score + Tetris.calculateScore(linesCleared, prevState.level);
        const newLines = prevState.lines + linesCleared;
        const newLevel = Math.floor(newLines / 10);

        const nextPiece = Tetris.PIECES[prevState.nextPieceType];
        const nextPosition = { x: 5, y: 0 };
        const newNextPieceType = Tetris.getRandomPieceType();

        // Check game over
        if (!Tetris.isValidPosition(nextPiece, nextPosition, clearedBoard)) {
          return { ...prevState, gameOver: true };
        }

        return {
          ...prevState,
          board: clearedBoard,
          currentPiece: nextPiece,
          currentPieceType: prevState.nextPieceType,
          piecePosition: nextPosition,
          nextPieceType: newNextPieceType,
          score: newScore,
          lines: newLines,
          level: newLevel,
        };
      }
    });
  }, []);

  // Move piece horizontally
  const moveHorizontal = useCallback((direction) => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) return prevState;

      const newPosition = {
        x: prevState.piecePosition.x + direction,
        y: prevState.piecePosition.y,
      };

      if (Tetris.isValidPosition(prevState.currentPiece, newPosition, prevState.board)) {
        return { ...prevState, piecePosition: newPosition };
      }
      return prevState;
    });
  }, []);

  // Rotate piece using complex number multiplication by i
  const rotatePiece = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) return prevState;
      if (prevState.currentPieceType === 'O') return prevState; // O piece doesn't rotate

      const rotatedPiece = Tetris.rotatePiece(prevState.currentPiece);

      if (Tetris.isValidPosition(rotatedPiece, prevState.piecePosition, prevState.board)) {
        setShowRotationVisualization(true);
        setTimeout(() => setShowRotationVisualization(false), 300);
        
        // Notify parent component about the rotation
        if (onRotate) {
          onRotate({
            piece: rotatedPiece,
            type: prevState.currentPieceType,
            position: prevState.piecePosition,
          });
        }
        
        return { ...prevState, currentPiece: rotatedPiece };
      }
      return prevState;
    });
  }, [onRotate]);

  // Hard drop
  const hardDrop = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) return prevState;

      let newY = prevState.piecePosition.y;
      while (
        Tetris.isValidPosition(
          prevState.currentPiece,
          { x: prevState.piecePosition.x, y: newY + 1 },
          prevState.board
        )
      ) {
        newY++;
      }
      return { ...prevState, piecePosition: { x: prevState.piecePosition.x, y: newY } };
    });
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setGameState((prevState) => ({ ...prevState, isPaused: !prevState.isPaused }));
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(Tetris.createInitialState());
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
        case ' ':
          e.preventDefault();
          rotatePiece();
          break;
        case 'p':
        case 'P':
          togglePause();
          break;
        case 'r':
        case 'R':
          if (gameState.gameOver) {
            resetGame();
          }
          break;
        case 'Enter':
          e.preventDefault();
          hardDrop();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveHorizontal, moveDown, rotatePiece, togglePause, resetGame, hardDrop, gameState.gameOver]);

  // Game loop for auto-drop
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
        dropIntervalRef.current = null;
      }
      return;
    }

    const dropInterval = Math.max(100, 1000 - gameState.level * 100);
    dropIntervalRef.current = setInterval(moveDown, dropInterval);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [gameState.level, gameState.gameOver, gameState.isPaused, moveDown]);

  // Drawing loop
  useEffect(() => {
    draw(gameState);
  }, [gameState, draw]);

  // Send current piece to visualizer whenever it changes
  useEffect(() => {
    if (onRotate && gameState.currentPiece && gameState.currentPieceType) {
      onRotate({
        piece: gameState.currentPiece,
        type: gameState.currentPieceType,
        position: gameState.piecePosition,
      });
    }
  }, [gameState.currentPiece, gameState.currentPieceType, gameState.piecePosition, onRotate]);

  return (
    <div className="tetris-game">
      <div className="game-header">
        <h2>Complex Tetris</h2>
        {showRotationVisualization && <div className="rotation-indicator">z → i·z rotation!</div>}
      </div>
      <div className="game-container">
        <div className="game-info">
          <div className="info-panel">
            <h3>Score</h3>
            <p className="score">{gameState.score}</p>
          </div>
          <div className="info-panel">
            <h3>Level</h3>
            <p>{gameState.level}</p>
          </div>
          <div className="info-panel">
            <h3>Lines</h3>
            <p>{gameState.lines}</p>
          </div>
          <div className="info-panel">
            <h3>Next</h3>
            <div
              className="next-piece"
              style={{ color: Tetris.PIECE_COLORS[gameState.nextPieceType] }}
            >
              {gameState.nextPieceType}
            </div>
          </div>
        </div>
        <canvas
          ref={canvasRef}
          width={Tetris.BOARD_WIDTH * Tetris.CELL_SIZE}
          height={Tetris.BOARD_HEIGHT * Tetris.CELL_SIZE}
          className="game-canvas"
        />
      </div>
      <div className="game-controls">
        <div className="control-info">
          <p>← → : Move</p>
          <p>↑ / Space : Rotate (z → i·z)</p>
          <p>↓ : Soft Drop</p>
          <p>Enter : Hard Drop</p>
          <p>P : Pause</p>
        </div>
        <div className="button-controls">
          <button onClick={togglePause}>{gameState.isPaused ? 'Resume' : 'Pause'}</button>
          <button onClick={resetGame}>New Game</button>
        </div>
      </div>
      {gameState.gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-message">
            <h2>Game Over!</h2>
            <p>Final Score: {gameState.score}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TetrisGame;
