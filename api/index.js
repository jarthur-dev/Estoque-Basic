const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS CORRIGIDA PARA A RAIZ
app.use(express.static(path.join(__dirname, '../'))); 
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));

// ==========================================
// CONFIGURAÇÃO DO POOL LENDO AS VARIÁVEIS DA VERCEL
// ==========================================
const db = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    database: process.env.MYSQL_ADDON_DB,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    port: process.env.MYSQL_ADDON_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 1,         // Mantido em 1 para o plano gratuito
    queueLimit: 0,
    idleTimeout: 10000,         
    enableKeepAlive: true,      
    keepAliveInitialDelay: 0,
    ssl: { rejectUnauthorized: false }
});

// Rota da Página Inicial - Ajustada para buscar na raiz agora!
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'listagem.html'));
});

// ==========================================
// ROTA 2: LISTAR TODOS OS PRODUTOS (MÉTODO GET)
// ==========================================
app.get('/api/produtos', (req, res) => {
    db.query('SELECT * FROM produtos ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos no banco:', err);
            return res.status(500).json({ error: err.message, detail: err });
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
// ROTA: CADASTRAR NOVO PRODUTO (MÉTODO POST)
// ==========================================
app.post('/api/produtos', (req, res) => {
    const { nome, categoria, quantidade, preco, descricao } = req.body;
    const query = 'INSERT INTO produtos (nome, categoria, quantidade, preco, descricao) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [nome, categoria, parseInt(quantidade), parseFloat(preco), descricao], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto no banco:', err);
            return res.status(500).json({ error: err.message, detail: err });
        }
        res.status(201).json({ message: "Produto cadastrado com sucesso", id: result.insertId });
    });
});

// ==========================================
// ROTA: ATUALIZAR PRODUTO EXISTENTE (MÉTODO PUT)
// ==========================================
app.put('/api/produtos/:id', (req, res) => {
    const idProduto = req.params.id;
    const { nome, categoria, quantidade, preco, descricao } = req.body;
    const query = 'UPDATE produtos SET nome = ?, categoria = ?, quantidade = ?, preco = ?, descricao = ? WHERE id = ?';

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

// Exporta o app para o Vercel conseguir ler como Serverless Function
module.exports = app;