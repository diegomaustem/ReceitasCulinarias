# 📚 Sistema de Receitas Culinárias

## 🛠 Pré-requisitos
- [Docker](https://www.docker.com/get-started) (v23.0+)
- [Node.js](https://nodejs.org/) (v18.x)
- [Git](https://git-scm.com/)

## 🚀 Instalação

### 1. Clonar repositório
```bash
git clone git@github.com:diegomaustem/ReceitasCulinarias.git
cd ReceitasCulinarias
2. Configurar Backend
bash
cd backend
npm install
Crie .env com:

ini
PORTA=3000
DATABASE_URL="mysql://root:123456@localhost:3306/receitas_db"
SECRET_KEY=9c62d38b0b32189fa3e8e86220cb3057
JWT_EXPIRATION=2h
SENHA_DEFAULT="12345678"
3. Configurar Frontend
bash
cd ../frontend
npm install
Crie .env com:

ini
VITE_API_URL=/api/v1
🐳 Execução
Na raiz do projeto:

bash
docker-compose up --build -d
Verifique os containers:

bash
docker-compose ps
🌐 Acessos
Recurso	URL
Aplicação	http://localhost:5173
API	http://localhost:3001/api/v1/categorias
Docs	http://localhost:5173/api-docs
Credenciais padrão:
🔑 admin@admin / 123456

🔧 Troubleshooting
bash
# Ver logs
docker-compose logs -f

# Acessar MySQL
docker exec -it mysql_db mysql -u root -p
⚠️ Segurança
Altere SENHA_DEFAULT após primeiro acesso

Não compartilhe arquivos .env

Atualize credenciais para produção
