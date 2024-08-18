import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  private loggedIn = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.login(username, password).subscribe((res) => {
        if (res) {
          // this.loggedIn = true;
          // this.authService.subject.next(this.loggedIn);
          this.authService.isAuthenticated();

          this.router.navigate(['/admin/products']);
        } else {
          alert('Invalid credentials');
        }
      });
    }
  }
}

export interface Welcome {
  token: string;
}
