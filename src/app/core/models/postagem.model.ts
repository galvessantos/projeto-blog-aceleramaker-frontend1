import { Tema } from './tema.model';
import { Usuario } from './usuario.model';

export interface Postagem {
  id?: number;
  titulo: string;
  texto: string;
  tema: Tema;
  usuario: Usuario;
  creationTimestamp?: Date;
  updateTimestamp?: Date;
}

export interface CreatePostagem {
  titulo: string;
  texto: string;
  temaId: number;
  usuarioId: number;
}

export interface UpdatePostagem {
  titulo: string;
  texto: string;
  temaId?: number;
}