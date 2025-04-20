import React, { useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { Package, Eye, EyeOff } from 'lucide-react';

const CadastroUsuario: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cargo: 'usuario' as const
  });
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  
  const { adicionarUsuario, obterUsuarioPorEmail } = useUserStore();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErro('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    
    if (!formData.nome.trim()) {
      setErro('Nome é obrigatório');
      return;
    }
    
    if (!formData.email.trim()) {
      setErro('Email é obrigatório');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setErro('Email inválido');
      return;
    }
    
    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }
    
    // Verificar se o email já está cadastrado
    if (obterUsuarioPorEmail(formData.email)) {
      setErro('Este email já está cadastrado');
      return;
    }
    
    try {
      // Adicionar o novo usuário
      adicionarUsuario({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        cargo: formData.cargo
      });
      
      setSucesso('Usuário cadastrado com sucesso!');
      
      // Limpar formulário
      setFormData({
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        cargo: 'usuario'
      });
    } catch (error) {
      setErro('Erro ao cadastrar usuário. Tente novamente.');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Package className="h-8 w-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-semibold text-gray-800">Cadastro de Usuário</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {erro}
          </div>
        )}
        
        {sucesso && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {sucesso}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo*
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite seu nome completo"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
              Senha*
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha*
            </label>
            <div className="relative">
              <input
                type={mostrarConfirmarSenha ? 'text' : 'password'}
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
              Cargo
            </label>
            <select
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="usuario">Usuário</option>
              <option value="admin">Administrador</option>
              <option value="gerente">Gerente</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cadastrar Usuário
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadastroUsuario;