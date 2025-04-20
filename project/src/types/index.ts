export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  quantidade: number;
  descricao: string;
  codigo: string;
  estoqueMinimo: number;
  unidade: string;
  dataCadastro: string;
  fornecedor: string;
}

export interface EstadoEstoque {
  produtos: Produto[];
  categorias: string[];
}