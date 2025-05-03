import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/components/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/components/register/register.component').then(c => c.RegisterComponent) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  {
    path: '',
    loadComponent: () => import('./core/layouts/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [() => import('./core/guards/auth.guard').then(g => g.authGuardFn)],
    children: [
      {
        path: 'postagens',
        loadChildren: () => import('./features/postagens/postagens.routes').then(r => r.POSTAGENS_ROUTES)
      },
      {
        path: 'temas',
        loadChildren: () => import('./features/temas/temas.routes').then(r => r.TEMAS_ROUTES)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/perfil/perfil.component').then(c => c.PerfilComponent)
      }
    ]
  },
  
  {
    path: '**',
    redirectTo: '/login'
  }
];