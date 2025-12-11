import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-numpad',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="grid grid-cols-5 gap-2 w-full max-w-md mx-auto mt-6">
      <!-- Keys 1-9 -->
      <button *ngFor="let num of [1,2,3,4,5,6,7,8,9]" 
              (click)="onNumberClick(num)"
              class="h-14 sm:h-16 text-2xl font-bold rounded-lg shadow-md bg-white dark:bg-gray-700 text-google-blue dark:text-google-blue hover:bg-blue-50 dark:hover:bg-gray-600 active:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-google-blue">
        {{ num }}
      </button>
      
      <!-- Clear Button (Red) -->
      <button (click)="onClearClick()"
              class="h-14 sm:h-16 text-xl font-bold rounded-lg shadow-md bg-white dark:bg-gray-700 text-google-red hover:bg-red-50 dark:hover:bg-gray-600 active:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-google-red">
        ⌫
      </button>
    </div>
  `
})
export class NumpadComponent {
    @Output() numberSelected = new EventEmitter<number>();
    @Output() clearSelected = new EventEmitter<void>();

    onNumberClick(num: number) {
        this.numberSelected.emit(num);
    }

    onClearClick() {
        this.clearSelected.emit();
    }
}
