# Controle de Estoque Básico

Este é um projeto completo de controle e gerenciamento de estoque de mercadorias em tempo real. A aplicação foi desenvolvida com foco na integração prática entre uma interface web (front-end) dinâmica e um servidor de banco de dados relacional (back-end).

## 🚀 Tecnologias Utilizadas

* **Front-End:**
  * **HTML5:** Estruturação semântica de todas as telas da aplicação.
  * **Bootstrap 5:** Framework CSS utilizado para garantir uma interface moderna, limpa e totalmente responsiva.
  * **Bootstrap Icons:** Biblioteca de ícones oficiais aplicada nos botões e cabeçalhos.
  * **SweetAlert2:** Biblioteca JavaScript utilizada para a criação de modais de alertas flutuantes e confirmações de exclusão interativas.
  * **JavaScript (Vanilla/ES6):** Manipulação assíncrona do DOM através da API `fetch` para comunicação com o servidor.

* **Back-End:**
  * **Node.js & Express:** Ambiente de execução e framework para a construção e gerenciamento das rotas da API REST.
  * **MySQL:** Banco de dados relacional para o armazenamento permanente e seguro de todas as informações dos produtos.

---

## 📂 Estrutura de Pastas do Projeto

A organização dos arquivos segue o padrão estrutural da aplicação:

```text
/projeto
│
├── cadastro.html     # Tela para inserção de novos produtos e edição de itens existentes
├── listagem.html     # Tela principal de visualização, filtragem e gerenciamento do estoque
├── banco.sql         # Script SQL com a estrutura do banco de dados e dados de teste
├── server.js         # Servidor Node.js com as rotas da API REST (Back-end)
│
├── /css
│   └── style.css     # Estilizações personalizadas complementares ao Bootstrap
│
├── /js
│   └── script.js     # Arquivo opcional/auxiliar de funções e mapeamento JavaScript
│
└── /img              # Pasta destinada ao armazenamento de imagens e ativos locais

🛠️ Funcionalidades Implementadas
Listagem em Tempo Real: Exibição completa de todos os itens cadastrados no MySQL com formatação de moeda brasileira (R$).

Ordenação Inteligente: Filtro interativo na listagem que permite ordenar os produtos por ordem de cadastro, nome (A-Z / Z-A), preço e quantidade em estoque.

Cadastro e Validação: Formulário inteligente para inserção de produtos diretamente no estoque.

Edição Dinâmica (Modo Edição): A mesma tela de cadastro identifica a presença de um ID na URL, preenche os campos automaticamente e altera o comportamento para atualização (PUT).

Exclusão Segura: Botão de exclusão integrado ao SweetAlert2 que solicita a confirmação do usuário antes de rodar o comando DELETE no MySQL.

Alerta de Estoque Vazio: Feedback visual amigável caso não existam mercadorias registradas no banco de dados.

⚙️ Como Rodar o Projeto Localmente
1. Configurar o Banco de Dados
Abra o MySQL Workbench (ou o terminal do MySQL).

Execute todo o conteúdo contido no arquivo banco.sql para criar o banco de dados sistema_produtos, a tabela produtos e inserir os dados de teste.

2. Iniciar o Servidor Back-End
Abra a pasta raiz do projeto no seu VS Code.

Abra o terminal integrado e certifique-se de que o Node está configurado.

Inicie o servidor executando o comando:

Bash
node server.js
Certifique-se de que a mensagem "Servidor rodando na porta 3000" apareceu no terminal.

3. Rodar o Front-End
Com o servidor Node ativo, clique com o botão direito no arquivo listagem.html.

Selecione a opção Open with Live Server para abrir a aplicação diretamente no seu navegador.