import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { pedidosAPI } from '../services/api';

const Checkout: React.FC = () => {
  const { items, totalPrecio, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState({
    calle: '',
    ciudad: '',
    codigoPostal: '',
    pais: ''
  });
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pedidoData = {
        items: items.map((item) => ({
          producto: item.producto._id,
          cantidad: item.cantidad,
          talla: item.talla,
          color: item.color,
          precio: item.precio
        })),
        total: totalPrecio,
        direccionEnvio: direccion,
        metodoPago
      };

      const response = await pedidosAPI.crear(pedidoData);
      vaciarCarrito();
      alert('Pedido realizado exitosamente');
      navigate(`/perfil`);
    } catch (error: any) {
      console.error('Error al crear pedido:', error);
      alert('Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/carrito');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Finalizar Compra</h1>

        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <section className="form-section">
              <h2>Dirección de Envío</h2>
              <div className="form-group">
                <label>Calle:</label>
                <input
                  type="text"
                  required
                  value={direccion.calle}
                  onChange={(e) => setDireccion({ ...direccion, calle: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ciudad:</label>
                  <input
                    type="text"
                    required
                    value={direccion.ciudad}
                    onChange={(e) => setDireccion({ ...direccion, ciudad: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Código Postal:</label>
                  <input
                    type="text"
                    required
                    value={direccion.codigoPostal}
                    onChange={(e) =>
                      setDireccion({ ...direccion, codigoPostal: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label>País:</label>
                <input
                  type="text"
                  required
                  value={direccion.pais}
                  onChange={(e) => setDireccion({ ...direccion, pais: e.target.value })}
                />
              </div>
            </section>

            <section className="form-section">
              <h2>Método de Pago</h2>
              <div className="payment-methods">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="tarjeta"
                    checked={metodoPago === 'tarjeta'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  Tarjeta de Crédito/Débito
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="paypal"
                    checked={metodoPago === 'paypal'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  PayPal
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    value="transferencia"
                    checked={metodoPago === 'transferencia'}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  Transferencia Bancaria
                </label>
              </div>
            </section>

            <button type="submit" disabled={loading} className="btn-primary btn-large">
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>

          <div className="order-summary">
            <h2>Resumen del Pedido</h2>
            {items.map((item, index) => (
              <div key={index} className="summary-item">
                <span>
                  {item.producto.nombre} x{item.cantidad}
                </span>
                <span>${(item.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-total">
              <span>Total:</span>
              <span>${totalPrecio.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
