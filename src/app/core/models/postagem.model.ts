import { Tema } from './tema.model';
import { Usuario } from './usuario.model';

export interface Postagem {
  id: number;
  titulo: string;
  texto: string;
  tema: Tema;
  usuario: Usuario;
  creationTimestamp: string;
  updateTimestamp: string;
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
  temaId: number;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}