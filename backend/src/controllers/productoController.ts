import { Request, Response } from 'express';
import Producto from '../models/Producto';

// Obtener todos los productos con filtros
export const obtenerProductos = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, precioMin, precioMax, busqueda, destacado } = req.query;

    let filtro: any = {};

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (precioMin || precioMax) {
      filtro.precio = {};
      if (precioMin) filtro.precio.$gte = Number(precioMin);
      if (precioMax) filtro.precio.$lte = Number(precioMax);
    }

    if (busqueda) {
      filtro.$text = { $search: busqueda as string };
    }

    if (destacado === 'true') {
      filtro.destacado = true;
    }

    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.json(productos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por ID
export const obtenerProductoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findById(req.params.id);

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
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto (solo admin)
export const actualizarProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json(producto);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto (solo admin)
export const eliminarProducto = async (req: Request, res: Response): Promise<void> => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);

    if (!producto) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
