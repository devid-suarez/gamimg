import { Injectable, signal, computed, effect } from '@angular/core';
import { IGameService } from '../../core/interfaces/IGameService';
import { GameState, Difficulty, Board } from '../../core/models/sudoku.model';
import { SudokuLogic } from '../../core/logic/sudoku.logic';

@Injectable({
    providedIn: 'root'
})
export class SudokuService implements IGameService {

    // State initialization
    private initialState: GameState = {
        board: [],
        difficulty: 'Easy',
        isComplete: false,
        errors: 0,
        selectedCell: null,
        history: []
    };

    // Signal
    private _gameState = signal<GameState>(this.initialState);
    public gameState = this._gameState.asReadonly();

    constructor() {
        // Load from local storage if exists
        const saved = localStorage.getItem('sudokuState');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Basic validation/rehydration could go here
                this._gameState.set(parsed);
            } catch (e) {
                this.newGame('Easy');
            }
        } else {
            this.newGame('Easy');
        }

        // Effect to save state
        effect(() => {
            localStorage.setItem('sudokuState', JSON.stringify(this._gameState()));
        });
    }

    newGame(difficulty: Difficulty): void {
        const newBoard = SudokuLogic.generateBoard(difficulty);
        this._gameState.set({
            board: newBoard,
            difficulty: difficulty,
            isComplete: false,
            errors: 0,
            selectedCell: null,
            history: []
        });
    }

    selectCell(row: number, col: number): void {
        this._gameState.update(state => ({ ...state, selectedCell: { row, col } }));
    }

    makeMove(value: number): void {
        const state = this._gameState();
        const sel = state.selectedCell;
        if (!sel) return;

        const cell = state.board[sel.row][sel.col];
        if (cell.isReadOnly) return;

        // Immutable update of the board
        const newBoard = state.board.map(row => row.map(c => ({ ...c })));
        const targetCell = newBoard[sel.row][sel.col];

        targetCell.value = value;

        // ERROR CHECK: Strict mode - if value != solution, mark invalid immediately (UX rule)
        targetCell.isValid = (value === targetCell.solution);
        if (!targetCell.isValid) {
            // Increment error count for fun/stats
            // We could also reject the move, but showing it as RED is better feedback
        }

        // Check win condition
        const isComplete = SudokuLogic.isBoardComplete(newBoard);

        this._gameState.update(s => ({
            ...s,
            board: newBoard,
            isComplete: isComplete,
            errors: !targetCell.isValid ? s.errors + 1 : s.errors
        }));
    }

    clearCell(): void {
        const state = this._gameState();
        const sel = state.selectedCell;
        if (!sel) return;

        const cell = state.board[sel.row][sel.col];
        if (cell.isReadOnly) return;

        const newBoard = state.board.map(row => row.map(c => ({ ...c })));
        newBoard[sel.row][sel.col].value = null;
        newBoard[sel.row][sel.col].isValid = true; // Reset validity

        this._gameState.update(s => ({ ...s, board: newBoard }));
    }

    isValidMove(row: number, col: number, value: number): boolean {
        // Pure logic check against current board state
        const currentBoard = this._gameState().board.map(r => r.map(c => c.value || 0));
        // Temporarily clear current cell to check safety
        currentBoard[row][col] = 0;
        return SudokuLogic.isSafe(currentBoard, row, col, value);
    }

    // Helper for Theme (could be in a separate ThemeService but keeping simple)
    toggleTheme(): void {
        document.documentElement.classList.toggle('dark');
        // Persist theme preference logic would go here
    }
}
