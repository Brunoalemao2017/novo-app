import React, { useState, useEffect } from 'react';
import { useInventario } from '../context/InventarioContext';
import { Search, Edit, Trash2, Filter } from 'lucide-react';

interface ListaProdutosProps {
  onEditar: (id: string) => void;
}

const ListaProdutos: React.FC<ListaProdutosProps> = ({ onEditar }) => {
  const { 
    produtos, 
    categorias, 
    excluirProduto, 
    filtrarPorCategoria, 
    buscarProdutos 
  } = useInventario();
  
  const [termoBusca, setTermoBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [produtosFiltrados, setProdutosFiltrados] = useState(produtos);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<string | null>(null);
  const [mostrarFiltrosMobile, setMostrarFiltrosMobile] = useState(false);

  useEffect(() => {
    let resultado = produtos;
    
    if (categoriaFiltro !== 'Todas') {
      resultado = filtrarPorCategoria(categoriaFiltro);
    }
    
    if (termoBusca) {
      resultado = buscarProdutos(termoBusca);
    }
    
    setProdutosFiltrados(resultado);
  }, [produtos, categoriaFiltro, termoBusca, filtrarPorCategoria, buscarProdutos]);

  const handleExcluir = (id: string) => {
    setProdutoParaExcluir(id);
  };

  const confirmarExclusao = () => {
    if (produtoParaExcluir) {
      excluirProduto(produtoParaExcluir);
      setProdutoParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setProdutoParaExcluir(null);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h2 className="text-xl font-semibold text-gray-800">Lista de Produtos</h2>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          
          <button
            onClick={() => setMostrarFiltrosMobile(!mostrarFiltrosMobile)}
            className="flex items-center justify-center p-2 border border-gray-300 rounded-lg sm:hidden"
          >
            <Filter size={20} className="text-gray-500" />
          </button>
          
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="hidden sm:block px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {mostrarFiltrosMobile && (
        <div className="sm:hidden mb-4 p-3 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Categoria
          </label>
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="overflow-x-auto -mx-3 sm:-mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtosFiltrados.length > 0 ? (
                  produtosFiltrados.map(produto => (
                    <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 whitespace-nowrap">{produto.codigo}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900">{produto.nome}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-500">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {produto.categoria}
                        </span>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 whitespace-nowrap">{formatarMoeda(produto.preco)}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap
                          ${produto.quantidade <= produto.estoqueMinimo 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'}
                        `}>
                          {produto.quantidade} {produto.unidade}
                        </span>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onEditar(produto.id)}
                            className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleExcluir(produto.id)}
                            className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 sm:px-4 text-center text-gray-500">
                      Nenhum produto encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal de Confirmação */}
      {produtoParaExcluir && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full animate-fade-in">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-500 mb-6">
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelarExclusao}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaProdutos;