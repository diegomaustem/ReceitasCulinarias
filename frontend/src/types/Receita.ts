export interface Receita {
  id: number;
  idUsuarios: number | null;
  idCategorias: number | null;
  nome: string | null;
  tempoPreparoMinutos: number;
  porcoes: number;
  ingredientes: string;
  modoPreparo: string;
}
