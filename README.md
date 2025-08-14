# 📚 Sistema de Receitas Culinárias

## 🛠 Pré-requisitos
- [Docker](https://www.docker.com/get-started) (v23.0+)
- [Node.js](https://nodejs.org/) (v18.x)
- [Git](https://git-scm.com/)

## 🚀 Instalação

### 1. Clonar repositório
    git clone git@github.com:diegomaustem/ReceitasCulinarias.git
    Entre na pasta principal que é ReceitasCulinarias
    
### 2. Configurar Backend
    Entre na pasta backend
    Execute o comando: npm install
    Crie .env na pasta backend com essas variáveis setadas com os mesmos valores abaixo:

    PORTA=3000
    DATABASE_URL="mysql://root:123456@localhost:3306/receitas_db"
    SECRET_KEY=9c62d38b0b32189fa3e8e86220cb3057
    JWT_EXPIRATION=2h
    SENHA_DEFAULT="12345678"
    
### 3. Configurar Frontend
    Agora acesse a pasta frontend
    Execute o comando dentro dela: npm install
    Crie .env com essa variável setada: VITE_API_URL=/api/v1

🐳 Execução
Na raiz do projeto na pasta ReceitasCulinarias:

    docker-compose up --build -d
    Verifique os containers: docker-compose ps
    
🌐 Acessos
Recurso	URL

      Aplicação	http://localhost:5173
      API	http://localhost:3001/api/v1/categorias
      Docs	http://localhost:5173/api-docs
      
Credenciais padrão (Use essas credênciais para (PRIMEIRO ACESSO).
🔑 login:admin@admin
🔑 senha:123456

### Testes 
      Foram feitos dois testes unitários no controller do usuário.
      Para executá-los. Entre na pasta backend e na raiz do projeto execute o comando: npm test

🔧 Troubleshooting
# Ver logs
docker-compose logs -f

# Acessar MySQL
docker exec -it mysql_db mysql -u root -p
⚠️ Segurança
Altere SENHA_DEFAULT após primeiro acesso

Não compartilhe arquivos .env

Atualize credenciais para produção
