import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'admin-panal';
  loggedIn:boolean = false;
  constructor(private authService : AuthService){}
  ngOnInit(): void {
    this.authService.subject.subscribe((res:boolean)=>{
      console.log(res);
      this.loggedIn = res;
      
    })
  }
}
 