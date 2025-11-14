import React from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { ItemCarrito } from '../types';
import { useCarrito } from '../context/CarritoContext';

interface CartItemProps {
  item: ItemCarrito;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { actualizarCantidad, eliminarDelCarrito } = useCarrito();
  const imagenPrincipal = item.producto.imagenes[0] || 'https://via.placeholder.com/100';

  const handleIncrement = () => {
    actualizarCantidad(item.producto._id, item.talla, item.color, item.cantidad + 1);
  };

  const handleDecrement = () => {
    if (item.cantidad > 1) {
      actualizarCantidad(item.producto._id, item.talla, item.color, item.cantidad - 1);
    }
  };

  const handleRemove = () => {
    eliminarDelCarrito(item.producto._id, item.talla, item.color);
  };

  const subtotal = item.precio * item.cantidad;

  return (
    <div className="cart-item">
      <img src={imagenPrincipal} alt={item.producto.nombre} className="cart-item-image" />

      <div className="cart-item-info">
        <h3>{item.producto.nombre}</h3>
        <p>Talla: {item.talla} | Color: {item.color}</p>
        <p className="cart-item-price">${item.precio.toFixed(2)}</p>
      </div>

      <div className="cart-item-quantity">
        <button onClick={handleDecrement} className="btn-quantity">
          <FaMinus />
        </button>
        <span>{item.cantidad}</span>
        <button onClick={handleIncrement} className="btn-quantity">
          <FaPlus />
        </button>
      </div>

      <div className="cart-item-subtotal">
        <p>${subtotal.toFixed(2)}</p>
        <button onClick={handleRemove} className="btn-remove">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
