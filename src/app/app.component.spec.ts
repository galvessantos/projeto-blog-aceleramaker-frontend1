import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  template: '<p>Login Page</p>',
})
class MockLoginComponent {}

@Component({
  standalone: true,
  template: '<p>Main Layout</p><router-outlet></router-outlet>',
  imports: [RouterOutlet, CommonModule]
})
class MockMainLayoutComponent {}

@Component({
  standalone: true,
  template: '<p>Dashboard Page</p>',
})
class MockDashboardComponent {}

describe('AppComponent with routing', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'login', component: MockLoginComponent },
          {
            path: 'main',
            component: MockMainLayoutComponent,
            children: [
              { path: 'dashboard', component: MockDashboardComponent }
            ]
          },
          { path: '**', redirectTo: 'login' }
        ]),
        AppComponent
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should navigate to /login by default', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    router.initialNavigation();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(location.path()).toBe('/login');
    expect(fixture.nativeElement.textContent).toContain('Login Page');
  });

  it('should navigate to /dashboard inside main layout', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    router.navigate(['/main/dashboard']);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(location.path()).toBe('/main/dashboard');
    expect(fixture.nativeElement.textContent).toContain('Dashboard Page');
    expect(fixture.nativeElement.textContent).toContain('Main Layout');
  });
});
