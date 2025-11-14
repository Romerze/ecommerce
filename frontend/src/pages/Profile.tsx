import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { pedidosAPI } from '../services/api';
import { Pedido } from '../types';

const Profile: React.FC = () => {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const response = await pedidosAPI.obtenerMisPedidos();
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    const colores: any = {
      pendiente: '#ffa500',
      procesando: '#2196f3',
      enviado: '#9c27b0',
      entregado: '#4caf50',
      cancelado: '#f44336'
    };
    return colores[estado] || '#666';
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Mi Perfil</h1>

        <section className="profile-info">
          <h2>Información Personal</h2>
          <p>
            <strong>Nombre:</strong> {usuario?.nombre}
          </p>
          <p>
            <strong>Email:</strong> {usuario?.email}
          </p>
          {usuario?.direccion && (
            <p>
              <strong>Dirección:</strong> {usuario.direccion}
            </p>
          )}
          {usuario?.telefono && (
            <p>
              <strong>Teléfono:</strong> {usuario.telefono}
            </p>
          )}
        </section>

        <section className="pedidos-section">
          <h2>Mis Pedidos</h2>
          {loading ? (
            <div className="loading">Cargando pedidos...</div>
          ) : pedidos.length === 0 ? (
            <p>No tienes pedidos aún</p>
          ) : (
            <div className="pedidos-list">
              {pedidos.map((pedido) => (
                <div key={pedido._id} className="pedido-card">
                  <div className="pedido-header">
                    <h3>Pedido #{pedido._id.slice(-8)}</h3>
                    <span
                      className="estado-badge"
                      style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                    >
                      {pedido.estado}
                    </span>
                  </div>
                  <p>
                    <strong>Fecha:</strong>{' '}
                    {new Date(pedido.createdAt).toLocaleDateString('es-ES')}
                  </p>
                  <p>
                    <strong>Total:</strong> ${pedido.total.toFixed(2)}
                  </p>
                  <p>
                    <strong>Items:</strong> {pedido.items.length} producto(s)
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
