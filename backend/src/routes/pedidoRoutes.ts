import express from 'express';
import {
  crearPedido,
  obtenerMisPedidos,
  obtenerPedidoPorId,
  obtenerTodosPedidos,
  actualizarEstadoPedido
} from '../controllers/pedidoController';
import { verificarToken, esAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', verificarToken, crearPedido);
router.get('/mis-pedidos', verificarToken, obtenerMisPedidos);
router.get('/todos', verificarToken, esAdmin, obtenerTodosPedidos);
router.get('/:id', verificarToken, obtenerPedidoPorId);
router.put('/:id/estado', verificarToken, esAdmin, actualizarEstadoPedido);

export default router;
