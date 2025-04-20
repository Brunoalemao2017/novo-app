import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  cargo: 'usuario' | 'admin' | 'gerente';
}

interface UserState {
  usuarios: Usuario[];
  adicionarUsuario: (usuario: Omit<Usuario, 'id'>) => void;
  obterUsuarioPorEmail: (email: string) => Usuario | undefined;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      usuarios: [
        {
          id: '1',
          nome: 'Administrador',
          email: 'admin@exemplo.com',
          senha: 'admin123',
          cargo: 'admin'
        }
      ],
      adicionarUsuario: (usuario) => {
        const novoUsuario: Usuario = {
          ...usuario,
          id: Date.now().toString()
        };
        set((state) => ({
          usuarios: [...state.usuarios, novoUsuario]
        }));
      },
      obterUsuarioPorEmail: (email) => {
        return get().usuarios.find(u => u.email === email);
      }
    }),
    {
      name: 'user-storage'
    }
  )
); 