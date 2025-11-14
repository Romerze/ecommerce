import express from 'express';
import { registrar, login, obtenerPerfil } from '../controllers/authController';
import { verificarToken } from '../middleware/auth';

const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', login);
router.get('/perfil', verificarToken, obtenerPerfil);

export default router;
