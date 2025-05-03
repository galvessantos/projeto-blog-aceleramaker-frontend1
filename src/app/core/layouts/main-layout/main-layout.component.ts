import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule
  ]
})
export class MainLayoutComponent {
  menuItems = [
    { label: 'Postagens', icon: 'article', route: '/postagens' },
    { label: 'Temas', icon: 'bookmark', route: '/temas' }
  ];
  
  constructor(private authService: AuthService) {}
  
  get userName(): string {
    return this.authService.getCurrentUser()?.nome || 'Usuário';
  }
  
  logout(): void {
    this.authService.logout();
  }
}