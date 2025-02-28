# Gerenciador de Tarefas

Este é um projeto de Gerenciamento de Tarefas desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do curso de Desenvolvimento Web Full Stack da PUC-RS. O objetivo é ajudar na organização e gerenciamento de tarefas.

## Funcionalidades

- **Autenticação de Usuário**: Login e logout de usuários.
- **Gerenciamento de Tarefas**: Criação, edição, exclusão e visualização de tarefas.
- **Prioridades de Tarefas**: Definição de prioridades (Baixa, Média, Alta) para as tarefas.
- **Compartilhamento de Tarefas**: Compartilhamento de tarefas via WhatsApp e Email.
- **Filtros e Pesquisa**: Filtragem de tarefas por título e prioridade.

## Tecnologias Utilizadas

- **Frontend**: Angular, Angular Material
- **Backend**: FastAPI, Lambda
- **Autenticação**: JWT (JSON Web Tokens)
- **Estilização**: SCSS

## Estrutura do Projeto

```plaintext
todo-list-frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.scss
│   │   │   │   ├── login.component.ts
│   │   │   ├── tasks/
│   │   │   │   ├── tasks.component.html
│   │   │   │   ├── tasks.component.scss
│   │   │   │   ├── tasks.component.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── task.service.ts
│   │   ├── models/
│   │   │   ├── task.model.ts
│   ├── assets/
│   ├── environments/
│   ├── index.html
│   ├── main.ts
├── angular.json
├── package.json
├── README.md
