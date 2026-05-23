// Constante global contendo o endereço base (endpoint) do servidor para a API de produtos
const API_URL = '/api/produtos';

// Adiciona um escutador global que intercepta a finalização do carregamento da estrutura de árvore DOM da página
document.addEventListener('DOMContentLoaded', () => {
    // Raciocínio de roteamento interno: verifica se o elemento específico da tela de cadastro existe em tela
    if (document.getElementById('formCadastro')) {
        inicializarCadastro(); // Se sim, invoca o inicializador correspondente ao formulário
    }
    // Raciocínio de roteamento interno: verifica se o elemento específico da tela de listagem existe em tela
    if (document.getElementById('tabelaProdutos')) {
        carregarProdutos(); // Se sim, invoca o inicializador correspondente à renderização da tabela
    }
});

// ---- LÓGICA DA TELA DE CADASTRO ----
function inicializarCadastro() {
    // Adiciona um evento que escuta o envio (submit) do formulário de cadastro de produtos
    document.getElementById('formCadastro').addEventListener('submit', async (e) => {
        e.preventDefault(); // Bloqueia a ação nativa do navegador de recarregar a página web inteira

        // Captura os valores correntes presentes nos inputs e gera um objeto estruturado de dados
        const produto = {
            nome: document.getElementById('nome').value,
            categoria: document.getElementById('categoria').value,
            quantidade: parseInt(document.getElementById('quantidade').value), // Converte o valor string de entrada para Inteiro
            preco: parseFloat(document.getElementById('preco').value), // Converte o valor string de entrada para Ponto Flutuante (Decimal)
            descricao: document.getElementById('descricao').value
        };

        try {
            // Dispara uma requisição POST assíncrona enviando o objeto de produto codificado em formato JSON
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto) // Transforma a estrutura do objeto JS em uma cadeia de texto formato JSON
            });

            // Se o servidor processar e retornar um código indicador de sucesso (família 200)
            if (response.ok) {
                mostrarMensagem("Produto cadastrado com sucesso!", "success"); // Aciona a exibição do alerta de sucesso
                document.getElementById('formCadastro').reset(); // Executa a redefinição de limpeza em todos os inputs do formulário
            } else {
                throw new Error("Erro ao salvar produto no servidor."); // Força o desvio do fluxo de execução para o bloco catch
            }
        } catch (error) {
            // ISSO AQUI VAI MOSTRAR NO CONSOLE DO NAVEGADOR O QUE A VERCEL RESPONDEU
            console.error("Erro detalhado na requisição de cadastro:", error);
            mostrarMensagem("Erro ao conectar com o servidor.", "danger");
        }
    });
}

// ---- LÓGICA DA TELA DE LISTAGEM ----
async function carregarProdutos() {
    // Mapeia o elemento de corpo da tabela contido na listagem para injeção de dados
    const tabela = document.getElementById('listaProdutos'); 
    
    try {
        // Dispara uma requisição de leitura assíncrona (GET) para obter o Array com todos os produtos do MySQL
        const response = await fetch(API_URL);
        const produtos = await response.json(); // Converte a string de resposta estruturada JSON para Array utilizável

        // ==========================================
        // BLINDAGEM DA API: VALIDA SE O BACKEND RETORNOU ERRO EM VEZ DE ARRAY
        // ==========================================
        if (produtos.error || !Array.isArray(produtos)) {
            console.error("O banco de dados enviou uma resposta inválida:", produtos);
            throw new Error(produtos.error || "Resposta inválida do servidor");
        }

        tabela.innerHTML = ''; // Limpa qualquer conteúdo residual preexistente no corpo da tabela

        // Condicional: Verifica se o array de resposta do back-end não trouxe registros cadastrados
        if (produtos.length === 0) {
            // Insere uma linha centralizada cobrindo todas as colunas informando que o estoque está vazio
            tabela.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum produto em estoque.</td></tr>`;
            return;
        }

        // Loop de iteração: passa individualmente por cada objeto contido na lista de produtos obtida
        produtos.forEach(prod => {
            // Cria um elemento físico de linha de tabela (<tr>) isolado em memória
            const tr = document.createElement('tr');
            // Formata o conteúdo HTML inserindo dinamicamente as propriedades reais do produto nas colunas correspondentes
            tr.innerHTML = `
                <td>${prod.nome}</td>
                <td>${prod.categoria}</td>
                <td>${prod.quantidade}</td>
                <td>R$ ${parseFloat(prod.preco).toFixed(2)}</td>
                <td>
                    <button class="btn-editar" onclick="alert('Função editar ID: ${prod.id}')">Editar</button>
                    <button class="btn-excluir" onclick="deletarProduto(${prod.id})">Excluir</button>
                </td>
            `;
            // Acopla a linha configurada como um novo filho da tabela de exibição geral na interface
            tabela.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro capturado na renderização da listagem:", error);
        // Manipula o HTML exibindo um aviso textual vermelho caso a requisição web falhe por indisponibilidade do servidor
        tabela.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red; font-weight:bold;">Erro ao carregar dados do servidor.</td></tr>`;
    }
}

// ---- FUNÇÃO PARA EXCLUIR PRODUTO ----
async function deletarProduto(id) {
    // Exibe uma caixa de confirmação nativa do navegador (confirm browser prompt)
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        try {
            // Envia uma requisição com o método apropriado DELETE para a URL parametrizada com o ID único
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            // Se o servidor efetivar a exclusão e retornar status ok
            if (response.ok) {
                carregarProdutos(); // Re-invoca a função de listagem para redesenhar a tabela atualizada na tela
            } else {
                alert("Erro ao excluir produto."); // Emite um alerta nativo caso o servidor recuse o comando
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
    
    msgDiv.innerText = texto; // Modifica o texto interno do container da mensagem
    msgDiv.className = `mensagem ${tipo}`; // Atribui classes CSS correspondentes para mudar a cor baseada no tipo (sucesso/erro)
    
    // Configura um temporizador (timeout) para ocultar automaticamente o elemento de texto após 3 segundos (3000ms)
    setTimeout(() => {
        msgDiv.innerText = '';
        msgDiv.className = '';
    }, 3000);
}