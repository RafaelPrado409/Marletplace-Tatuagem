# 🎨 Marketplace de Estúdios de Tatuagem  
Sistema completo de marketplace onde clientes podem encontrar estúdios, visualizar portfólios de artistas e agendar sessões de tatuagem diretamente pela plataforma.

Este projeto foi desenvolvido utilizando **NestJS + Prisma (Backend)** e **React + Vite + Tailwind (Frontend)**, seguindo arquitetura profissional, autenticação JWT, CRUDs completos e painéis administrativos.

---

# 📌 Índice

1. [Visão Geral](#visão-geral)  
2. [Funcionalidades](#funcionalidades)  
3. [Arquitetura da Aplicação](#arquitetura-da-aplicação)  
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)  
5. [Modelagem do Banco (Prisma)](#modelagem-do-banco-prisma)  
6. [Autenticação e Autorização](#autenticação-e-autorização)  
7. [Backend](#backend)  
8. [Frontend](#frontend)  
9. [Rotas da API](#rotas-da-api)  
10. [Estrutura de Pastas](#estrutura-de-pastas)  
11. [Como Executar o Projeto](#como-executar-o-projeto)  
12. [Build e Deploy](#build-e-deploy)  
13. [Prints do Sistema](#prints-do-sistema)  
14. [Roadmap](#roadmap)  
15. [Contribuindo](#contribuindo)  
16. [Licença](#licença)

---

# 🎯 Visão Geral

O sistema funciona como um marketplace de tatuagem, conectando:

- **Clientes**, que podem pesquisar estúdios e artistas, visualizar portfólios e agendar sessões.  
- **Artistas**, que administram agendamentos e exibem seus portfólios.  
- **Estúdios**, que gerenciam sua equipe de artistas.  
- **Administradores**, que controlam usuários, estilos e estúdios.

O projeto foi construído como plataforma real, utilizando arquitetura modular e componentes reutilizáveis.

---

# 🚀 Funcionalidades

## 👥 Usuários
- Cadastro e login com JWT  
- Perfis: **CLIENT**, **ARTIST**, **ADMIN**  
- Página “Meu Perfil”  

## 🏢 Estúdios
- Listagem pública  
- Página detalhada  
- Dono pode criar seu estúdio  
- Gerenciar artistas (adicionar/remover)  
- Dashboard completo do estúdio  

## 🎨 Artistas
- Filtros por nome, estilo, estúdio e cidade  
- Página de perfil do artista  
- Portfólio (fotos)  
- Painel de agendamentos  

## 📅 Agendamentos
- Cliente marca horário diretamente com artista  
- Artista recebe agendamentos no painel  
- Status do agendamento:  
  - PENDING  
  - CONFIRMED  
  - CANCELED  
  - COMPLETED  

## 🛠 Administração
- Administração de usuários (listar, promover, desativar)  
- Administração de estilos de tatuagem  
- Administração de estúdios (CRUD completo)

---

# 🏗 Arquitetura da Aplicação

A aplicação é dividida em dois módulos:

/backend -> API em NestJS + Prisma
/frontend -> SPA em React + Tailwind


Ambas as aplicações funcionam desacopladas, conectadas via HTTP.

---

# 🧰 Tecnologias Utilizadas

## Backend
- **NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Class-Validator**
- **Guards + Roles**
- **Swagger (opcional)**

## Frontend
- **React + Vite**
- **React Router DOM**
- **Axios**
- **Tailwind CSS**
- **Radix UI (opcional)**

---

# 🗄 Modelagem do Banco (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CLIENT)
  isActive  Boolean  @default(true)

  artist    Artist?
  studios   Studio[] @relation("StudioOwner")
  appointmentsClient  Appointment[] @relation("ClientAppointments")
  appointmentsArtist  Appointment[] @relation("ArtistAppointments")
}

model Studio {
  id          String    @id @default(cuid())
  name        String
  description String
  city        String
  state       String
  address     String
  phone       String?
  ownerId     String
  owner       User      @relation("StudioOwner", fields: [ownerId], references: [id])
  artists     Artist[]
}

model Artist {
  id          String     @id @default(cuid())
  displayName String
  bio         String?
  instagram   String?
  userId      String     @unique
  studioId    String?
  user        User       @relation(fields: [userId], references: [id])
  studio      Studio?    @relation(fields: [studioId], references: [id])
  portfolio   PortfolioItem[]
}

model Style {
  id    String @id @default(cuid())
  name  String @unique
  slug  String @unique
}

model Appointment {
  id        String   @id @default(cuid())
  startsAt  DateTime
  endsAt    DateTime
  status    Status   @default(PENDING)
  artistId  String
  clientId  String

  artist    Artist   @relation("ArtistAppointments", fields: [artistId], references: [id])
  client    User     @relation("ClientAppointments", fields: [clientId], references: [id])
}

model PortfolioItem {
  id        String  @id @default(cuid())
  imageUrl  String
  artistId  String
  artist    Artist @relation(fields: [artistId], references: [id])
}

enum Role {
  CLIENT
  ARTIST
  ADMIN
}

enum Status {
  PENDING
  CONFIRMED
  CANCELED
  COMPLETED
}
```

🔐 Autenticação e Autorização

Auth com JWT (Bearer Token)

Login → retorna token + dados do usuário

Middleware/Interceptor adiciona token nas requisições

Guards controlam acesso:

```
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
```

🧱 Backend
Endpoints principais:

/auth/login

/auth/register

/users

/artists

/studios

/styles

/appointments

/me/...

Arquitetura modular:

src/
 ├── auth/
 ├── users/
 ├── studios/
 ├── artists/
 ├── appointments/
 ├── styles/
 ├── me/
 └── common/

 🎨 Frontend

O frontend é uma aplicação React com rotas:

/               -> landing
/studios        -> lista de estúdios
/studios/:id    -> detalhes do estúdio
/artists        -> lista de artistas
/artists/:id    -> detalhes do artista
/artists/:id/book  -> agendar
/me             -> perfil usuário
/me/appointments -> agendamentos cliente
/me/artist/appointments -> painel artista
/admin/...      -> páginas administrativas

Tailwind aplicado seguindo design clean e moderno.

🛣 Rotas da API

As principais estão documentadas abaixo:

Auth
Método	Rota	Descrição
POST	/auth/login	Login
POST	/auth/register	Novo usuário
Users

| GET | /users | Admin lista todos |
| PATCH | /users/:id/role | Define role |
| PATCH | /users/:id/active | Ativa/desativa |

Studios

| GET | /studios | Públicos |
| GET | /studios/my | Estúdios do dono |
| POST | /studios/my | Criar estúdio |
| PATCH | /studios/admin/:id | Editar |
| DELETE | /studios/admin/:id | Excluir |

Artists

| GET | /artists | Filtros avançados |
| POST | /studios/:id/artists | Adicionar artista ao estúdio |

Appointments

| POST | /appointments | Cliente agenda |
| GET | /me/appointments | Cliente |
| GET | /me/artist/appointments | Artista |

🗂 Estrutura de Pastas

Backend:

backend/
 ├── src/
 │    ├── auth/
 │    ├── users/
 │    ├── studios/
 │    ├── artists/
 │    ├── appointments/
 │    ├── styles/
 │    └── prisma/
 ├── prisma/
 ├── .env
 └── package.json


Frontend:

frontend/
 ├── src/
 │    ├── pages/
 │    ├── components/
 │    ├── layouts/
 │    ├── lib/
 │    ├── hooks/
 │    └── router/
 ├── public/
 ├── index.html
 └── package.json

 ▶ Como Executar o Projeto
Backend

```
cd backend
npm install
npx prisma migrate dev
npm run start:dev
```

Frontend

```
cd frontend
npm install
npm run dev

```

Acesse em:
http://localhost:5173


📦 Build e Deploy
Produção Backend (PM2)

```
npm run build
pm2 start dist/main.js
```

Produção Frontend (Vercel/Netlify)

```
npm run build
```
