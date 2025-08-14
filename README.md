📘 Guia de Instalação e Configuração do Sistema de Receitas Culinárias

1. Pré-requisitos do Sistema
Antes de começar, certifique-se que seu computador possui:
  
Docker (versão 23.0 ou superior)
Node.js (versão 18.x)
Git (para clonar o repositório)

💡 Dica: Verifique as instalações com docker --version, node -v e git --version no terminal.

2. Primeiros Passos
2.1 Clonando o Projeto
Abra o terminal e execute:

    git clone git@github.com:diegomaustem/ReceitasCulinarias.git
    cd ReceitasCulinarias
    Isso criará uma pasta chamada ReceitasCulinarias com toda a estrutura do projeto.

3. Configuração do Backend
3.1 Arquivo de Variáveis de Ambiente
Navegue até a pasta do backend:

  cd backend
  Crie um novo arquivo chamado .env e cole o seguinte conteúdo:

  env
  # Configurações do Servidor
  PORTA=3000

  # Banco de Dados
  DATABASE_URL="mysql://root:123456@localhost:3306/receitas_db"

  # Segurança
  SECRET_KEY=9c62d38b0b32189fa3e8e86220cb3057
  JWT_EXPIRATION=2h

  # Usuário Padrão
  SENHA_DEFAULT="12345678"
  
3.2 Instalando Dependências
Execute no terminal:

npm install *(Dentro da pasta backend)
⚠️ Atenção: Espere a instalação terminar completamente antes de prosseguir.


4. Configuração do Frontend
4.1 Variáveis de Ambiente
Volte para a pasta principal e acesse o frontend:

cd ..
cd frontend
Crie outro arquivo .env com:

env
# Endpoint da API
VITE_API_URL=/api/v1

4.2 Instalação de Dependências
Execute: npm install

5. Inicializando o Sistema com Docker
5.1 Subindo os Containers
Na pasta raiz do projeto (ReceitasCulinarias), execute:

docker-compose up --build -d
5.2 Verificando os Serviços
Para confirmar que tudo está rodando:

bash
docker-compose ps
Você deverá ver 3 serviços com status Up:

backend_app

frontend_app

mysql_db

6. Acessando o Sistema
6.1 Primeiro Acesso
Acesse o sistema no navegador:
🔗 http://localhost:5173

Credenciais iniciais:
Login: admin@admin
Senha: 123456

6.2 Endpoints Úteis
Recurso	URL
Frontend	http://localhost:5173
API Backend	http://localhost:3001/api/v1/categorias
Documentação	http://localhost:5173/api-docs


7. Solução de Problemas Comuns
🔴 Containers não iniciam
Execute para ver os logs:

bash
docker-compose logs -f
🔴 Erros de conexão com o banco
Verifique se o MySQL está respondendo:

bash
docker exec -it mysql_db mysql -u root -p
🔴 Atualizações no código
Reconstrua os containers após alterações:

bash
docker-compose up --build -d
8. Segurança Importante
Altere imediatamente a SENHA_DEFAULT após o primeiro acesso

Nunca compartilhe o arquivo .env

Atualize as credenciais do banco de dados em produção
