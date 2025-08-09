import express, { Express } from "express";
import routes from "../routes/index";

class Servidor {
  private app: Express;
  private readonly porta: number;

  constructor() {
    this.app = express();
    this.porta = Number(process.env.PORTA) || 3000;
    this.configurarMiddlewares();
    this.configurarRotas();
  }

  private configurarMiddlewares(): void {
    this.app.use(express.json());
  }

  private configurarRotas(): void {
    this.app.use("/api/v1", routes);
  }

  public iniciar(): void {
    this.app.listen(this.porta, () => {
      console.log(`Servidor rodando na porta ${this.porta}`);
    });
  }
}

export const servidor = new Servidor();
