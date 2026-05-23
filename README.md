# 📦 CONTROLE DE ESTOQUE // GERENCIAMENTO EM TEMPO REAL

O **Estoque Básico** é um ecossistema completo focado em alta performance, organização de mercadorias e integridade de dados. Desenvolvida com uma estética moderna e limpa, a plataforma foi projetada para entregar uma experiência de navegação fluida, responsiva e de gerenciamento em tempo real, conectando diretamente a interface de usuário a um banco de dados relacional.

---

## ⚡ O Conceito

A aplicação resolve o problema de controle interno de pequenos e médios inventários, permitindo que alterações de quantidade, preço e dados informativos reflitam instantaneamente. A arquitetura separa de forma limpa as responsabilidades de renderização de tela (Front-end) das regras de persistência e endpoints de API (Back-end).

---

## 🛠️ Pilha Tecnológica

O projeto utiliza o que há de mais prático e robusto no ecossistema de desenvolvimento web:

* **Interface:** `HTML5` para estruturação semântica e acessível das páginas.
* **Estilização:** `Bootstrap 5` para garantia de um layout fluido, design profissional e total responsividade.
* **Componentes Visuais:** `Bootstrap Icons` para mapeamento de ações e representações visuais limpas.
* **Interações Dinâmicas:** `SweetAlert2` para feedbacks assíncronos e caixas de confirmação de segurança.
* **Linguagem Base:** `JavaScript (ES6+)` para manipulação de eventos do DOM e requisições assíncronas com a API `fetch`.
* **Ambiente de Execução:** `Node.js` integrado ao framework `Express` para provisionamento da API REST.
* **Banco de Dados:** `MySQL` para armazenamento relacional seguro e persistência definitiva.

---

## 🚀 Funcionalidades da Plataforma

* **Listagem Automatizada:** Renderização assíncrona dos itens do banco com formatação automática para moeda brasileira (`R$`).
* **Ordenação Inteligente:** Filtro em tempo real que reordena a tabela por ID de cadastro, Nome (`A-Z` e `Z-A`), Preço ou Nível de Estoque.
* **Formulário Híbrido:** Tela inteligente de cadastro capaz de ler parâmetros da URL e se transformar dinamicamente em modo de edição (`PUT`).
* **Exclusão com Trava de Segurança:** Janela de confirmação que impede cliques acidentais e garante a remoção consciente do item no banco.
* **Tratamento de Falhas:** Feedbacks automatizados e telas de aviso amigáveis para falhas de conexão ou inventário totalmente vazio.

---

## ⚙️ Como Rodar o Projeto na Sua Máquina

### 1. Configuração do Banco de Dados

Abra o seu **MySQL Workbench** e execute integralmente o script de criação contido no arquivo `banco.sql` local para provisionar corretamente o esquema `sistema_produtos` e a tabela de armazenamento.

---

### 2. 🖥️ Inicialização do Servidor Back-End

Abra a pasta do projeto no terminal integrado do seu **VS Code** e inicialize o serviço do Node.js:

```bash
node server.js

```
---

## 3. 🌐 Execução da Interface Web

### Com o servidor Node ativo rodando em segundo plano:

Vá até a árvore de arquivos e clique com o botão direito sobre o arquivo `cadastro.html`.

Selecione a opção Open with Live Server para abrir o dashboard diretamente no seu navegador padrão.

---

## 📂 Estrutura de Pastas do Projeto

A organização dos arquivos segue rigorosamente o padrão estrutural planejado para a aplicação:

```text
/projeto
│
├── banco.sql         # Script de criação de tabelas e massa de dados do MySQL
├── server.js         # Servidor API REST construído em Node.js
│
├── /css
│   └── style.css     # Estilizações finas e personalizadas complementares ao Bootstrap
│
├── /html
│   ├── cadastro.html # Formulário de inserção e edição de mercadorias
│   └── listagem.html # Painel principal de controle e listagem do estoque
│
├── /js
│   └── script.js     # Arquivos e funções auxiliares de monitoramento
└── /img              # Diretório de armazenamento de mídias e ativos visuais locais