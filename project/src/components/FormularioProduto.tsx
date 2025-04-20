import React, { useState, useEffect } from 'react';
import { useInventario } from '../context/InventarioContext';
import { Save, X, ArrowLeft } from 'lucide-react';

interface FormularioProdutoProps {
  idProduto?: string;
  onCancelar: () => void;
}

const FormularioProduto: React.FC<FormularioProdutoProps> = ({ idProduto, onCancelar }) => {
  const { adicionarProduto, atualizarProduto, obterProduto, categorias } = useInventario();
  
  const produtoVazio = {
    nome: '',
    categoria: '',
    preco: 0,
    quantidade: 0,
    descricao: '',
    codigo: '',
    estoqueMinimo: 0,
    unidade: 'un',
    fornecedor: ''
  };
  
  const [formData, setFormData] = useState(produtoVazio);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [adicionandoCategoria, setAdicionandoCategoria] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState<{texto: string, tipo: 'sucesso' | 'erro'} | null>(null);
  
  const modoEdicao = !!idProduto;
  
  useEffect(() => {
    if (idProduto) {
      const produto = obterProduto(idProduto);
      if (produto) {
        setFormData({
          nome: produto.nome,
          categoria: produto.categoria,
          preco: produto.preco,
          quantidade: produto.quantidade,
          descricao: produto.descricao,
          codigo: produto.codigo,
          estoqueMinimo: produto.estoqueMinimo,
          unidade: produto.unidade,
          fornecedor: produto.fornecedor
        });
      }
    }
  }, [idProduto, obterProduto]);
  
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome do produto é obrigatório';
    }
    
    if (!formData.categoria) {
      novosErros.categoria = 'Categoria é obrigatória';
    }
    
    if (formData.preco <= 0) {
      novosErros.preco = 'Preço deve ser maior que zero';
    }
    
    if (formData.quantidade < 0) {
      novosErros.quantidade = 'Quantidade não pode ser negativa';
    }
    
    if (!formData.codigo.trim()) {
      novosErros.codigo = 'Código do produto é obrigatório';
    }
    
    if (formData.estoqueMinimo < 0) {
      novosErros.estoqueMinimo = 'Estoque mínimo não pode ser negativo';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    try {
      if (modoEdicao && idProduto) {
        atualizarProduto({
          ...formData,
          id: idProduto,
          dataCadastro: obterProduto(idProduto)?.dataCadastro || new Date().toISOString()
        });
        setMensagem({
          texto: 'Produto atualizado com sucesso!',
          tipo: 'sucesso'
        });
      } else {
        adicionarProduto(formData);
        setFormData(produtoVazio);
        setMensagem({
          texto: 'Produto adicionado com sucesso!',
          tipo: 'sucesso'
        });
      }
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => {
        setMensagem(null);
        if (!modoEdicao) {
          onCancelar();
        }
      }, 3000);
    } catch (erro) {
      setMensagem({
        texto: 'Erro ao salvar produto. Tente novamente.',
        tipo: 'erro'
      });
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' || name === 'quantidade' || name === 'estoqueMinimo'
        ? parseFloat(value) || 0
        : value
    }));
    
    // Limpar erro do campo quando o usuário digitar
    if (erros[name]) {
      setErros(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const adicionarNovaCategoria = () => {
    if (novaCategoria.trim()) {
      setFormData(prev => ({
        ...prev,
        categoria: novaCategoria.trim()
      }));
      setNovaCategoria('');
      setAdicionandoCategoria(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onCancelar}
          className="mr-3 p-1 rounded-full hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          {modoEdicao ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </h2>
      </div>
      
      {mensagem && (
        <div className={`mb-4 p-3 rounded-lg ${
          mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensagem.texto}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Produto*
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                erros.nome ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {erros.nome && <p className="mt-1 text-sm text-red-600">{erros.nome}</p>}
          </div>
          
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-gray-700 mb-1">
              Código do Produto*
            </label>
            <input
              type="text"
              id="codigo"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                erros.codigo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {erros.codigo && <p className="mt-1 text-sm text-red-600">{erros.codigo}</p>}
          </div>
          
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria*
            </label>
            {adicionandoCategoria ? (
              <div className="flex">
                <input
                  type="text"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nova categoria"
                />
                <button
                  type="button"
                  onClick={adicionarNovaCategoria}
                  className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setAdicionandoCategoria(false)}
                  className="ml-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex">
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    erros.categoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.filter(cat => cat !== 'Todas').map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAdicionandoCategoria(true)}
                  className="ml-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Nova
                </button>
              </div>
            )}
            {erros.categoria && <p className="mt-1 text-sm text-red-600">{erros.categoria}</p>}
          </div>
          
          <div>
            <label htmlFor="fornecedor" className="block text-sm font-medium text-gray-700 mb-1">
              Fornecedor
            </label>
            <input
              type="text"
              id="fornecedor"
              name="fornecedor"
              value={formData.fornecedor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)*
            </label>
            <input
              type="number"
              id="preco"
              name="preco"
              value={formData.preco}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                erros.preco ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {erros.preco && <p className="mt-1 text-sm text-red-600">{erros.preco}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade*
              </label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  erros.quantidade ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {erros.quantidade && <p className="mt-1 text-sm text-red-600">{erros.quantidade}</p>}
            </div>
            
            <div>
              <label htmlFor="unidade" className="block text-sm font-medium text-gray-700 mb-1">
                Unidade
              </label>
              <select
                id="unidade"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="un">Unidade (un)</option>
                <option value="cx">Caixa (cx)</option>
                <option value="kg">Quilograma (kg)</option>
                <option value="g">Grama (g)</option>
                <option value="l">Litro (l)</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="m">Metro (m)</option>
                <option value="pct">Pacote (pct)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="estoqueMinimo" className="block text-sm font-medium text-gray-700 mb-1">
              Estoque Mínimo
            </label>
            <input
              type="number"
              id="estoqueMinimo"
              name="estoqueMinimo"
              value={formData.estoqueMinimo}
              onChange={handleChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                erros.estoqueMinimo ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {erros.estoqueMinimo && <p className="mt-1 text-sm text-red-600">{erros.estoqueMinimo}</p>}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do Produto
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancelar}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save size={18} className="mr-2" />
            {modoEdicao ? 'Atualizar Produto' : 'Salvar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioProduto;