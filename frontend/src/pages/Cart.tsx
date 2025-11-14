import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import CartItem from '../components/CartItem';

const Cart: React.FC = () => {
  const { items, totalPrecio, vaciarCarrito } = useCarrito();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Carrito de Compras</h1>
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
            <Link to="/productos" className="btn-primary">
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Carrito de Compras</h1>

        <div className="cart-content">
          <div className="cart-items">
            {items.map((item, index) => (
              <CartItem key={`${item.producto._id}-${item.talla}-${item.color}-${index}`} item={item} />
            ))}
          </div>

          <div className="cart-summary">
            <h2>Resumen del Pedido</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalPrecio.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${totalPrecio.toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="btn-primary btn-large">
              Proceder al Pago
            </button>

            <button onClick={vaciarCarrito} className="btn-secondary">
              Vaciar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
