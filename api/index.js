const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// CONFIGURAÇÃO CORRETA DE ARQUIVOS ESTÁTICOS (Isso corrige o erro do MIME type do CSS!)
app.use(express.static(path.join(__dirname))); 
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

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
    ssl: { rejectUnauthorized: false } // Mantido para segurança da nuvem
});

// Rota da Página Inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'listagem.html'));
});

// ==========================================
// ROTA 2: LISTAR TODOS OS PRODUTOS (MÉTODO GET)
// ==========================================
app.get('/api/produtos', (req, res) => {
    db.query('SELECT * FROM produtos ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos no banco:', err);
            // MODIFICADO: Retorna o erro em formato JSON para conseguirmos ler no DevTools
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
        res.json({ message: "Produto atualizado com sucesso" });
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