import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productosAPI } from '../services/api';
import { Producto } from '../types';
import ProductCard from '../components/ProductCard';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const categoria = searchParams.get('categoria') || '';
  const busqueda = searchParams.get('busqueda') || '';

  useEffect(() => {
    cargarProductos();
  }, [categoria, busqueda]);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (categoria) params.categoria = categoria;
      if (busqueda) params.busqueda = busqueda;

      const response = await productosAPI.obtenerTodos(params);
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategoria = e.target.value;
    if (newCategoria) {
      searchParams.set('categoria', newCategoria);
    } else {
      searchParams.delete('categoria');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Productos</h1>
          <div className="filters">
            <select value={categoria} onChange={handleCategoriaChange} className="filter-select">
              <option value="">Todas las categorías</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
              <option value="niños">Niños</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : productos.length === 0 ? (
          <div className="no-products">No se encontraron productos</div>
        ) : (
          <div className="productos-grid">
            {productos.map((producto) => (
              <ProductCard key={producto._id} producto={producto} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
