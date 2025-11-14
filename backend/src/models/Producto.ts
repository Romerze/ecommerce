import mongoose, { Schema, Document } from 'mongoose';
import { IProducto } from '../types';

interface IProductoDocument extends IProducto, Document {}

const productoSchema = new Schema<IProductoDocument>({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: 0
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['hombre', 'mujer', 'niños', 'accesorios']
  },
  subcategoria: {
    type: String,
    trim: true
  },
  tallas: [{
    type: String,
    trim: true
  }],
  colores: [{
    type: String,
    trim: true
  }],
  imagenes: [{
    type: String,
    trim: true
  }],
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: 0,
    default: 0
  },
  destacado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índice para búsquedas
productoSchema.index({ nombre: 'text', descripcion: 'text' });

export default mongoose.model<IProductoDocument>('Producto', productoSchema);
