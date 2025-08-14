import prisma from "../src/lib/prismaClient";
import { utilsSenha } from "../src/utils/UtilsSenha";

async function main() {
  const usuario = {
    nome: "Admin",
    login: "admin@admin",
    senha: process.env.SENHA_DEFAULT || "",
  };
  const senhaComHash = await utilsSenha.hashSenha(usuario.senha);
  try {
    await prisma.usuario.upsert({
      where: { login: usuario.login },
      update: {},
      create: {
        nome: usuario.nome,
        login: usuario.login,
        senha: senhaComHash,
      },
    });
    console.log("Usuário criado.");
  } catch (error) {
    console.error("Erro ao inserir usuário.", error);
  }

  const categorias = [
    "Bolos e tortas doces",
    "Carnes",
    "Aves",
    "Peixes e frutos do mar",
    "Saladas, molhos e acompanhamentos",
    "Sopas",
    "Massas",
    "Bebidas",
    "Doces e sobremesas",
    "Lanches",
    "Prato Único",
    "Light",
    "Alimentação Saudável",
  ];

  const categoriasUpsert = categorias.map((categoria) =>
    prisma.categoria.upsert({
      where: { nome: categoria },
      update: {},
      create: { nome: categoria },
    })
  );

  try {
    const resultados = await Promise.all(categoriasUpsert);
    console.log(`${resultados.length} categorias criadas com sucesso.`);
  } catch (error) {
    console.error("Erro ao popular categorias:", error);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
