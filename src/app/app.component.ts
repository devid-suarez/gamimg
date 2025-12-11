import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './presentation/pages/game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GameComponent],
  template: `
    <div class="min-h-screen flex flex-col items-center p-2 sm:p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header class="mb-2 sm:mb-3 text-center">
        <h1 class="text-xl sm:text-2xl font-bold text-google-blue">Sudoku Senior</h1>
      </header>
      
      <main class="w-full flex-1">
        <app-game />
      </main>

      <footer class="mt-4 text-center text-gray-500 text-xs">
        <p>Accessible Design • High Contrast</p>
      </footer>
    </div>
  `
})
export class AppComponent {
  title = 'sudoku-app';
  constructor() {
    console.log('AppComponent: Initialized');
  }
}
