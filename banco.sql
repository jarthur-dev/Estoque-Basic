-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS sistema_produtos;

-- Seleção do Banco de Dados para uso
USE sistema_produtos;

-- Criação da Tabela de Produtos com todos os campos necessários
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    descricao TEXT,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção dos 5 dados de teste oficiais com as descrições completas
INSERT INTO produtos (nome, categoria, quantidade, preco, descricao) VALUES 
('Iphone 12 Pro Max', 'Eletrônicos', 5, 3000.00, 'Smartphone Apple com tela Super Retina XDR de 6.7 polegadas, conexão 5G, conjunto de câmera tripla de 12MP e armazenamento interno de 256GB na cor Grafite.'),
('Carimbo', 'Escritório', 10, 50.00, 'Carimbo automático autoentintado modelo padrão para uso corporativo e administrativo. Estrutura resistente com espaço para personalização de texto.'),
('Teclado Mecânico', 'Informática', 7, 154.99, 'Teclado mecânico gamer com iluminação LED RGB customizável, switches azuis táteis com som de clique audível e layout padrão ABNT2 com teclas anti-ghosting.'),
('Cadeira Gamer', 'Outros', 3, 980.00, 'Cadeira gamer ergonômica com estofamento de alta densidade, revestimento em couro sintético preto e azul, braços reguláveis, inclinação de até 135 graus e suporte lombar.'),
('Airpods', 'Eletrônicos', 20, 2108.05, 'Fones de ouvido sem fio Apple AirPods com conexão Bluetooth estável, ativação automática, sensor de voz, cancelamento básico de ruído e estojo de recarga portátil.');
