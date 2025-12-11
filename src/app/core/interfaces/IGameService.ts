import { Signal } from '@angular/core';
import { Board, Difficulty, GameState } from '../models/sudoku.model';

export interface IGameService {
    gameState: Signal<GameState>;

    newGame(difficulty: Difficulty): void;
    selectCell(row: number, col: number): void;
    makeMove(value: number): void;
    clearCell(): void;
    isValidMove(row: number, col: number, value: number): boolean;

    // UX Helpers
    toggleTheme(): void;
}
