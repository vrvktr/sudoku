import React,{ useState } from 'react';

const SIZE = 9;
const emptyBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(''));

function findConflicts(board) {
  const conflicts = new Set();
  const addDuplicates = (positions) => {
    const seen = new Map();
    positions.forEach(({ row, col }) => {
      const value = board[row][col];
      if (!value) return;
      if (!seen.has(value)) seen.set(value, []);
      seen.get(value).push({ row, col });
    });
    seen.forEach((cells) => {
      if (cells.length > 1) {
        cells.forEach(({ row, col }) => conflicts.add(`${row}-${col}`));
      }
    });
  };

  for (let row = 0; row < SIZE; row++) {
    addDuplicates(Array.from({ length: SIZE }, (_, col) => ({ row, col })));
  }
  for (let col = 0; col < SIZE; col++) {
    addDuplicates(Array.from({ length: SIZE }, (_, row) => ({ row, col })));
  }
  for (let boxRow = 0; boxRow < SIZE; boxRow += 3) {
    for (let boxCol = 0; boxCol < SIZE; boxCol += 3) {
      const positions = [];
      for (let row = boxRow; row < boxRow + 3; row++) {
        for (let col = boxCol; col < boxCol + 3; col++) positions.push({ row, col });
      }
      addDuplicates(positions);
    }
  }
  return conflicts;
}

export default function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [message, setMessage] = useState('');
  const [conflictingCells, setConflictingCells] = useState(new Set());

  const updateCell = (row, col, rawValue) => {
    const value = rawValue.replace(/[^1-9]/g, '').slice(-1);
    setBoard((current) => current.map((line, rowIndex) =>
      rowIndex === row ? line.map((cell, colIndex) => colIndex === col ? value : cell) : line
    ));
    setMessage('');
    setConflictingCells(new Set());
  };

  const validateBoard = () => {
    const conflicts = findConflicts(board);
    setConflictingCells(conflicts);
    setMessage(conflicts.size ? 'Invalid Sudoku! Conflicts found.' : 'Sudoku is valid so far!');
  };

  const clearBoard = () => {
    setBoard(emptyBoard());
    setMessage('');
    setConflictingCells(new Set());
  };

  return (
    <main className="page-shell">
      <section className="validator-card" aria-labelledby="page-title">
        <h1 id="page-title">Sudoku Validator</h1>
        <p className="subtitle">Enter numbers 1–9 and validate the board.</p>

        <div className="board" role="grid" aria-label="Sudoku board">
          {board.map((row, rowIndex) => row.map((value, colIndex) => {
            const invalid = conflictingCells.has(`${rowIndex}-${colIndex}`);
            const rightBorder = colIndex === 2 || colIndex === 5;
            const bottomBorder = rowIndex === 2 || rowIndex === 5;
            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={`cell${invalid ? ' invalid' : ''}${rightBorder ? ' box-right' : ''}${bottomBorder ? ' box-bottom' : ''}`}
                type="text"
                inputMode="numeric"
                pattern="[1-9]"
                maxLength={1}
                aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}`}
                value={value}
                onChange={(event) => updateCell(rowIndex, colIndex, event.target.value)}
              />
            );
          }))}
        </div>

        <div className="actions">
          <button type="button" className="btn btn-primary validate-btn" onClick={validateBoard}>Validate</button>
          <button type="button" className="btn btn-danger clear-btn" onClick={clearBoard}>Clear</button>
        </div>

        {message && (
          <p className={`validation-message ${conflictingCells.size ? 'error' : 'success'}`} role="status">
            <span aria-hidden="true">{conflictingCells.size ? '✖' : '☑'}</span>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}