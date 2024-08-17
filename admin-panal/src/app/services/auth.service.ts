import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = false;

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    // Simple example; replace with real authentication logic
    if (username === 'admin' && password === 'admin') {
      this.loggedIn = true;
      this.router.navigate(['/admin/products']);
      return true;
    }
    return false;
  }

  logout() {
    this.loggedIn = false;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.loggedIn;
  }
}
