export interface Usuario {
  id: number;
  nome: string;
  username: string;
  email: string;
  foto?: string;
}

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface RegisterRequest {
  nome: string;
  username: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  usuario: Usuario;
}