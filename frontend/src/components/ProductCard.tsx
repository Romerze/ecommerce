import React from 'react';
import { Link } from 'react-router-dom';
import { Producto } from '../types';

interface ProductCardProps {
  producto: Producto;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto }) => {
  const imagenPrincipal = producto.imagenes[0] || 'https://via.placeholder.com/300';

  return (
    <div className="product-card">
      <Link to={`/producto/${producto._id}`}>
        <div className="product-image">
          <img src={imagenPrincipal} alt={producto.nombre} />
          {producto.destacado && <span className="badge-destacado">Destacado</span>}
        </div>
        <div className="product-info">
          <h3 className="product-name">{producto.nombre}</h3>
          <p className="product-category">{producto.categoria}</p>
          <p className="product-price">${producto.precio.toFixed(2)}</p>
          {producto.stock === 0 && <span className="badge-agotado">Agotado</span>}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
