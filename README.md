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
```

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/todo-list-frontend.git
cd todo-list-frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
ng serve
```

4. Abra o navegador e acesse `http://localhost:4200`.

## Uso

### Login

1. Insira suas credenciais de login (email e senha).
2. Clique no botão "Continuar" para acessar o sistema.

### Gerenciamento de Tarefas

1. **Criar Tarefa**: Clique no botão "Criar Tarefa" no menu para abrir o diálogo de criação de tarefas.
2. **Editar Tarefa**: Clique no ícone de edição em uma tarefa para abrir o diálogo de edição.
3. **Excluir Tarefa**: Clique no ícone de lixeira em uma tarefa para excluí-la.
4. **Compartilhar Tarefa**: Clique no ícone de compartilhamento em uma tarefa para compartilhar via WhatsApp ou Email.

### Filtros e Pesquisa

1. Use os campos de filtro para filtrar tarefas por título e prioridade.


## Contato

- **Autor**: Eric Damascena
- **LinkedIn**: [Eric Damascena](https://www.linkedin.com/in/eric-damascena/)
- **Instagram**: [@ericdamasc](https://www.instagram.com/ericdamasc)

## Detalhes Adicionais

### Estrutura de Diretórios

- **components**: Contém os componentes do Angular, como `login` e `tasks`.
- **services**: Contém os serviços do Angular, como `auth.service.ts` e `task.service.ts`.
- **models**: Contém os modelos de dados, como `task.model.ts`.
- **assets**: Contém os arquivos estáticos, como imagens e ícones.
- **environments**: Contém os arquivos de configuração de ambiente.
