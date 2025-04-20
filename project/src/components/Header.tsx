import React, { useState } from 'react';
import { Menu, Package, Search, X } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  pagina: string;
  setPagina: (pagina: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, pagina, setPagina }) => {
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  const toggleMenuMobile = () => {
    setMenuMobileAberto(!menuMobileAberto);
  };

  const navegarPara = (novaPagina: string) => {
    setPagina(novaPagina);
    setMenuMobileAberto(false);
  };

  return (
    <header className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="mr-2 p-1 rounded-md hover:bg-blue-700 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center">
              <Package size={28} className="mr-2" />
              <h1 className="text-xl font-bold">EstoquePro</h1>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex space-x-6">
            <button 
              onClick={() => setPagina('dashboard')} 
              className={`py-2 px-3 rounded transition-colors ${
                pagina === 'dashboard' ? 'bg-blue-700 text-white' : 'hover:bg-blue-700 hover:text-white'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setPagina('produtos')} 
              className={`py-2 px-3 rounded transition-colors ${
                pagina === 'produtos' ? 'bg-blue-700 text-white' : 'hover:bg-blue-700 hover:text-white'
              }`}
            >
              Produtos
            </button>
            <button 
              onClick={() => setPagina('adicionar')} 
              className={`py-2 px-3 rounded transition-colors ${
                pagina === 'adicionar' ? 'bg-blue-700 text-white' : 'hover:bg-blue-700 hover:text-white'
              }`}
            >
              Adicionar Produto
            </button>
          </nav>

          {/* Menu Mobile Toggle */}
          <button
            onClick={toggleMenuMobile}
            className="p-2 rounded-md hover:bg-blue-700 lg:hidden"
          >
            {menuMobileAberto ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Menu Mobile */}
        {menuMobileAberto && (
          <div className="lg:hidden py-3 pb-4 border-t border-blue-700">
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => navegarPara('dashboard')} 
                className={`py-2 px-3 rounded text-left transition-colors ${
                  pagina === 'dashboard' ? 'bg-blue-700 text-white' : 'hover:bg-blue-700 hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => navegarPara('produtos')} 
                className={`py-2 px-3 rounded text-left transition-colors ${
                  pagina === 'produtos' ? 'bg-blue-700 text-white' : 'hover:bg-blue-700 hover:text-white'
                }`}
              >
                Produtos
              </button>
              <button 
                onClick={() => navegarPara('adicionar')} 
                className={`py-2 px-3 rounded text-left transition-colors ${
                  pagina === 'adicionar' ? 'bg-blue-700 text-white' : 'hover:bg-blue-700 hover:text-white'
                }`}
              >
                Adicionar Produto
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;