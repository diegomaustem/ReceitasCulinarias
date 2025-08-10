import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "../routes/index";

class Servidor {
  private app: Express;
  private readonly porta: number;

  constructor() {
    this.app = express();
    this.porta = Number(process.env.PORTA) || 3000;
    this.configurarMiddlewares();
    this.configurarRotas();
    this.tratarRotasInvalidas();
  }

  private configurarMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      })
    );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configurarRotas(): void {
    this.app.use("/api/v1", routes);
  }

  private tratarRotasInvalidas(): void {
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        status: "erro",
        mensagem: "Recurso não encontrado. Verifique o URL e tente novamente.",
      });
      return;
    });
  }

  public iniciar(): void {
    this.app.listen(this.porta, () => {
      console.log(`Servidor rodando na porta ${this.porta}`);
    });
  }
}

export const servidor = new Servidor();
