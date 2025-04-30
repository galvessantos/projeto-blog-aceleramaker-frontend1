import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { SidenavComponent } from '../../../shared/components/sidenav/sidenav.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    HeaderComponent,
    SidenavComponent,
    FooterComponent
  ]
})
export class MainLayoutComponent {
  sidenavOpened = true;

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}