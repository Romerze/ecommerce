import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, usuario, logout } = useAuth();
  const { totalItems } = useCarrito();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          TiendaRopa
        </Link>

        <div className="nav-links">
          <Link to="/productos">Productos</Link>
          <Link to="/productos?categoria=hombre">Hombre</Link>
          <Link to="/productos?categoria=mujer">Mujer</Link>
          <Link to="/productos?categoria=niños">Niños</Link>
          <Link to="/productos?categoria=accesorios">Accesorios</Link>
        </div>

        <div className="nav-actions">
          <Link to="/carrito" className="cart-link">
            <FaShoppingCart />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/perfil" className="user-link">
                <FaUser /> {usuario?.nombre}
              </Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button onClick={logout} className="btn-logout">
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-link">Iniciar Sesión</Link>
              <Link to="/registro" className="btn-primary">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
