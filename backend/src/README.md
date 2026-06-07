# Backend Source Code (src)

Este diretório contém o código fonte do backend da aplicação ToolKit, construído com o framework [NestJS](https://nestjs.com/).

## 🔧 Alterações Recentes

Durante o desenvolvimento, algumas correções importantes foram feitas neste diretório, especialmente relacionadas à integração com o Cloudinary:

*   **Correção de Tipagem no Cloudinary Helper (`src/providers/cloudinary/cloudinary.helper.ts`):** 
    *   Foi corrigido um erro em tempo de execução (`TypeError: reject is not a constructor`) causado pelo uso incorreto da palavra-chave `new` ao chamar a função `reject` em uma Promise. A chamada `new reject(error)` foi alterada para `reject(error)`.
    *   Para satisfazer as regras do ESLint (especificamente a regra `@typescript-eslint/prefer-promise-reject-errors`), a rejeição da Promise foi atualizada para sempre retornar uma instância nativa da classe `Error`. A chamada final ficou: `reject(new Error(error.message || 'Cloudinary upload failed'))`.

## 🚀 Como Rodar o Backend

Certifique-se de ter o Node.js instalado e estar dentro do diretório `backend` (não apenas na pasta `src`).

1. **Instalar dependências (caso ainda não tenha feito):**
   ```bash
   npm install
   ```

2. **Rodar a aplicação:**
   * **Modo de desenvolvimento (com hot-reload):**
     ```bash
     npm run start:dev
     ```
   * **Modo de produção:**
     ```bash
     npm run build
     npm run start:prod
     ```

A API estará rodando por padrão na porta `3250` (ou na porta definida pela variável de ambiente `PORT`). Ex: `http://localhost:3250`.

## 📚 Como Acessar o Swagger (Documentação da API)

O backend utiliza o Swagger para documentar os endpoints e testá-los diretamente pelo navegador. 

Com a aplicação rodando (ex: via `npm run start:dev`), você pode acessar a documentação na rota `/docs`:

👉 **[http://localhost:3250/docs](http://localhost:3250/docs)**

Lá você encontrará a interface interativa do Swagger com todos os módulos disponíveis (usuários, projetos, autenticação, etc.).