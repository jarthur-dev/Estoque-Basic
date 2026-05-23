const API_URL = '/api/produtos';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('formCadastro')) {
        inicializarCadastro();
    }
    // CORRIGIDO: Agora aponta exatamente para a tabela do seu HTML
    if (document.getElementById('listaProdutos')) {
        carregarProdutos();
    }
});

// ---- LÓGICA DA TELA DE CADASTRO ----
function inicializarCadastro() {
    document.getElementById('formCadastro').addEventListener('submit', async (e) => {
        e.preventDefault();

        const produto = {
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            quantidade: parseInt(document.getElementById('quantidade').value),
            preco: parseFloat(document.getElementById('preco').value),
            descricao: document.getElementById('descricao').value
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            });

            if (response.ok) {
                mostrarMensagem("Produto cadastrado com sucesso!", "success");
                document.getElementById('formCadastro').reset();
                if (document.getElementById('listaProdutos')) {
                    carregarProdutos();
                }
            } else {
                throw new Error("Erro ao salvar produto no servidor.");
            }
        } catch (error) {
            console.error("Erro detalhado na requisição de cadastro:", error);
            mostrarMensagem("Erro ao conectar com o servidor.", "danger");
        }
    });
}

// ---- LÓGICA DA TELA DE LISTAGEM ----
async function carregarProdutos() {
    const tabela = document.getElementById('listaProdutos');
    try {
        const response = await fetch(API_URL);
        const produtos = await response.json();

        if (produtos.error || !Array.isArray(produtos)) {
            console.error("O banco de dados enviou uma resposta inválida:", produtos);
            throw new Error(produtos.error || "Resposta inválida do servidor");
        }

        tabela.innerHTML = '';

        if (produtos.length === 0) {
            tabela.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhum produto em estoque.</td></tr>`;
            return;
        }

        produtos.forEach(prod => {
            const tr = document.createElement('tr');
            
            // Aceita Categoria maiúscula (Clever Cloud) ou minúscula
            const cat = prod.Categoria || prod.categoria || "Sem Categoria";
            const id = prod.id || prod.ID;

            tr.innerHTML = `
                <td class="ps-3">${id}</td>
                <td><strong>${prod.nome}</strong></td>
                <td><span class="badge bg-secondary">${cat}</span></td>
                <td class="text-center">${prod.quantidade}</td>
                <td class="text-end">R$ ${parseFloat(prod.preco).toFixed(2)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger" onclick="deletarProduto(${id})">Excluir</button>
                </td>
            `;
            tabela.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro capturado na renderização da listagem:", error);
        tabela.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red; font-weight:bold;">Erro ao carregar dados do servidor.</td></tr>`;
    }
}

// ---- FUNÇÃO PARA EXCLUIR PRODUTO ----
async function deletarProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (response.ok) {
                carregarProdutos();
            } else {
                alert("Erro ao excluir produto.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor para exclusão:", error);
        }
    }
}

// ---- FUNÇÃO AUXILIAR DE FEEDBACK VISUAL ----
function mostrarMensagem(texto, tipo) {
    const msgDiv = document.getElementById('mensagem');
    if (!msgDiv) return;
    
    msgDiv.innerText = texto;
    msgDiv.className = `mensagem ${tipo}`;
    
    setTimeout(() => {
        msgDiv.innerText = '';
        msgDiv.className = '';
    }, 3000);
}