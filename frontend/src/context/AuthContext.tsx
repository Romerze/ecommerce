import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import { AuthContextType, Usuario } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      cargarUsuario();
    }
  }, [token]);

  const cargarUsuario = async () => {
    try {
      const response = await authAPI.obtenerPerfil();
      setUsuario(response.data);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    const { token, usuario } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUsuario(usuario);
  };

  const registrar = async (datos: any) => {
    const response = await authAPI.registrar(datos);
    const { token, usuario } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUsuario(usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  const value: AuthContextType = {
    usuario,
    token,
    login,
    registrar,
    logout,
    isAuthenticated: !!token && !!usuario,
    isAdmin: usuario?.rol === 'admin'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
