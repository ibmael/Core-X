import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-footer-link',
  imports: [RouterLink],
  templateUrl: './auth-footer-link.html',
  styleUrl: './auth-footer-link.css',
})
export class AuthFooterLink {
  @Input() message!: string;
  @Input() actionText!: string;
  @Input() link!: string;
}
