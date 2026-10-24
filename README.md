# Sudoku Validator

A responsive React + Vite Sudoku validator styled to match the supplied reference screenshots.

## Features
- Editable 9 × 9 grid; accepts digits 1–9.
- Checks rows, columns, and 3 × 3 boxes for duplicate numbers.
- Highlights all cells participating in a duplicate conflict.
- Displays the required validation messages.
- Clear resets the grid, message, and conflict highlighting.
- Required class names: `board` and `cell`.

## Run locally
Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Empty cells are ignored during validation, so a partially filled board with no duplicates is reported as valid so far.
# sudoku
