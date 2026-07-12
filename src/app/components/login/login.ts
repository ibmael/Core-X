import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [InputTextModule, PasswordModule, ButtonModule, FormsModule],
})
export class Login {
  usernameValue: string = '';
  passwordValue: string = '';
}
