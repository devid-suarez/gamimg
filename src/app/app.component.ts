import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './presentation/pages/game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GameComponent],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header class="mb-4 sm:mb-8 text-center">
        <h1 class="text-3xl sm:text-4xl font-bold text-google-blue mb-2">Sudoku Senior</h1>
        <p class="text-lg text-gray-600 dark:text-gray-400">Exercise your mind</p>
      </header>
      
      <main class="w-full">
        <app-game />
      </main>

      <footer class="mt-8 text-center text-gray-500 text-sm">
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
