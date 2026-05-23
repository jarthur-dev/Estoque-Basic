const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO DIRETAMENTE APONTADA PARA A RAIZ DO PROJETO
app.use(express.static(path.join(process.cwd())));

// ==========================================
// CONFIGURAÇÃO DO POOL COM VARIÁVEIS DA VERCEL
// ==========================================
const db = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    database: process.env.MYSQL_ADDON_DB,
    user: process.env.MYSQL_ADDON_USER,
    password: process.env.MYSQL_ADDON_PASSWORD,
    port: process.env.MYSQL_ADDON_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 1,         // Limite seguro para o plano gratuito
    queueLimit: 0,
    idleTimeout: 10000,         
    enableKeepAlive: true,      
    keepAliveInitialDelay: 0,
    ssl: { rejectUnauthorized: false }
});

// Rota da Página Inicial - Serve a listagem na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'listagem.html'));
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
// ROTA: DELETAR PRODUTO (MÉTODO DELETE)
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

module.exports = app;