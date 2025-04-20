import React, { useState } from 'react';
import { Package, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  
  const { login } = useAuthStore();
  const { adicionarUsuario, obterUsuarioPorEmail } = useUserStore();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cargo: 'usuario' as const
  });

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

    if (isLogin) {
      // Login
      if (!formData.email || !formData.senha) {
        setErro('Por favor, preencha todos os campos');
        return;
      }

      const usuario = obterUsuarioPorEmail(formData.email);
      if (usuario && usuario.senha === formData.senha) {
        login();
      } else {
        setErro('Email ou senha inválidos');
      }
    } else {
      // Cadastro
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

        setSucesso('Cadastro realizado com sucesso! Você já pode fazer login.');
        setIsLogin(true);
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">EstoquePro</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Controle de Estoque
          </p>
        </div>

        <div className="flex justify-center space-x-4 border-b border-gray-200">
          <button
            className={`pb-2 px-4 ${isLogin ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`pb-2 px-4 ${!isLogin ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setIsLogin(false)}
          >
            Cadastro
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite seu nome completo"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
                >
                  {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type={mostrarConfirmarSenha ? 'text' : 'password'}
                      value={formData.confirmarSenha}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                      className="absolute right-2 top-3 text-gray-500 hover:text-gray-700"
                    >
                      {mostrarConfirmarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">
                    Cargo
                  </label>
                  <select
                    id="cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="usuario">Usuário</option>
                    <option value="admin">Administrador</option>
                    <option value="gerente">Gerente</option>
                  </select>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;