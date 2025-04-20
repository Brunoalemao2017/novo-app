import React, { createContext, useContext, useEffect, useState } from 'react';
import { Produto, EstadoEstoque } from '../types';

interface ContextoInventario {
  produtos: Produto[];
  categorias: string[];
  adicionarProduto: (produto: Omit<Produto, 'id' | 'dataCadastro'>) => void;
  atualizarProduto: (produto: Produto) => void;
  excluirProduto: (id: string) => void;
  obterProduto: (id: string) => Produto | undefined;
  filtrarPorCategoria: (categoria: string) => Produto[];
  buscarProdutos: (termo: string) => Produto[];
  produtosBaixoEstoque: () => Produto[];
  totalProdutos: () => number;
  valorTotalEstoque: () => number;
  adicionarCategoria: (categoria: string) => void;
  removerCategoria: (categoria: string) => void;
}

const InventarioContext = createContext<ContextoInventario | undefined>(undefined);

const CHAVE_ARMAZENAMENTO = 'estoque_app_dados';

const dadosIniciais: EstadoEstoque = {
  produtos: [
    {
      id: '1',
      nome: 'Notebook Dell Inspiron',
      categoria: 'Eletrônicos',
      preco: 3599.99,
      quantidade: 15,
      descricao: 'Notebook Dell Inspiron 15 i7 16GB RAM 512GB SSD',
      codigo: 'NB-DELL-001',
      estoqueMinimo: 5,
      unidade: 'un',
      dataCadastro: new Date().toISOString(),
      fornecedor: 'Dell Computadores'
    },
    {
      id: '2',
      nome: 'Monitor LCD 24"',
      categoria: 'Eletrônicos',
      preco: 899.90,
      quantidade: 8,
      descricao: 'Monitor LCD 24 polegadas Full HD 75Hz',
      codigo: 'MON-LCD-001',
      estoqueMinimo: 3,
      unidade: 'un',
      dataCadastro: new Date().toISOString(),
      fornecedor: 'LG Eletrônicos'
    },
    {
      id: '3',
      nome: 'Mesa de Escritório',
      categoria: 'Móveis',
      preco: 450.00,
      quantidade: 5,
      descricao: 'Mesa de escritório em MDF 120x60cm',
      codigo: 'MOV-MESA-001',
      estoqueMinimo: 2,
      unidade: 'un',
      dataCadastro: new Date().toISOString(),
      fornecedor: 'Móveis Corporativos'
    },
    {
      id: '4',
      nome: 'Cadeira Ergonômica',
      categoria: 'Móveis',
      preco: 699.90,
      quantidade: 10,
      descricao: 'Cadeira ergonômica com apoio lombar e ajuste de altura',
      codigo: 'MOV-CAD-001',
      estoqueMinimo: 4,
      unidade: 'un',
      dataCadastro: new Date().toISOString(),
      fornecedor: 'Móveis Corporativos'
    },
    {
      id: '5',
      nome: 'Papel A4',
      categoria: 'Papelaria',
      preco: 19.90,
      quantidade: 50,
      descricao: 'Pacote com 500 folhas de papel A4 75g/m²',
      codigo: 'PAP-A4-001',
      estoqueMinimo: 20,
      unidade: 'pct',
      dataCadastro: new Date().toISOString(),
      fornecedor: 'Distribuidora de Papéis'
    }
  ],
  categorias: ['Todas', 'Eletrônicos', 'Móveis', 'Papelaria']
};

export const InventarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estado, setEstado] = useState<EstadoEstoque>(() => {
    const dadosSalvos = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    return dadosSalvos ? JSON.parse(dadosSalvos) : dadosIniciais;
  });

  useEffect(() => {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(estado));
  }, [estado]);

  const adicionarProduto = (produto: Omit<Produto, 'id' | 'dataCadastro'>) => {
    const novoProduto: Produto = {
      ...produto,
      id: Date.now().toString(),
      dataCadastro: new Date().toISOString()
    };

    const novoEstado = {
      ...estado,
      produtos: [...estado.produtos, novoProduto],
      categorias: estado.categorias.includes(produto.categoria)
        ? estado.categorias
        : [...estado.categorias, produto.categoria]
    };

    setEstado(novoEstado);
  };

  const atualizarProduto = (produto: Produto) => {
    const novoEstado = {
      ...estado,
      produtos: estado.produtos.map(p => (p.id === produto.id ? produto : p)),
      categorias: estado.categorias.includes(produto.categoria)
        ? estado.categorias
        : [...estado.categorias, produto.categoria]
    };

    setEstado(novoEstado);
  };

  const excluirProduto = (id: string) => {
    setEstado({
      ...estado,
      produtos: estado.produtos.filter(p => p.id !== id)
    });
  };

  const obterProduto = (id: string) => {
    return estado.produtos.find(p => p.id === id);
  };

  const filtrarPorCategoria = (categoria: string) => {
    if (categoria === 'Todas') return estado.produtos;
    return estado.produtos.filter(p => p.categoria === categoria);
  };

  const buscarProdutos = (termo: string) => {
    const termoBusca = termo.toLowerCase();
    return estado.produtos.filter(
      p =>
        p.nome.toLowerCase().includes(termoBusca) ||
        p.codigo.toLowerCase().includes(termoBusca) ||
        p.descricao.toLowerCase().includes(termoBusca)
    );
  };

  const produtosBaixoEstoque = () => {
    return estado.produtos.filter(p => p.quantidade <= p.estoqueMinimo);
  };

  const totalProdutos = () => {
    return estado.produtos.length;
  };

  const valorTotalEstoque = () => {
    return estado.produtos.reduce((total, produto) => {
      return total + produto.preco * produto.quantidade;
    }, 0);
  };

  const adicionarCategoria = (categoria: string) => {
    if (!estado.categorias.includes(categoria)) {
      setEstado({
        ...estado,
        categorias: [...estado.categorias, categoria]
      });
    }
  };

  const removerCategoria = (categoria: string) => {
    if (categoria === 'Todas') return;

    const produtosNaCategoria = estado.produtos.some(p => p.categoria === categoria);
    if (produtosNaCategoria) {
      alert('Não é possível remover uma categoria que possui produtos cadastrados');
      return;
    }

    setEstado({
      ...estado,
      categorias: estado.categorias.filter(c => c !== categoria)
    });
  };

  return (
    <InventarioContext.Provider
      value={{
        produtos: estado.produtos,
        categorias: estado.categorias,
        adicionarProduto,
        atualizarProduto,
        excluirProduto,
        obterProduto,
        filtrarPorCategoria,
        buscarProdutos,
        produtosBaixoEstoque,
        totalProdutos,
        valorTotalEstoque,
        adicionarCategoria,
        removerCategoria
      }}
    >
      {children}
    </InventarioContext.Provider>
  );
};

export const useInventario = (): ContextoInventario => {
  const context = useContext(InventarioContext);
  if (!context) {
    throw new Error('useInventario deve ser usado dentro de um InventarioProvider');
  }
  return context;
};