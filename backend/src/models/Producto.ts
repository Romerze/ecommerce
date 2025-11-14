import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductoAttributes {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'hombre' | 'mujer' | 'niños' | 'accesorios';
  subcategoria?: string;
  tallas: string[];
  colores: string[];
  imagenes: string[];
  stock: number;
  destacado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductoCreationAttributes extends Optional<ProductoAttributes, 'id' | 'subcategoria' | 'stock' | 'destacado' | 'createdAt' | 'updatedAt'> {}

class Producto extends Model<ProductoAttributes, ProductoCreationAttributes> implements ProductoAttributes {
  public id!: number;
  public nombre!: string;
  public descripcion!: string;
  public precio!: number;
  public categoria!: 'hombre' | 'mujer' | 'niños' | 'accesorios';
  public subcategoria?: string;
  public tallas!: string[];
  public colores!: string[];
  public imagenes!: string[];
  public stock!: number;
  public destacado!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Producto.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre del producto es obligatorio',
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La descripción es obligatoria',
        },
      },
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El precio no puede ser negativo',
        },
      },
    },
    categoria: {
      type: DataTypes.ENUM('hombre', 'mujer', 'niños', 'accesorios'),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La categoría es obligatoria',
        },
      },
    },
    subcategoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tallas: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('tallas');
        return Array.isArray(rawValue) ? rawValue : [];
      },
    },
    colores: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('colores');
        return Array.isArray(rawValue) ? rawValue : [];
      },
    },
    imagenes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      get() {
        const rawValue = this.getDataValue('imagenes');
        return Array.isArray(rawValue) ? rawValue : [];
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'El stock no puede ser negativo',
        },
      },
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'productos',
    timestamps: true,
  }
);

export default Producto;
