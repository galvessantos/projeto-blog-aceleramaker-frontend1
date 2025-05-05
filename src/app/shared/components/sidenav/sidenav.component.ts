import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class SidenavComponent {
  menuItems = [
    { label: 'Grok', icon: 'flash_on', route: '/grok' },
    { label: 'Postagens', icon: 'article', route: '/postagens' },
    { label: 'Temas', icon: 'bookmark', route: '/temas' },
    { label: 'Mais', icon: 'more_horiz', route: '/mais' }
  ];
}