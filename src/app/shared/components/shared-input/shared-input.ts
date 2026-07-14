import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-shared-input',
  imports: [CommonModule, ReactiveFormsModule, InputText],
  templateUrl: './shared-input.html',
  styleUrl: './shared-input.css',
})
export class SharedInput {
  @Input() id!: string;
  @Input() label!: string;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() control!: FormControl;
}
