import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Registro de usuario
export const registrar = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, rol, direccion, telefono } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    // Crear nuevo usuario
    const usuario = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'cliente',
      direccion,
      telefono
    });

    // Generar token
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { userId: usuario.id, rol: usuario.rol },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Verificar password
    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    // Generar token
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    const token = jwt.sign(
      { userId: usuario.id, rol: usuario.rol },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener perfil del usuario
export const obtenerPerfil = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const usuario = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(usuario);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
