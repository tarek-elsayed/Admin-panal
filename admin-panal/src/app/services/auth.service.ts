import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  subject = new BehaviorSubject(false);
  private loggedIn = true;
  private apiUrl = 'https://fakestoreapi.com/auth/login';

  constructor(private router: Router, private http: HttpClient) {}

  login(username: string, password: string) {
    // Simple example; replace with real authentication logic
    const data = {
      username: username,
      password: password,
    };
    return this.http.post(this.apiUrl, data);
    // if (username === 'admin' && password === 'admin') {
    //   this.loggedIn = true;
    //   this.router.navigate(['/admin/products']);
    //   return true;
    // }
    // return false;
  }

  logout() {
    this.loggedIn = false;
    this.subject.next(this.loggedIn);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    this.loggedIn = true;
    this.subject.next(this.loggedIn);
    return this.loggedIn;
  }
}
