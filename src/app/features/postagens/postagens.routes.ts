import { Routes } from '@angular/router';
import { PostagemListaComponent } from './components/postagem-lista/postagem-lista.component';
import { PostagemDetalheComponent } from './components/postagem-detalhe/postagem-detalhe.component';
import { PostagemFormComponent } from './components/postagem-form/postagem-form.component';
import { PostagemDeleteComponent } from './components/postagem-delete/postagem-delete.component';

export const POSTAGENS_ROUTES: Routes = [
  { path: '', component: PostagemListaComponent },
  { path: 'novo', component: PostagemFormComponent },
  { path: ':id', component: PostagemDetalheComponent },
  { path: 'editar/:id', component: PostagemFormComponent },
  { path: 'excluir/:id', component: PostagemDeleteComponent }
];