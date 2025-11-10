import * as Tetris from '../utils/tetris.js';
import * as Complex from '../utils/complex.js';

describe('Tetris Game Logic', () => {
  describe('board creation', () => {
    test('creates an empty board with correct dimensions', () => {
      const board = Tetris.createEmptyBoard();
      expect(board).toHaveLength(Tetris.BOARD_HEIGHT);
      expect(board[0]).toHaveLength(Tetris.BOARD_WIDTH);
      expect(board[0][0]).toBeNull();
    });
  });

  describe('piece management', () => {
    test('gets a random piece type', () => {
      const pieceType = Tetris.getRandomPieceType();
      expect(Object.keys(Tetris.PIECES)).toContain(pieceType);
    });

    test('all pieces are defined with 4 blocks', () => {
      Object.values(Tetris.PIECES).forEach((piece) => {
        expect(piece).toHaveLength(4);
      });
    });

    test('all pieces have colors defined', () => {
      Object.keys(Tetris.PIECES).forEach((key) => {
        expect(Tetris.PIECE_COLORS[key]).toBeDefined();
      });
    });
  });

  describe('piece rotation', () => {
    test('rotates I piece correctly using complex numbers', () => {
      const piece = Tetris.PIECES.I;
      const rotated = Tetris.rotatePiece(piece);

      // Verify rotation happened (positions should be different)
      expect(rotated).toHaveLength(4);
      expect(rotated[0]).not.toEqual(piece[0]);
    });

    test('rotating 4 times returns to original orientation', () => {
      const piece = Tetris.PIECES.T;
      let rotated = piece;

      for (let i = 0; i < 4; i++) {
        rotated = Tetris.rotatePiece(rotated);
      }

      // After 4 rotations, should be close to original
      for (let i = 0; i < 4; i++) {
        expect(rotated[i].re).toBeCloseTo(piece[i].re);
        expect(rotated[i].im).toBeCloseTo(piece[i].im);
      }
    });
  });

  describe('piece translation', () => {
    test('translates piece by offset', () => {
      const piece = Tetris.PIECES.O;
      const offset = Complex.complex(2, 3);
      const translated = Tetris.translatePiece(piece, offset);

      expect(translated).toHaveLength(4);
      expect(translated[0].re).toBe(piece[0].re + 2);
      expect(translated[0].im).toBe(piece[0].im + 3);
    });
  });

  describe('coordinate conversion', () => {
    test('converts complex to board coordinates', () => {
      const pos = Complex.complex(1, 2);
      const center = { x: 5, y: 3 };
      const coords = Tetris.complexToBoard(pos, center);

      expect(coords.x).toBe(6);
      expect(coords.y).toBe(5);
    });

    test('handles negative complex coordinates', () => {
      const pos = Complex.complex(-1, -1);
      const center = { x: 5, y: 5 };
      const coords = Tetris.complexToBoard(pos, center);

      expect(coords.x).toBe(4);
      expect(coords.y).toBe(4);
    });
  });

  describe('position validation', () => {
    test('validates valid position on empty board', () => {
      const board = Tetris.createEmptyBoard();
      const piece = Tetris.PIECES.O;
      const position = { x: 5, y: 5 };

      expect(Tetris.isValidPosition(piece, position, board)).toBe(true);
    });

    test('invalidates position outside left boundary', () => {
      const board = Tetris.createEmptyBoard();
      const piece = Tetris.PIECES.I;
      const position = { x: 0, y: 5 };

      expect(Tetris.isValidPosition(piece, position, board)).toBe(false);
    });

    test('invalidates position outside right boundary', () => {
      const board = Tetris.createEmptyBoard();
      const piece = Tetris.PIECES.I;
      const position = { x: Tetris.BOARD_WIDTH, y: 5 };

      expect(Tetris.isValidPosition(piece, position, board)).toBe(false);
    });

    test('invalidates position with collision', () => {
      const board = Tetris.createEmptyBoard();
      board[5][5] = '#ff0000'; // Block at position
      const piece = Tetris.PIECES.O;
      const position = { x: 5, y: 5 };

      expect(Tetris.isValidPosition(piece, position, board)).toBe(false);
    });
  });

  describe('piece locking', () => {
    test('locks piece onto board', () => {
      const board = Tetris.createEmptyBoard();
      const piece = Tetris.PIECES.O;
      const position = { x: 5, y: 18 };
      const color = '#ffff00';

      const newBoard = Tetris.lockPiece(piece, position, board, color);

      // Check that some cells are now filled
      let filledCount = 0;
      newBoard.forEach((row) => {
        row.forEach((cell) => {
          if (cell === color) filledCount++;
        });
      });

      expect(filledCount).toBe(4);
    });

    test('does not modify original board', () => {
      const board = Tetris.createEmptyBoard();
      const piece = Tetris.PIECES.O;
      const position = { x: 5, y: 18 };

      Tetris.lockPiece(piece, position, board, '#ffff00');

      expect(board[18][5]).toBeNull();
    });
  });

  describe('line clearing', () => {
    test('clears full lines', () => {
      const board = Tetris.createEmptyBoard();
      // Fill bottom row
      for (let x = 0; x < Tetris.BOARD_WIDTH; x++) {
        board[Tetris.BOARD_HEIGHT - 1][x] = '#ff0000';
      }

      const { newBoard, linesCleared } = Tetris.clearLines(board);

      expect(linesCleared).toBe(1);
      expect(newBoard[Tetris.BOARD_HEIGHT - 1].every((cell) => cell === null)).toBe(true);
    });

    test('does not clear incomplete lines', () => {
      const board = Tetris.createEmptyBoard();
      // Fill bottom row except one cell
      for (let x = 0; x < Tetris.BOARD_WIDTH - 1; x++) {
        board[Tetris.BOARD_HEIGHT - 1][x] = '#ff0000';
      }

      const { linesCleared } = Tetris.clearLines(board);

      expect(linesCleared).toBe(0);
    });

    test('clears multiple lines', () => {
      const board = Tetris.createEmptyBoard();
      // Fill bottom two rows
      for (let y = Tetris.BOARD_HEIGHT - 2; y < Tetris.BOARD_HEIGHT; y++) {
        for (let x = 0; x < Tetris.BOARD_WIDTH; x++) {
          board[y][x] = '#ff0000';
        }
      }

      const { linesCleared } = Tetris.clearLines(board);

      expect(linesCleared).toBe(2);
    });

    test('maintains board height after clearing', () => {
      const board = Tetris.createEmptyBoard();
      for (let x = 0; x < Tetris.BOARD_WIDTH; x++) {
        board[Tetris.BOARD_HEIGHT - 1][x] = '#ff0000';
      }

      const { newBoard } = Tetris.clearLines(board);

      expect(newBoard).toHaveLength(Tetris.BOARD_HEIGHT);
    });
  });

  describe('score calculation', () => {
    test('calculates score for single line', () => {
      expect(Tetris.calculateScore(1, 0)).toBe(100);
    });

    test('calculates score for double lines', () => {
      expect(Tetris.calculateScore(2, 0)).toBe(300);
    });

    test('calculates score for triple lines', () => {
      expect(Tetris.calculateScore(3, 0)).toBe(500);
    });

    test('calculates score for tetris (4 lines)', () => {
      expect(Tetris.calculateScore(4, 0)).toBe(800);
    });

    test('multiplies score by level', () => {
      expect(Tetris.calculateScore(1, 2)).toBe(300); // 100 * (2+1)
    });
  });

  describe('game state initialization', () => {
    test('creates initial game state', () => {
      const state = Tetris.createInitialState();

      expect(state.board).toHaveLength(Tetris.BOARD_HEIGHT);
      expect(state.currentPiece).toBeDefined();
      expect(state.currentPieceType).toBeDefined();
      expect(state.piecePosition).toEqual({ x: 5, y: 0 });
      expect(state.score).toBe(0);
      expect(state.level).toBe(0);
      expect(state.lines).toBe(0);
      expect(state.gameOver).toBe(false);
      expect(state.isPaused).toBe(false);
    });
  });
});
