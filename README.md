<h1 align="center">🔁 Twinterior Blog</h1>
<p align="center">Uma experiência de blogging moderna, híbrida e responsiva com Angular</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-16-DD0031?style=flat&logo=angular" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript" />
  <img src="https://img.shields.io/badge/SCSS-Styled-informational?style=flat&logo=sass" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-black?style=flat&logo=vercel" />
</p>

---

## 🎥 Demonstração

https://github.com/user-attachments/assets/ec8674d0-e89e-4368-b63d-f7e077732107

---

## 🚀 Sobre o Projeto

Twinterior Blog é uma plataforma de blog pessoal desenvolvida com Angular e Spring Boot como backend. O projeto utiliza uma abordagem híbrida combinando componentes standalone com o CoreModule para serviços essenciais, oferecendo o melhor dos dois mundos em termos de modularidade e reutilização.

---

## 📦 Tecnologias Utilizadas

- [Angular 16+](https://angular.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)
- [RxJS](https://rxjs.dev/)
- [Chart.js](https://www.chartjs.org/)
- [Vercel (deploy frontend)](https://vercel.com/)
- [Railway (deploy backend)](https://railway.app/)

---


## 📁 Organização do Projeto

- `core/`: Serviços globais, guards, interceptadores, modelos e layouts  
- `features/`: Módulos independentes como autenticação, posts, temas e usuários  
- `shared/`: Componentes reutilizáveis e utilitários  
- `assets/`: Imagens e recursos estáticos  
- `environments/`: Configurações para diferentes ambientes (dev/prod)  


---

## 🔐 Autenticação

* Login e registro com persistência via LocalStorage
* Redirecionamento automático após login
* Proteção de rotas com `authGuardFn`
* Interceptador que injeta o token JWT nas requisições HTTP

---

## 📊 Dashboard de Métricas

* Visualização da quantidade de postagens por autor
* Gráficos interativos com Chart.js
* Monitoramento do total de postagens
* Listagem de publicações recentes
* Filtros avançados para análise personalizada

---

## ⚙️ Instalação Local

```bash
# Clone o repositório
git clone https://github.com/galvessantos/projeto-blog-aceleramaker-frontend1.git
cd projeto-blog-aceleramaker-frontend1

# Instale as dependências
npm install

# Configure o endpoint da API
# edite o arquivo: src/environments/environment.ts

export const environment = {
  production: false,
  api: 'http://localhost:8080'
};

# Inicie o servidor local
ng start
```

---

## 🧠 Arquitetura Adotada

* ✅ Abordagem híbrida com CoreModule para serviços globais e componentes standalone para features
* ✅ CoreModule centraliza interceptadores HTTP, serviços de autenticação e configurações essenciais
* ✅ Componentes standalone facilitam a manutenção e reduzem a necessidade de módulos adicionais
* ✅ Implementação do padrão de serviços com injeção providedIn: 'root'
* ✅ Design System consistente com Angular Material personalizado via SCSS

---

## 🌐 Deploy

A aplicação está hospedada nos seguintes links:

* 🌐 **Frontend (Vercel)**: [https://twinterior.vercel.app](https://projeto-blog-aceleramaker-frontend1.vercel.app)
* 🛠 **Backend (Railway)**: [twinterior-api.up.railway.app](https://twinterior-api.up.railway.app)

  #### Diagrama Simplificado

```
\[ Usuário ]
      ↓
\[ Frontend - Angular (Vercel) ]
      ↓
\[ Backend - API REST (Railway) ]
      ↓
\[ Banco de Dados - MySQL (Railway) ]
````

---

## 👤 Autor

Desenvolvido por Gabriel Alves  
Bootcamp Acelera Maker – Montreal

