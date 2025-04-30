import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ]
})
export class HeaderComponent {
  @Output() toggleSidenav = new EventEmitter<void>();
  
  constructor(private authService: AuthService, private router: Router) {}
  
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}