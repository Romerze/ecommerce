import mongoose, { Schema, Document } from 'mongoose';
import { IPedido } from '../types';

interface IPedidoDocument extends IPedido, Document {}

const pedidoSchema = new Schema<IPedidoDocument>({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    producto: {
      type: Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    talla: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true
    }
  }],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  direccionEnvio: {
    calle: { type: String, required: true },
    ciudad: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    pais: { type: String, required: true }
  },
  metodoPago: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model<IPedidoDocument>('Pedido', pedidoSchema);
