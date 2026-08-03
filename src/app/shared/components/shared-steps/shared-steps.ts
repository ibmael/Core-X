import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-steps',
  standalone: true,
  imports: [],
  templateUrl: './shared-steps.html',
  styleUrl: './shared-steps.css',
  host: { class: 'block w-full' },
})
export class SharedSteps {
  @Input() totalSteps = 4;
  @Input() currentStep = 0;

  get stepsArray(): number[] {
    return Array.from({ length: this.totalSteps }, (_, i) => i);
  }
}
