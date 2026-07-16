import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-input',
  imports: [CommonModule],
  templateUrl: './shared-input.html',
  styleUrl: './shared-input.css',
})
export class SharedInput {
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() hasError = false;
  @Input() errorMessage = '';
}
