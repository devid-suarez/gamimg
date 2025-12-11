import { Board, Difficulty, SudokuCell } from "../models/sudoku.model";

export class SudokuLogic {

    static generateBoard(difficulty: Difficulty): Board {
        const rawBoard = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillBoard(rawBoard); // Standard Backtracking

        // Create solution map
        const solution = rawBoard.map(row => [...row]);

        // Remove numbers based on difficulty
        const attempts = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 45 : 55;
        this.removeNumbers(rawBoard, attempts);

        return this.createBoardModel(rawBoard, solution);
    }

    private static fillBoard(board: number[][]): boolean {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

                    for (const num of numbers) {
                        if (this.isSafe(board, row, col, num)) {
                            board[row][col] = num;
                            if (this.fillBoard(board)) return true;
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    static isSafe(board: number[][], row: number, col: number, num: number): boolean {
        // Check Row
        for (let x = 0; x < 9; x++) if (board[row][x] === num) return false;

        // Check Col
        for (let x = 0; x < 9; x++) if (board[x][col] === num) return false;

        // Check 3x3 Box
        const startRow = row - (row % 3);
        const startCol = col - (col % 3);
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i + startRow][j + startCol] === num) return false;
            }
        }

        return true;
    }

    private static removeNumbers(board: number[][], attempts: number): void {
        while (attempts > 0) {
            let row = Math.floor(Math.random() * 9);
            let col = Math.floor(Math.random() * 9);
            while (board[row][col] === 0) {
                row = Math.floor(Math.random() * 9);
                col = Math.floor(Math.random() * 9);
            }
            board[row][col] = 0;
            attempts--;
        }
    }

    private static createBoardModel(rawBoard: number[][], solution: number[][]): Board {
        return rawBoard.map((row, rIndex) =>
            row.map((val, cIndex) => ({
                row: rIndex,
                col: cIndex,
                value: val === 0 ? null : val,
                solution: solution[rIndex][cIndex],
                isReadOnly: val !== 0,
                isValid: true,
            } as SudokuCell))
        );
    }

    static isBoardComplete(board: Board): boolean {
        // Check if full and valid
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const cell = board[r][c];
                if (cell.value === null || cell.value !== cell.solution) return false;
            }
        }
        return true;
    }

    private static shuffleArray(array: number[]): number[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
