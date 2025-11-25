import { useEffect, useRef, useState, useCallback } from 'react';
import * as Complex from '../utils/complex.js';
import * as Tetris from '../utils/tetris.js';
import './TetrisGame.css';

const ComplexTetrisGame = ({ onRotate }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState(Tetris.createInitialState());
  const [selectedTransform, setSelectedTransform] = useState('rotation');
  const dropIntervalRef = useRef(null);

  const applyComplexTransform = useCallback((piece, transform) => {
    const transformed = piece.map(pos => Complex.applyFunction(transform, pos));
    const snapped = transformed.map(pos => 
      Complex.complex(Math.round(pos.re), Math.round(pos.im))
    );
    return snapped;
  }, []);

  const draw = useCallback((state) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { board, currentPiece, piecePosition, currentPieceType } = state;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  const moveLeft = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) return prevState;

      const newPosition = {
        x: prevState.piecePosition.x - 1,
        y: prevState.piecePosition.y,
      };

      if (Tetris.isValidPosition(prevState.currentPiece, newPosition, prevState.board)) {
        return { ...prevState, piecePosition: newPosition };
      }
      return prevState;
    });
  }, []);

  const moveRight = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) return prevState;

      const newPosition = {
        x: prevState.piecePosition.x + 1,
        y: prevState.piecePosition.y,
      };

      if (Tetris.isValidPosition(prevState.currentPiece, newPosition, prevState.board)) {
        return { ...prevState, piecePosition: newPosition };
      }
      return prevState;
    });
  }, []);

  const transformPiece = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) return prevState;

      const transformed = applyComplexTransform(prevState.currentPiece, selectedTransform);

      if (Tetris.isValidPosition(transformed, prevState.piecePosition, prevState.board)) {
        if (onRotate) {
          onRotate({ piece: transformed, type: prevState.currentPieceType });
        }
        return { ...prevState, currentPiece: transformed };
      } else {
        for (let offset = -2; offset <= 2; offset++) {
          const adjustedPos = { ...prevState.piecePosition, x: prevState.piecePosition.x + offset };
          if (Tetris.isValidPosition(transformed, adjustedPos, prevState.board)) {
            if (onRotate) {
              onRotate({ piece: transformed, type: prevState.currentPieceType });
            }
            return { ...prevState, currentPiece: transformed, piecePosition: adjustedPos };
          }
        }
      }
      return prevState;
    });
  }, [selectedTransform, applyComplexTransform, onRotate]);

  const hardDrop = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver || prevState.isPaused) return prevState;

      let newPosition = { ...prevState.piecePosition };
      while (Tetris.isValidPosition(prevState.currentPiece, { ...newPosition, y: newPosition.y + 1 }, prevState.board)) {
        newPosition.y += 1;
      }

      const newBoard = Tetris.lockPiece(
        prevState.currentPiece,
        newPosition,
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
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState((prevState) => {
      if (prevState.gameOver) return prevState;
      return { ...prevState, isPaused: !prevState.isPaused };
    });
  }, []);

  const restartGame = useCallback(() => {
    setGameState(Tetris.createInitialState());
  }, []);

  useEffect(() => {
    if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current);
    }

    if (!gameState.gameOver && !gameState.isPaused) {
      const dropSpeed = Math.max(100, 1000 - (gameState.level - 1) * 100);
      dropIntervalRef.current = setInterval(moveDown, dropSpeed);
    }

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [gameState.level, gameState.gameOver, gameState.isPaused, moveDown]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState.gameOver && e.key.toLowerCase() === 'r') {
        restartGame();
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
        case ' ':
          e.preventDefault();
          transformPiece();
          break;
        case 'Enter':
          hardDrop();
          break;
        case 'p':
        case 'P':
          togglePause();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveLeft, moveRight, moveDown, transformPiece, hardDrop, togglePause, gameState.gameOver, restartGame]);

  useEffect(() => {
    draw(gameState);
  }, [gameState, draw]);

  useEffect(() => {
    draw(gameState);
  }, [gameState, draw]);

  return (
    <div className="tetris-game">
      <div className="game-header">
        <h2>Complex Tetris</h2>
        <p className="subtitle">Transform with Complex Functions!</p>
      </div>
      
      <div className="game-controls">
        <div className="transform-selector">
          <h3>Select Transform</h3>
          <div className="transform-buttons">
            <button
              className={selectedTransform === 'rotation' ? 'active' : ''}
              onClick={() => setSelectedTransform('rotation')}
              title="i·z - 90° rotation"
            >
              i·z
            </button>
            <button
              className={selectedTransform === 'square' ? 'active' : ''}
              onClick={() => setSelectedTransform('square')}
              title="z² - squaring"
            >
              z²
            </button>
            <button
              className={selectedTransform === 'exp' ? 'active' : ''}
              onClick={() => setSelectedTransform('exp')}
              title="e^z - exponential"
            >
              eᶻ
            </button>
            <button
              className={selectedTransform === 'reciprocal' ? 'active' : ''}
              onClick={() => setSelectedTransform('reciprocal')}
              title="1/z - reciprocal"
            >
              1/z
            </button>
          </div>
        </div>
      </div>

      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={Tetris.BOARD_WIDTH * Tetris.CELL_SIZE}
          height={Tetris.BOARD_HEIGHT * Tetris.CELL_SIZE}
          className="game-canvas"
        />
        <div className="game-info">
          <div className="stat">
            <span className="stat-label">Score</span>
            <span className="stat-value">{gameState.score}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{gameState.level}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Lines</span>
            <span className="stat-value">{gameState.lines}</span>
          </div>
          <button onClick={togglePause} className="control-button">
            {gameState.isPaused ? 'Resume (P)' : 'Pause (P)'}
          </button>
          {gameState.gameOver && (
            <button onClick={restartGame} className="control-button restart">
              Restart (R)
            </button>
          )}
        </div>
      </div>

      <div className="game-instructions">
        <h3>Controls</h3>
        <ul>
          <li><strong>←/→</strong> Move left/right</li>
          <li><strong>↓</strong> Move down faster</li>
          <li><strong>↑/Space</strong> Apply selected transform</li>
          <li><strong>Enter</strong> Hard drop</li>
          <li><strong>P</strong> Pause/Resume</li>
        </ul>
        <p className="warning">⚠️ Transformations snap to nearest grid position!</p>
      </div>
    </div>
  );
};

export default ComplexTetrisGame;
