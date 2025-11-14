import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productosAPI } from '../services/api';
import { Producto } from '../types';
import { useCarrito } from '../context/CarritoContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    if (id) {
      cargarProducto();
    }
  }, [id]);

  const cargarProducto = async () => {
    try {
      const response = await productosAPI.obtenerPorId(id!);
      setProducto(response.data);
      if (response.data.tallas.length > 0) setTallaSeleccionada(response.data.tallas[0]);
      if (response.data.colores.length > 0) setColorSeleccionado(response.data.colores[0]);
    } catch (error) {
      console.error('Error al cargar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = () => {
    if (!producto || !tallaSeleccionada || !colorSeleccionado) {
      alert('Por favor selecciona talla y color');
      return;
    }

    agregarAlCarrito(producto, cantidad, tallaSeleccionada, colorSeleccionado);
    alert('Producto agregado al carrito');
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (!producto) return <div className="error">Producto no encontrado</div>;

  const imagenPrincipal = producto.imagenes[imagenActual] || 'https://via.placeholder.com/500';

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn-back">
          Volver
        </button>

        <div className="product-detail">
          <div className="product-images">
            <img src={imagenPrincipal} alt={producto.nombre} className="main-image" />
            <div className="thumbnail-images">
              {producto.imagenes.map((imagen, index) => (
                <img
                  key={index}
                  src={imagen}
                  alt={`${producto.nombre} ${index + 1}`}
                  className={imagenActual === index ? 'active' : ''}
                  onClick={() => setImagenActual(index)}
                />
              ))}
            </div>
          </div>

          <div className="product-info-detail">
            <h1>{producto.nombre}</h1>
            <p className="product-category">{producto.categoria}</p>
            <p className="product-price">${producto.precio.toFixed(2)}</p>
            <p className="product-description">{producto.descripcion}</p>

            <div className="product-options">
              <div className="option-group">
                <label>Talla:</label>
                <select
                  value={tallaSeleccionada}
                  onChange={(e) => setTallaSeleccionada(e.target.value)}
                >
                  {producto.tallas.map((talla) => (
                    <option key={talla} value={talla}>
                      {talla}
                    </option>
                  ))}
                </select>
              </div>

              <div className="option-group">
                <label>Color:</label>
                <select
                  value={colorSeleccionado}
                  onChange={(e) => setColorSeleccionado(e.target.value)}
                >
                  {producto.colores.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="option-group">
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  max={producto.stock}
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                />
              </div>
            </div>

            <p className="stock-info">
              {producto.stock > 0
                ? `${producto.stock} unidades disponibles`
                : 'Producto agotado'}
            </p>

            <button
              onClick={handleAgregarAlCarrito}
              disabled={producto.stock === 0}
              className="btn-primary btn-large"
            >
              {producto.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
