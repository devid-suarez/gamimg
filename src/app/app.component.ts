import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameComponent } from './presentation/pages/game/game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, GameComponent],
  template: `
    <div class="min-h-screen flex flex-col items-center p-2 sm:p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main class="w-full flex-1">
        <app-game />
      </main>

      <footer class="mt-2 text-center text-gray-500 text-xs">
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
