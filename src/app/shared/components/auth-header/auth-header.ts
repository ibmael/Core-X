import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  imports: [],
  templateUrl: './auth-header.html',
  styleUrl: './auth-header.css',
})
export class AuthHeader {
  @Input() title!: string;
  @Input() subtitle?: string;
}
