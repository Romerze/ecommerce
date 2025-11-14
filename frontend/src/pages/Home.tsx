import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productosAPI } from '../services/api';
import { Producto } from '../types';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const [productosDestacados, setProductosDestacados] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductosDestacados();
  }, []);

  const cargarProductosDestacados = async () => {
    try {
      const response = await productosAPI.obtenerTodos({ destacado: 'true' });
      setProductosDestacados(response.data.slice(0, 8));
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido a TiendaRopa</h1>
          <p>Descubre las últimas tendencias en moda</p>
          <Link to="/productos" className="btn-primary btn-large">
            Ver Catálogo
          </Link>
        </div>
      </section>

      <section className="categorias">
        <h2>Compra por Categoría</h2>
        <div className="categoria-grid">
          <Link to="/productos?categoria=hombre" className="categoria-card">
            <h3>Hombre</h3>
          </Link>
          <Link to="/productos?categoria=mujer" className="categoria-card">
            <h3>Mujer</h3>
          </Link>
          <Link to="/productos?categoria=niños" className="categoria-card">
            <h3>Niños</h3>
          </Link>
          <Link to="/productos?categoria=accesorios" className="categoria-card">
            <h3>Accesorios</h3>
          </Link>
        </div>
      </section>

      {!loading && productosDestacados.length > 0 && (
        <section className="productos-destacados">
          <h2>Productos Destacados</h2>
          <div className="productos-grid">
            {productosDestacados.map((producto) => (
              <ProductCard key={producto._id} producto={producto} />
            ))}
          </div>
        </section>
      )}

      {loading && <div className="loading">Cargando productos...</div>}
    </div>
  );
};

export default Home;
