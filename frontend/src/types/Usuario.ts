export interface Usuario {
  id: number;
  nome?: string | null;
  login: string;
  senha: string;
  criadoEm: Date;
  alteradoEm: Date;
}
