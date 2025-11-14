import React, { useEffect, useState } from 'react';
import { productosAPI, pedidosAPI } from '../services/api';
import { Producto, Pedido } from '../types';

const Admin: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [activeTab, setActiveTab] = useState<'productos' | 'pedidos'>('productos');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: 'hombre' as 'hombre' | 'mujer' | 'niños' | 'accesorios',
    tallas: '',
    colores: '',
    imagenes: '',
    stock: 0,
    destacado: false
  });

  useEffect(() => {
    if (activeTab === 'productos') {
      cargarProductos();
    } else {
      cargarPedidos();
    }
  }, [activeTab]);

  const cargarProductos = async () => {
    try {
      const response = await productosAPI.obtenerTodos();
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const cargarPedidos = async () => {
    try {
      const response = await pedidosAPI.obtenerTodos();
      setPedidos(response.data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    }
  };

  const handleSubmitProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productoData = {
        ...formData,
        tallas: formData.tallas.split(',').map((t) => t.trim()),
        colores: formData.colores.split(',').map((c) => c.trim()),
        imagenes: formData.imagenes.split(',').map((i) => i.trim())
      };

      if (editingProduct) {
        await productosAPI.actualizar(editingProduct._id, productoData);
        alert('Producto actualizado');
      } else {
        await productosAPI.crear(productoData);
        alert('Producto creado');
      }

      resetForm();
      cargarProductos();
    } catch (error: any) {
      alert('Error: ' + (error.response?.data?.error || 'Error al guardar producto'));
    }
  };

  const handleEliminarProducto = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await productosAPI.eliminar(id);
      alert('Producto eliminado');
      cargarProductos();
    } catch (error) {
      alert('Error al eliminar producto');
    }
  };

  const handleEditarProducto = (producto: Producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
      tallas: producto.tallas.join(', '),
      colores: producto.colores.join(', '),
      imagenes: producto.imagenes.join(', '),
      stock: producto.stock,
      destacado: producto.destacado || false
    });
    setShowForm(true);
  };

  const handleActualizarEstado = async (pedidoId: string, nuevoEstado: string) => {
    try {
      await pedidosAPI.actualizarEstado(pedidoId, nuevoEstado);
      alert('Estado actualizado');
      cargarPedidos();
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: 'hombre',
      tallas: '',
      colores: '',
      imagenes: '',
      stock: 0,
      destacado: false
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Panel de Administración</h1>

        <div className="admin-tabs">
          <button
            className={activeTab === 'productos' ? 'active' : ''}
            onClick={() => setActiveTab('productos')}
          >
            Productos
          </button>
          <button
            className={activeTab === 'pedidos' ? 'active' : ''}
            onClick={() => setActiveTab('pedidos')}
          >
            Pedidos
          </button>
        </div>

        {activeTab === 'productos' && (
          <div className="admin-section">
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancelar' : 'Nuevo Producto'}
            </button>

            {showForm && (
              <form onSubmit={handleSubmitProducto} className="admin-form">
                <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>

                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    required
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Precio:</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: parseFloat(e.target.value) })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock:</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Categoría:</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        categoria: e.target.value as any
                      })
                    }
                  >
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                    <option value="niños">Niños</option>
                    <option value="accesorios">Accesorios</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tallas (separadas por coma):</label>
                  <input
                    type="text"
                    required
                    placeholder="S, M, L, XL"
                    value={formData.tallas}
                    onChange={(e) => setFormData({ ...formData, tallas: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Colores (separados por coma):</label>
                  <input
                    type="text"
                    required
                    placeholder="Negro, Blanco, Azul"
                    value={formData.colores}
                    onChange={(e) => setFormData({ ...formData, colores: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>URLs de Imágenes (separadas por coma):</label>
                  <input
                    type="text"
                    required
                    placeholder="https://ejemplo.com/img1.jpg, https://ejemplo.com/img2.jpg"
                    value={formData.imagenes}
                    onChange={(e) => setFormData({ ...formData, imagenes: e.target.value })}
                  />
                </div>

                <div className="form-group-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.destacado}
                      onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                    />
                    Producto destacado
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Actualizar' : 'Crear'}
                  </button>
                  <button type="button" onClick={resetForm} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            <div className="productos-table">
              <table>
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((producto) => (
                    <tr key={producto._id}>
                      <td>
                        <img
                          src={producto.imagenes[0] || 'https://via.placeholder.com/50'}
                          alt={producto.nombre}
                          className="table-image"
                        />
                      </td>
                      <td>{producto.nombre}</td>
                      <td>${producto.precio.toFixed(2)}</td>
                      <td>{producto.categoria}</td>
                      <td>{producto.stock}</td>
                      <td>
                        <button
                          onClick={() => handleEditarProducto(producto)}
                          className="btn-small btn-edit"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminarProducto(producto._id)}
                          className="btn-small btn-delete"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div className="admin-section">
            <div className="pedidos-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido._id}>
                      <td>#{pedido._id.slice(-8)}</td>
                      <td>{typeof pedido.usuario === 'object' ? pedido.usuario.nombre : '-'}</td>
                      <td>${pedido.total.toFixed(2)}</td>
                      <td>
                        <select
                          value={pedido.estado}
                          onChange={(e) => handleActualizarEstado(pedido._id, e.target.value)}
                          className="estado-select"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="procesando">Procesando</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregado">Entregado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </td>
                      <td>{new Date(pedido.createdAt).toLocaleDateString('es-ES')}</td>
                      <td>
                        <span className="items-count">{pedido.items.length} items</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
