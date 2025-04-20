import React from 'react';
import { useInventario } from '../context/InventarioContext';
import { Package, DollarSign, AlertTriangle, BarChart4 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { produtos, totalProdutos, valorTotalEstoque, produtosBaixoEstoque } = useInventario();

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full mr-3 sm:mr-4">
              <Package className="text-blue-700 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Total de Produtos</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-800">{totalProdutos()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 border-l-4 border-green-500 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 rounded-full mr-3 sm:mr-4">
              <DollarSign className="text-green-700 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">Valor Total</p>
              <p className="text-xl sm:text-2xl font-bold text-green-800">{formatarMoeda(valorTotalEstoque())}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg p-3 sm:p-4 border-l-4 border-amber-500 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-amber-100 rounded-full mr-3 sm:mr-4">
              <AlertTriangle className="text-amber-700 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600">Baixo Estoque</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-800">{produtosBaixoEstoque().length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border-l-4 border-purple-500 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full mr-3 sm:mr-4">
              <BarChart4 className="text-purple-700 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600">Categorias</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-800">
                {produtos.reduce((categorias, produto) => {
                  if (!categorias.includes(produto.categoria)) {
                    categorias.push(produto.categoria);
                  }
                  return categorias;
                }, [] as string[]).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {produtosBaixoEstoque().length > 0 && (
        <div className="mt-4 sm:mt-6">
          <h3 className="text-lg font-semibold text-red-700 flex items-center mb-3">
            <AlertTriangle size={20} className="mr-2" />
            Produtos com Estoque Baixo
          </h3>
          <div className="overflow-x-auto -mx-3 sm:-mx-6">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {produtosBaixoEstoque().map(produto => (
                      <tr key={produto.id} className="hover:bg-red-50 transition-colors">
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900 whitespace-nowrap">{produto.codigo}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-900">{produto.nome}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-red-600">{produto.quantidade}</td>
                        <td className="px-3 py-2 sm:px-4 sm:py-3 text-sm text-gray-600">{produto.estoqueMinimo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;