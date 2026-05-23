// ==========================================
// IMPORTAÇÃO DAS BIBLIOTECAS (PACOTES)
// ==========================================
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path'); // Importação necessária para gerenciar caminhos de arquivos

const app = express();

app.use(cors());
app.use(express.json());

// Faz o Express servir os arquivos das pastas css, js, img e html automaticamente
app.use(express.static(path.join(__dirname)));

// ==========================================
// CONFIGURAÇÃO DO POOL DE CONEXÕES COM O MYSQL
// ==========================================
const db = mysql.createPool({
    host: 'bzryndb6o1831lkc6r6o-mysql.services.clever-cloud.com', 
    user: 'us7ddcx1drmpwbrf',                                    
    password: 'cOhbYNw21RvYR084CHYN',                                  
    database: 'bzryndb6o1831lkc6r6o',                            
    port: 3306,
    waitForConnections: true,
    connectionLimit: 3, 
    queueLimit: 0,
    ssl: { rejectUnauthorized: false }
});

// Teste simples para garantir que o pool alcança o servidor na nuvem
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL na Nuvem:', err.message);
        return;
    }
    console.log('🚀 Conexão com o MySQL na Nuvem validada com sucesso!');
    connection.release(); 
});

// ==========================================
// ROTA DA PÁGINA INICIAL (ENTREGA O FRONTEND)
// ==========================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'listagem.html'));
});

// ==========================================
// ROTA 1: CADASTRAR PRODUTO (MÉTODO POST)
// ==========================================
app.post('/api/produtos', (req, res) => {
    const { nome, categoria, quantidade, preco, descricao } = req.body;
    const query = 'INSERT INTO produtos (nome, categoria, quantidade, preco, descricao) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [nome, categoria, parseInt(quantidade), parseFloat(preco), descricao], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto no banco:', err);
            return res.status(500).json(err); 
        }
        res.status(201).json({ id: result.insertId });
    });
});

// ==========================================
// ROTA 2: LISTAR TODOS OS PRODUTOS (MÉTODO GET)
// ==========================================
app.get('/api/produtos', (req, res) => {
    db.query('SELECT * FROM produtos ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos no banco:', err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// ==========================================
// ROTA: BUSCAR APENAS UM PRODUTO PELO ID
// ==========================================
app.get('/api/produtos/:id', (req, res) => {
    const idProduto = req.params.id;
    db.query('SELECT * FROM produtos WHERE id = ?', [idProduto], (err, result) => {
        if (err) {
            console.error('Erro ao buscar produto único no banco:', err);
            return res.status(500).json(err);
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.json(result[0]);
    });
});

// ==========================================
// ROTA: ATUALIZAR PRODUTO EXISTENTE (MÉTODO PUT)
// ==========================================
app.put('/api/produtos/:id', (req, res) => {
    const idProduto = req.params.id;
    const { nome, categoria, quantidade, preco, descricao } = req.body;
    const query = 'UPDATE produtos SET nome = ?, categoria = ?, quantidade = ?, preco = ?, descricao = ? WHERE id = ?';

    // CORRIGIDO: Mudado de "category" para "categoria" para evitar o travamento do Node!
    db.query(query, [nome, categoria, parseInt(quantidade), parseFloat(preco), descricao, idProduto], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto no banco:', err);
            return res.status(500).json(err);
        }
        res.json({ message: "Produto updated com sucesso" });
    });
});

// ==========================================
// ROTA 3: DELETAR PRODUTO (MÉTODO DELETE)
// ==========================================
app.delete('/api/produtos/:id', (req, res) => {
    const idProduto = req.params.id;
    db.query('DELETE FROM produtos WHERE id = ?', [idProduto], (err, result) => {
        if (err) {
            console.error('Erro ao deletar produto do banco:', err);
            return res.status(500).json(err);
        }
        res.json({ message: "Deletado com sucesso" });
    });
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR WEB
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('==================================================');
    console.log(`Servidor rodando na porta ${PORT} com MySQL na Nuvem!`);
    console.log('==================================================');
});

// Exporta o app para o Vercel conseguir ler como Serverless Function
module.exports = app;