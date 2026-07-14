import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-button',
  imports: [CommonModule],
  templateUrl: './shared-button.html',
  styleUrl: './shared-button.css',
})
export class SharedButton {
  @Input() label: string = 'Submit';
  @Input() type: 'button' | 'submit' = 'submit';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;

  @Input() bgClass: string = 'bg-primary hover:bg-blue-700';

  @Output() onClick = new EventEmitter<Event>();
}
