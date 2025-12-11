import { Component, computed, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuService } from '../../../infrastructure/services/sudoku.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-xl mx-auto p-1 bg-gray-900 rounded-xl shadow-2xl">
      <!-- Outer Border Container -->
      <div class="grid grid-cols-9 border-4 border-gray-900 bg-gray-300 dark:bg-gray-700">
        
        <ng-container *ngFor="let row of gameState().board; let r = index">
          <div *ngFor="let cell of row; let c = index"
               (click)="!cell.isReadOnly && selectCell(r, c)"
               [class]="getCellClasses(r, c)"
               role="gridcell"
               [attr.aria-label]="'Row ' + (r+1) + ', Column ' + (c+1) + ', Value ' + (cell.value || 'Empty')"
               [attr.aria-selected]="isSelected(r, c)"
               [attr.aria-readonly]="cell.isReadOnly"
               tabindex="0"
               (keydown)="onKeyDown($event, r, c)">
            
            <span *ngIf="cell.value" class="relative z-10">{{ cell.value }}</span>
            
          </div>
        </ng-container>

      </div>
    </div>
  `,
  styles: []
})
export class BoardComponent {
  private gameService = inject(SudokuService);
  gameState = this.gameService.gameState;

  isSelected(r: number, c: number): boolean {
    const sel = this.gameState().selectedCell;
    return sel?.row === r && sel?.col === c;
  }

  selectCell(r: number, c: number) {
    const cell = this.gameState().board[r][c];
    // Double-check read-only status (primary check in template)
    if (!cell.isReadOnly) {
      this.gameService.selectCell(r, c);
    }
  }

  getCellClasses(r: number, c: number): string {
    const cell = this.gameState().board[r][c];
    const isSelected = this.isSelected(r, c);

    // Base layout
    let classes = 'aspect-square flex items-center justify-center text-2xl sm:text-3xl cursor-pointer select-none transition-all duration-75 ';

    // Borders
    // Right Border: Thicker on 3rd and 6th column
    if (c < 8) {
      if ((c + 1) % 3 === 0) classes += 'border-r-4 border-google-blue ';
      else classes += 'border-r border-google-blue ';
    }

    // Bottom Border: Thicker on 3rd and 6th row
    if (r < 8) {
      if ((r + 1) % 3 === 0) classes += 'border-b-4 border-google-blue ';
      else classes += 'border-b border-google-blue ';
    }

    // Colors & State
    if (cell.isReadOnly) {
      classes += 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold ';
    } else if (!cell.isValid) {
      classes += 'bg-google-red text-white font-bold ';
    } else if (isSelected) {
      classes += 'bg-google-blue text-white font-bold shadow-inner ';
    } else {
      classes += 'bg-white dark:bg-gray-700 text-google-blue dark:text-blue-300 font-bold hover:bg-blue-50 dark:hover:bg-gray-600 ';
    }

    return classes;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const sel = this.gameState().selectedCell;
    if (!sel) return;

    // Numbers
    if (event.key >= '1' && event.key <= '9') {
      this.gameService.makeMove(parseInt(event.key));
      return;
    }

    // Deletion
    if (event.key === 'Backspace' || event.key === 'Delete') {
      this.gameService.clearCell();
      return;
    }

    // Navigation (Arrow Keys)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
      event.preventDefault(); // Prevent scroll
      let { row, col } = sel;

      if (event.key === 'ArrowUp') row = Math.max(0, row - 1);
      if (event.key === 'ArrowDown') row = Math.min(8, row + 1);
      if (event.key === 'ArrowLeft') col = Math.max(0, col - 1);
      if (event.key === 'ArrowRight') col = Math.min(8, col + 1);

      this.gameService.selectCell(row, col);
    }
  }

  // Specific handler for accessibility focus (optional integration)
  onKeyDown(event: KeyboardEvent, r: number, c: number) {
    // Handled globally but listed here for a11y focus management if needed
  }
}
