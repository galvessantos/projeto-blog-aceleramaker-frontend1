import { Routes } from '@angular/router';
import { TemaListaComponent } from './components/tema-lista/tema-lista.component';
import { TemaFormComponent } from './components/tema-form/tema-form.component';

export const TEMAS_ROUTES: Routes = [
  { path: '', component: TemaListaComponent },
  { path: 'novo', component: TemaFormComponent },
  { path: 'editar/:id', component: TemaFormComponent }
];