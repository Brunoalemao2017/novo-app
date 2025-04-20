import React, { useState } from 'react';
import { Save, Plus, X } from 'lucide-react';
import { useInventario } from '../context/InventarioContext';

const Configuracoes: React.FC = () => {
  const { categorias, adicionarCategoria, removerCategoria } = useInventario();
  const [novaCategoria, setNovaCategoria] = useState('');
  const [erro, setErro] = useState('');
  const [configuracoes, setConfiguracoes] = useState({
    notificacoes: true,
    estoqueMinimo: 5,
    moeda: 'BRL',
    tema: 'claro'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setConfiguracoes(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode implementar a lógica para salvar as configurações
    alert('Configurações salvas com sucesso!');
  };

  const handleAdicionarCategoria = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!novaCategoria.trim()) {
      setErro('Digite o nome da categoria');
      return;
    }

    if (categorias.includes(novaCategoria.trim())) {
      setErro('Esta categoria já existe');
      return;
    }

    adicionarCategoria(novaCategoria.trim());
    setNovaCategoria('');
  };

  return (
    <div className="space-y-6">
      {/* Seção de Categorias */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Gerenciar Categorias</h2>
        
        <form onSubmit={handleAdicionarCategoria} className="mb-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                placeholder="Digite o nome da nova categoria"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {erro && <p className="mt-1 text-sm text-red-600">{erro}</p>}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus size={20} className="mr-1" />
              Adicionar
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {categorias.filter(cat => cat !== 'Todas').map((categoria) => (
            <div
              key={categoria}
              className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg"
            >
              <span>{categoria}</span>
              <button
                onClick={() => removerCategoria(categoria)}
                className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                title="Remover categoria"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Seção de Configurações Gerais */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Configurações Gerais</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="notificacoes"
                checked={configuracoes.notificacoes}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span>Ativar notificações de estoque baixo</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Alerta de estoque mínimo
            </label>
            <input
              type="number"
              name="estoqueMinimo"
              value={configuracoes.estoqueMinimo}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Moeda
            </label>
            <select
              name="moeda"
              value={configuracoes.moeda}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="BRL">Real (R$)</option>
              <option value="USD">Dólar (US$)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tema
            </label>
            <select
              name="tema"
              value={configuracoes.tema}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="claro">Claro</option>
              <option value="escuro">Escuro</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save size={20} className="mr-2" />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Configuracoes;