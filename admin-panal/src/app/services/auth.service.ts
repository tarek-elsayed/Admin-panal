import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  subject = new BehaviorSubject(false);
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
    this.subject.next(this.loggedIn);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    this.subject.next(this.loggedIn);
    return this.loggedIn;
  }
}
