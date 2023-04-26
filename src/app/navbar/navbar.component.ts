import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean;
  isAdmin: boolean;
  constructor(public auth: AuthService) {
    this.isLoggedIn = this.auth.Authenticate();
    this.isAdmin = this.auth.isAdmin();
  }

  ngOnInit(): void {}
}
