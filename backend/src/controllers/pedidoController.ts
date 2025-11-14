import { Request, Response } from 'express';
import Pedido from '../models/Pedido';

// Crear pedido
export const crearPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { items, total, direccionEnvio, metodoPago } = req.body;

    const pedido = new Pedido({
      usuario: userId,
      items,
      total,
      direccionEnvio,
      metodoPago
    });

    await pedido.save();
    res.status(201).json(pedido);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pedidos del usuario
export const obtenerMisPedidos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const pedidos = await Pedido.find({ usuario: userId })
      .populate('items.producto')
      .sort({ createdAt: -1 });

    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pedido por ID
export const obtenerPedidoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const pedido = await Pedido.findById(req.params.id).populate('items.producto');

    if (!pedido) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    // Verificar que el pedido pertenece al usuario
    if (pedido.usuario.toString() !== userId) {
      res.status(403).json({ error: 'No autorizado' });
      return;
    }

    res.json(pedido);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los pedidos (solo admin)
export const obtenerTodosPedidos = async (req: Request, res: Response): Promise<void> => {
  try {
    const pedidos = await Pedido.find()
      .populate('usuario', 'nombre email')
      .populate('items.producto')
      .sort({ createdAt: -1 });

    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estado del pedido (solo admin)
export const actualizarEstadoPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    if (!pedido) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    res.json(pedido);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
