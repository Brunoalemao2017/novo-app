import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Header from './Header';
import BarraLateral from './BarraLateral';
import Dashboard from './Dashboard';
import ListaProdutos from './ListaProdutos';
import FormularioProduto from './FormularioProduto';
import Configuracoes from './Configuracoes';
import CadastroUsuario from './CadastroUsuario';

const MainApp: React.FC = () => {
  const [menuLateralAberto, setMenuLateralAberto] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState('dashboard');
  const [produtoParaEditar, setProdutoParaEditar] = useState<string | undefined>(undefined);

  const toggleMenuLateral = () => {
    setMenuLateralAberto(!menuLateralAberto);
  };

  const mostrarPaginaProdutos = () => {
    setPaginaAtual('produtos');
    setProdutoParaEditar(undefined);
  };

  const editarProduto = (id: string) => {
    setProdutoParaEditar(id);
    setPaginaAtual('editar');
  };

  const cancelarEdicao = () => {
    setProdutoParaEditar(undefined);
    setPaginaAtual('produtos');
  };

  const mostrarConteudo = () => {
    switch (paginaAtual) {
      case 'dashboard':
        return <Dashboard />;
      case 'produtos':
        return <ListaProdutos onEditar={editarProduto} />;
      case 'adicionar':
        return <FormularioProduto onCancelar={mostrarPaginaProdutos} />;
      case 'editar':
        return <FormularioProduto idProduto={produtoParaEditar} onCancelar={cancelarEdicao} />;
      case 'configuracoes':
        return <Configuracoes />;
      case 'cadastro-usuario':
        return <CadastroUsuario />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 flex items-center px-4">
        <button
          onClick={toggleMenuLateral}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">EstoquePro</h1>
      </header>

      {/* Overlay para quando o menu estiver aberto */}
      {menuLateralAberto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMenuLateral}
        />
      )}

      {/* Barra lateral */}
      <BarraLateral
        visivel={menuLateralAberto}
        pagina={paginaAtual}
        setPagina={(novaPagina) => {
          setPaginaAtual(novaPagina);
          setMenuLateralAberto(false);
        }}
      />

      {/* Conteúdo principal */}
      <main className="pt-16">
        <div className="p-4">
          {mostrarConteudo()}
        </div>
      </main>
    </div>
  );
};

export default MainApp;