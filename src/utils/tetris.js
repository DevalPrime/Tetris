import * as Complex from './complex.js';

/**
 * Tetris game state and logic using complex numbers for rotations
 */

// Tetris piece definitions using complex numbers
// Each piece is defined as a set of complex number positions
export const PIECES = {
  I: [Complex.complex(-1, 0), Complex.complex(0, 0), Complex.complex(1, 0), Complex.complex(2, 0)],
  O: [Complex.complex(0, 0), Complex.complex(1, 0), Complex.complex(0, 1), Complex.complex(1, 1)],
  T: [Complex.complex(-1, 0), Complex.complex(0, 0), Complex.complex(1, 0), Complex.complex(0, 1)],
  S: [Complex.complex(0, 0), Complex.complex(1, 0), Complex.complex(-1, 1), Complex.complex(0, 1)],
  Z: [Complex.complex(-1, 0), Complex.complex(0, 0), Complex.complex(0, 1), Complex.complex(1, 1)],
  J: [Complex.complex(-1, 1), Complex.complex(-1, 0), Complex.complex(0, 0), Complex.complex(1, 0)],
  L: [Complex.complex(1, 1), Complex.complex(-1, 0), Complex.complex(0, 0), Complex.complex(1, 0)],
};

export const PIECE_COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000',
};

// Board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const CELL_SIZE = 30;

/**
 * Creates an empty game board
 * @returns {Array} Empty board matrix
 */
export const createEmptyBoard = () =>
  Array(BOARD_HEIGHT)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(null));

/**
 * Gets a random piece type
 * @returns {string} Random piece type key
 */
export const getRandomPieceType = () => {
  const types = Object.keys(PIECES);
  return types[Math.floor(Math.random() * types.length)];
};

/**
 * Rotates a piece using complex number multiplication by i
 * This implements the key rotation: z → i·z (90° counterclockwise)
 * @param {Array} piece - Array of complex number positions
 * @returns {Array} Rotated piece positions
 */
export const rotatePiece = (piece) => piece.map((pos) => Complex.rotateByI(pos));

/**
 * Translates a piece by adding a complex offset
 * @param {Array} piece - Array of complex number positions
 * @param {Object} offset - Complex number offset
 * @returns {Array} Translated piece positions
 */
export const translatePiece = (piece, offset) => piece.map((pos) => Complex.add(pos, offset));

/**
 * Converts complex position to board coordinates
 * @param {Object} pos - Complex number position
 * @param {Object} centerPos - Center position on board
 * @returns {Object} Board coordinates {x, y}
 */
export const complexToBoard = (pos, centerPos) => ({
  x: Math.round(centerPos.x + pos.re),
  y: Math.round(centerPos.y + pos.im),
});

/**
 * Checks if a piece position is valid on the board
 * @param {Array} piece - Array of complex number positions
 * @param {Object} centerPos - Center position {x, y}
 * @param {Array} board - Game board
 * @returns {boolean} True if position is valid
 */
export const isValidPosition = (piece, centerPos, board) => {
  return piece.every((pos) => {
    const { x, y } = complexToBoard(pos, centerPos);
    return (
      x >= 0 &&
      x < BOARD_WIDTH &&
      y >= 0 &&
      y < BOARD_HEIGHT &&
      (board[y] === undefined || board[y][x] === null)
    );
  });
};

/**
 * Locks a piece onto the board
 * @param {Array} piece - Array of complex number positions
 * @param {Object} centerPos - Center position {x, y}
 * @param {Array} board - Game board
 * @param {string} color - Piece color
 * @returns {Array} Updated board
 */
export const lockPiece = (piece, centerPos, board, color) => {
  const newBoard = board.map((row) => [...row]);
  piece.forEach((pos) => {
    const { x, y } = complexToBoard(pos, centerPos);
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
      newBoard[y][x] = color;
    }
  });
  return newBoard;
};

/**
 * Clears completed lines from the board
 * @param {Array} board - Game board
 * @returns {Object} {newBoard, linesCleared}
 */
export const clearLines = (board) => {
  const newBoard = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  return { newBoard, linesCleared };
};

/**
 * Calculates score based on lines cleared
 * @param {number} linesCleared - Number of lines cleared
 * @param {number} level - Current level
 * @returns {number} Score to add
 */
export const calculateScore = (linesCleared, level) => {
  const baseScores = [0, 100, 300, 500, 800];
  return baseScores[linesCleared] * (level + 1);
};

/**
 * Creates initial game state
 * @returns {Object} Initial game state
 */
export const createInitialState = () => {
  const pieceType = getRandomPieceType();
  return {
    board: createEmptyBoard(),
    currentPiece: PIECES[pieceType],
    currentPieceType: pieceType,
    piecePosition: { x: 5, y: 0 },
    nextPieceType: getRandomPieceType(),
    score: 0,
    level: 0,
    lines: 0,
    gameOver: false,
    isPaused: false,
  };
};
