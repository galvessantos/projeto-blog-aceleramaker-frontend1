export interface Usuario {
    id?: number;
    nome: string;
    username: string;
    email?: string;
    foto?: string;
    creationTimestamp?: Date;
  }
  
  export interface CreateUsuario {
    nome: string;
    username: string;
    email: string;
    senha: string;
  }
  
  export interface UpdateUsuario {
    nome: string;
    username: string;
    senha: string;
    foto?: string;
  }