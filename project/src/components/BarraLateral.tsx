import React from 'react';
import { useInventario } from '../context/InventarioContext';
import { useAuthStore } from '../stores/authStore';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Settings,
  LogOut,
  UserPlus
} from 'lucide-react';

interface BarraLateralProps {
  visivel: boolean;
  pagina: string;
  setPagina: (pagina: string) => void;
}

const BarraLateral: React.FC<BarraLateralProps> = ({ 
  visivel, 
  pagina, 
  setPagina 
}) => {
  const { produtosBaixoEstoque } = useInventario();
  const { logout } = useAuthStore();
  const qtdBaixoEstoque = produtosBaixoEstoque().length;

  return (
    <aside className={`
      fixed top-0 left-0 z-40 h-screen w-64
      transition-transform duration-300 ease-in-out
      bg-white border-r border-gray-200 shadow-lg
      transform ${visivel ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-full px-3 py-20 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          <li>
            <button
              onClick={() => setPagina('dashboard')}
              className={`
                flex items-center w-full p-3 text-gray-700 rounded-lg
                ${pagina === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                transition-colors
              `}
            >
              <LayoutDashboard size={20} className="mr-3" />
              <span>Dashboard</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setPagina('produtos')}
              className={`
                flex items-center w-full p-3 text-gray-700 rounded-lg
                ${pagina === 'produtos' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                transition-colors
              `}
            >
              <Package size={20} className="mr-3" />
              <span>Produtos</span>
              {qtdBaixoEstoque > 0 && (
                <span className="ml-auto inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full">
                  {qtdBaixoEstoque}
                </span>
              )}
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setPagina('adicionar')}
              className={`
                flex items-center w-full p-3 text-gray-700 rounded-lg
                ${pagina === 'adicionar' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                transition-colors
              `}
            >
              <PlusCircle size={20} className="mr-3" />
              <span>Adicionar Produto</span>
            </button>
          </li>
          
          <li className="pt-5 mt-5 border-t border-gray-200">
            <span className="px-3 text-sm font-semibold text-gray-500">Sistema</span>
          </li>
          
          <li>
            <button
              onClick={() => setPagina('cadastro-usuario')}
              className={`
                flex items-center w-full p-3 text-gray-700 rounded-lg
                ${pagina === 'cadastro-usuario' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                transition-colors
              `}
            >
              <UserPlus size={20} className="mr-3" />
              <span>Cadastrar Usuário</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={() => setPagina('configuracoes')}
              className={`
                flex items-center w-full p-3 text-gray-700 rounded-lg
                ${pagina === 'configuracoes' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                transition-colors
              `}
            >
              <Settings size={20} className="mr-3" />
              <span>Configurações</span>
            </button>
          </li>
          
          <li>
            <button
              onClick={logout}
              className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Sair</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default BarraLateral;