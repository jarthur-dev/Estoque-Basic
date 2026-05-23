// ==========================================
// IMPORTAÇÃO DAS BIBLIOTECAS (PACOTES)
// ==========================================

// O 'express' é o framework que cria o nosso servidor web e gerencia as rotas (URLs)
const express = require('express');

// O 'mysql2' é o driver que permite ao Node.js conversar e executar comandos no banco MySQL
const mysql = require('mysql2');

// O 'cors' (Cross-Origin Resource Sharing) permite que páginas HTML externas (front-end) 
// acessem com segurança as rotas do nosso servidor (back-end)
const cors = require('cors');

// Inicializa a nossa aplicação Express
const app = express();

// Ativa o CORS no servidor para liberar o acesso das telas html
app.use(cors());

// Configura o servidor para entender dados enviados no formato JSON (padrão de APIs)
app.use(express.json());


// ==========================================
// CONFIGURAÇÃO DA CONEXÃO COM O MYSQL
// ==========================================

// Cria o objeto de configuração apontando para o seu banco de dados local
const db = mysql.createConnection({
    host: 'localhost',       // Endereço onde o banco está rodando (seu próprio computador)
    user: 'root',            // Usuário administrador padrão do MySQL
    password: '1234',        // A senha que você definiu na instalação do servidor
    database: 'sistema_produtos' // O nome do banco de dados criado no Workbench
});

// Executa a tentativa de conexão com o banco de dados real
db.connect(err => {
    if (err) {
        // Se houver algum problema (banco desligado ou senha errada), exibe o erro no terminal
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    // Mensagem de sucesso indicando que o Node e o MySQL estão conversando perfeitamente
    console.log('Banco de Dados MySQL Conectado com sucesso!');
});


// ==========================================
// ROTA 1: CADASTRAR PRODUTO (MÉTODO POST)
// ==========================================
app.post('/api/produtos', (req, res) => {
    // Desestrutura os dados enviados pelo formulário HTML que chegam no corpo da requisição (req.body)
    const { nome, categoria, quantidade, preco, descricao } = req.body;

    // Comando SQL real com interrogações (?) para evitar ataques de SQL Injection (segurança)
    const query = 'INSERT INTO produtos (nome, categoria, quantidade, preco, descricao) VALUES (?, ?, ?, ?, ?)';
    
    // Executa o comando no banco, convertendo quantidade para inteiro e preço para decimal (float)
    db.query(query, [nome, categoria, parseInt(quantidade), parseFloat(preco), descricao], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto no banco:', err);
            return res.status(500).json(err); // Retorna erro 500 (Erro Interno do Servidor) caso falhe
        }
        // Retorna status 201 (Criado com sucesso) enviando de volta o ID que o MySQL gerou automaticamente
        res.status(201).json({ id: result.insertId });
    });
});


// ==========================================
// ROTA 2: LISTAR TODOS OS PRODUTOS (MÉTODO GET)
// ==========================================
app.get('/api/produtos', (req, res) => {
    // Comando SQL para buscar todos os itens salvos, ordenando do mais novo para o mais antigo (id DESC)
    db.query('SELECT * FROM produtos ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos no banco:', err);
            return res.status(500).json(err);
        }
        // Retorna a lista completa de produtos encontrados em formato JSON para a nossa tabela do front-end
        res.json(results);
    });
});


// ==========================================
// ROTA NOVA: BUSCAR APENAS UM PRODUTO PELO ID (MÉTODO GET INDIVIDUAL)
// ==========================================
// Essencial para o cadastro.html carregar os dados antigos do produto antes de editar
app.get('/api/produtos/:id', (req, res) => {
    const idProduto = req.params.id;

    db.query('SELECT * FROM produtos WHERE id = ?', [idProduto], (err, result) => {
        if (err) {
            console.error('Erro ao buscar produto único no banco:', err);
            return res.status(500).json(err);
        }
        
        // Se não encontrar nenhum item com esse ID no banco de dados
        if (result.length === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        // Devolve apenas o produto encontrado (o primeiro item do array)
        res.json(result[0]);
    });
});


// ==========================================
// ROTA NOVA: ATUALIZAR PRODUTO EXISTENTE (MÉTODO PUT)
// ==========================================
// Executada ao clicar no botão "Atualizar Produto" após modificar os campos
app.put('/api/produtos/:id', (req, res) => {
    const idProduto = req.params.id;
    const { nome, categoria, quantidade, preco, descricao } = req.body;

    const query = 'UPDATE produtos SET nome = ?, categoria = ?, quantidade = ?, preco = ?, descricao = ? WHERE id = ?';

    db.query(query, [nome, categoria, parseInt(quantidade), parseFloat(preco), descricao, idProduto], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto no banco:', err);
            return res.status(500).json(err);
        }
        res.json({ message: "Produto atualizado com sucesso" });
    });
});


// ==========================================
// ROTA 3: DELETAR PRODUTO (MÉTODO DELETE)
// ==========================================
// O ':id' indica um parâmetro dinâmico na URL (ex: /api/produtos/5 vai deletar o produto com ID 5)
app.delete('/api/produtos/:id', (req, res) => {
    // Pega o ID diretamente da URL da requisição
    const idProduto = req.params.id;

    // Comando SQL para apagar o registro específico baseado no ID
    db.query('DELETE FROM produtos WHERE id = ?', [idProduto], (err, result) => {
        if (err) {
            console.error('Erro ao deletar produto do banco:', err);
            return res.status(500).json(err);
        }
        // Retorna uma mensagem confirmando a exclusão bem-sucedida
        res.json({ message: "Deletado com sucesso" });
    });
});


// ==========================================
// INICIALIZAÇÃO DO SERVIDOR WEB
// ==========================================
// Diz ao Node para escutar as requisições na porta 3000 do seu computador
app.listen(3000, () => {
    console.log('==================================================');
    console.log('Servidor rodando na porta 3000 com MySQL Real!');
    console.log('Pronto para rodar o Front-End!');
    console.log('==================================================');
});