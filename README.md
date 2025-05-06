# 💬 Twinterior Blog

**Twinterior Blog** é uma aplicação full-stack moderna inspirada no formato de Blog da famosa rede social Twitter. Desenvolvida com **Angular**, focando em arquitetura escalável, componentes standalone e uma interface intuitiva baseada no Angular Material. O projeto visa boas práticas de desenvolvimento, responsividade e experiência do usuário.

## 📐 Arquitetura & Estrutura

O projeto segue uma **arquitetura baseada em features**, separando responsabilidades de forma clara entre serviços, componentes e módulos. Principais funcionalidades:

- Autenticação com login e registro  
- CRUD de posts (criar, ler, atualizar, deletar)  
- Organização por temas/categorias  
- Gerenciamento de perfil do usuário  
- Dashboard com estatísticas e gráficos  

## 🛠️ Stack Tecnológica

- **Framework Frontend**: Angular 16+ com *Standalone Components*  
- **UI Components**: Angular Material  
- **Gerenciamento de Estado**: Abordagem reativa com Services e Observables  
- **Estilização**: SCSS com design responsivo  
- **Comunicação HTTP**: Angular `HttpClient` com interceptadores  
- **Roteamento**: Angular Router com *lazy loading*  

## 🔑 Funcionalidades Principais

- **Autenticação JWT**: Sistema seguro com gerenciamento de tokens e guards de rota  
- **Design Responsivo**: UI adaptável a dispositivos móveis e telas variadas  
- **Material Design**: Componentes consistentes e acessíveis com Angular Material  
- **Formulários Reativos**: Validações completas com Reactive Forms  
- **Visualização de Dados**: Gráficos no dashboard utilizando Chart.js  
- **Tratamento de Erros**: Feedbacks amigáveis e sistema robusto de captura de erros  
- **Navegação Intuitiva**: Layout principal com navegação lateral  

## 📁 Organização do Projeto

- `core/`: Serviços globais, guards, interceptadores, modelos e layouts  
- `features/`: Módulos independentes como autenticação, posts, temas e usuários  
- `shared/`: Componentes reutilizáveis e utilitários  
- `assets/`: Imagens e recursos estáticos  
- `environments/`: Configurações para diferentes ambientes (dev/prod)  

## 🚀 Deploy

O Twinterior Blog está implantado em ambientes de produção, pronto para ser acessado de qualquer lugar:

- 🌐 **Frontend (Angular)**: [https://twinterior.vercel.app](https://projeto-blog-aceleramaker-frontend1.vercel.app)  
  — Hospedado na **Vercel**, com deploy automático via GitHub e previews por branch.

- 🔗 **Backend (API REST)**: [https://twinterior-api.up.railway.app](projeto-blog-aceleramaker-backend-production.up.railway.app)  
  — Implantado na **Railway**, com CI/CD, logs em tempo real e gerenciamento de banco de dados MySQL.

### 🧩 Diagrama Simplificado

```

\[ Usuário ]
      ↓
\[ Frontend - Angular (Vercel) ]
      ↓
\[ Backend - API REST (Railway) ]
      ↓
\[ Banco de Dados - MySQL (Railway) ]

````

## ▶️ Como Executar Localmente

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/galvessantos/projeto-blog-aceleramaker-frontend1.git
cd projeto-blog-aceleramaker-frontend1
npm install
ng serve
````

Abra o navegador e acesse: `http://localhost:4200`

## 👤 Autor

Desenvolvido por Gabriel Alves  
Bootcamp Acelera Maker – Montreal
