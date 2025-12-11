export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface SudokuCell {
    row: number;
    col: number;
    value: number | null;
    solution: number;
    isReadOnly: boolean;
    isValid: boolean;
    notes?: number[];
}

export type Board = SudokuCell[][];

export interface GameState {
    board: Board;
    difficulty: Difficulty;
    isComplete: boolean;
    errors: number;
    selectedCell: { row: number, col: number } | null;
    history: Board[]; // For undo functionality (optional but good for senior UX)
}
