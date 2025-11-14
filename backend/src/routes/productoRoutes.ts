import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productoController';
import { verificarToken, esAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/', verificarToken, esAdmin, crearProducto);
router.put('/:id', verificarToken, esAdmin, actualizarProducto);
router.delete('/:id', verificarToken, esAdmin, eliminarProducto);

export default router;
