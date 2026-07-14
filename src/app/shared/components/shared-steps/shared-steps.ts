import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-steps',
  imports: [CommonModule],
  templateUrl: './shared-steps.html',
  styleUrl: './shared-steps.css',
})
export class SharedSteps {
  @Input() totalSteps = 4;
  @Input() currentStep: number = 0;
  get stepsArray(): number[] {
    return Array(this.totalSteps)
      .fill(0)
      .map((_, i) => i);
  }
}
