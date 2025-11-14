import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Producto from '../models/Producto';

// Obtener todos los productos con filtros
export const obtenerProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, precioMin, precioMax, busqueda, destacado } = req.query;

    const where: any = {};

    if (categoria) {
      where.categoria = categoria;
    }

    if (precioMin || precioMax) {
      where.precio = {};
      if (precioMin) where.precio[Op.gte] = Number(precioMin);
      if (precioMax) where.precio[Op.lte] = Number(precioMax);
    }

    if (busqueda) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } }
      ];
    }

    if (destacado === 'true') {
      where.destacado = true;
    }

    const productos = await Producto.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json(productos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por ID
export const obtenerProductoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json(producto);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Crear producto (solo admin)
export const crearProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto (solo admin)
export const actualizarProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    await producto.update(req.body);
    res.json(producto);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto (solo admin)
export const eliminarProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findByPk(req.params.id);

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    await producto.destroy();
    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
