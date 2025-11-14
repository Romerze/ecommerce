import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Producto from './Producto';

interface ItemPedido {
  producto: number;
  cantidad: number;
  talla: string;
  color: string;
  precio: number;
}

interface DireccionEnvio {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
}

interface PedidoAttributes {
  id: number;
  usuarioId: number;
  items: ItemPedido[];
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  direccionEnvio: DireccionEnvio;
  metodoPago: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PedidoCreationAttributes extends Optional<PedidoAttributes, 'id' | 'estado' | 'createdAt' | 'updatedAt'> {}

class Pedido extends Model<PedidoAttributes, PedidoCreationAttributes> implements PedidoAttributes {
  public id!: number;
  public usuarioId!: number;
  public items!: ItemPedido[];
  public total!: number;
  public estado!: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  public direccionEnvio!: DireccionEnvio;
  public metodoPago!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Asociaciones
  public readonly usuario?: User;
}

Pedido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isValidItems(value: any) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new Error('El pedido debe tener al menos un item');
          }
        },
      },
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El total no puede ser negativo',
        },
      },
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'),
      defaultValue: 'pendiente',
      allowNull: false,
    },
    direccionEnvio: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidAddress(value: any) {
          if (!value || !value.calle || !value.ciudad || !value.codigoPostal || !value.pais) {
            throw new Error('La dirección de envío debe estar completa');
          }
        },
      },
    },
    metodoPago: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El método de pago es obligatorio',
        },
      },
    },
  },
  {
    sequelize,
    tableName: 'pedidos',
    timestamps: true,
  }
);

// Definir asociaciones
Pedido.belongsTo(User, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

User.hasMany(Pedido, {
  foreignKey: 'usuarioId',
  as: 'pedidos',
});

export default Pedido;
