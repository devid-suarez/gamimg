import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuService } from '../../../infrastructure/services/sudoku.service';
import { BoardComponent } from '../../components/board/board.component';
import { NumpadComponent } from '../../components/numpad/numpad.component';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';
import { Difficulty } from '../../../core/models/sudoku.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, BoardComponent, NumpadComponent, ThemeSwitcherComponent],
  template: `
    <div class="flex flex-col items-center w-full mx-auto p-0.5 sm:p-1">
      
      <!-- The Board -->
      <app-board />

      <!-- Controls -->
      <app-numpad 
        (numberSelected)="onNumberSelected($event)"
        (clearSelected)="onClearSelected()"
      />

      <!-- New Game Button -->
      <button (click)="confirmNewGame()"
              class="mt-2 text-google-blue font-bold text-sm tracking-widest uppercase hover:bg-blue-50 dark:hover:bg-gray-700 py-1.5 px-3 rounded-full transition-colors">
        Nuevo Juego
      </button>

      <!-- Statistics & Controls Footer -->
      <div class="flex justify-between items-center w-full mt-2 px-1">
        <div class="flex flex-col">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Errores</span>
          <span class="text-xl font-mono" [class.text-google-red]="gameState().errors > 0">
            {{ gameState().errors }}/3
          </span>
        </div>

        <div class="flex items-center gap-4">
          <select 
              [value]="gameState().difficulty" 
              (change)="changeDifficulty($event)"
              class="bg-gray-100 dark:bg-gray-700 border-none rounded-lg py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-google-blue cursor-pointer">
            <option value="Easy">Fácil</option>
            <option value="Medium">Medio</option>
            <option value="Hard">Difícil</option>
          </select>
          
          <app-theme-switcher />
        </div>
      </div>

      <!-- Win Modal -->
      <div *ngIf="gameState().isComplete" 
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-bounce-in">
          <div class="w-16 h-16 bg-google-green text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">¡Excelente!</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-8">Has resuelto el nivel {{ getDifficultyLabel(gameState().difficulty) }}.</p>
          
          <button (click)="startNewGame(gameState().difficulty)" 
                  class="w-full bg-google-blue text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-600 transition-transform active:scale-95">
            Jugar Otra Vez
          </button>
        </div>
      </div>

    </div>
  `
})
export class GameComponent {
  private gameService = inject(SudokuService);
  gameState = this.gameService.gameState;

  onNumberSelected(num: number) {
    this.gameService.makeMove(num);
  }

  onClearSelected() {
    this.gameService.clearCell();
  }

  changeDifficulty(event: Event) {
    const diff = (event.target as HTMLSelectElement).value as Difficulty;
    if (confirm('¿Empezar juego nuevo? Se perderá el progreso actual.')) {
      this.gameService.newGame(diff);
    } else {
      // Revert selection visually if cancelled
      (event.target as HTMLSelectElement).value = this.gameState().difficulty;
    }
  }

  confirmNewGame() {
    if (confirm('¿Seguro que quieres reiniciar?')) {
      this.gameService.newGame(this.gameState().difficulty);
    }
  }

  startNewGame(diff: Difficulty) {
    this.gameService.newGame(diff);
  }

  getDifficultyLabel(diff: Difficulty): string {
    switch (diff) {
      case 'Easy': return 'Fácil';
      case 'Medium': return 'Medio';
      case 'Hard': return 'Difícil';
      default: return diff;
    }
  }
}
