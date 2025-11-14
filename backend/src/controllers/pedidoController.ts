import { Request, Response } from 'express';
import Pedido from '../models/Pedido';
import User from '../models/User';

// Crear pedido
export const crearPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { items, total, direccionEnvio, metodoPago } = req.body;

    const pedido = await Pedido.create({
      usuarioId: userId,
      items,
      total,
      direccionEnvio,
      metodoPago
    });

    res.status(201).json(pedido);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pedidos del usuario
export const obtenerMisPedidos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const pedidos = await Pedido.findAll({
      where: { usuarioId: userId },
      order: [['createdAt', 'DESC']]
    });

    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener pedido por ID
export const obtenerPedidoPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const pedido = await Pedido.findByPk(req.params.id);

    if (!pedido) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    // Verificar que el pedido pertenece al usuario
    if (pedido.usuarioId !== userId) {
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
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: User,
          as: 'usuario',
          attributes: ['nombre', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(pedidos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar estado del pedido (solo admin)
export const actualizarEstadoPedido = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findByPk(req.params.id);

    if (!pedido) {
      res.status(404).json({ error: 'Pedido no encontrado' });
      return;
    }

    await pedido.update({ estado });
    res.json(pedido);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
