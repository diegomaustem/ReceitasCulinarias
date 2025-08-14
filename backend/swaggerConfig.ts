import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],

    info: {
      title: "Receitas Culinárias - API",
      version: "1.0.0",
      description: "API para genrênciar receitas e usuários.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Servidor Local",
      },
    ],
  },
  apis: [path.resolve(__dirname, "./src/routes/modules/*.ts")],
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
