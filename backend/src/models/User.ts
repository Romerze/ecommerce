import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: 'cliente' | 'admin';
  direccion?: string;
  telefono?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'rol' | 'direccion' | 'telefono' | 'createdAt' | 'updatedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public rol!: 'cliente' | 'admin';
  public direccion?: string;
  public telefono?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para comparar passwords
  public async compararPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

User.init(
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
          msg: 'El nombre es obligatorio',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Debe ser un email válido',
        },
        notEmpty: {
          msg: 'El email es obligatorio',
        },
      },
      set(value: string) {
        this.setDataValue('email', value.toLowerCase().trim());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña es obligatoria',
        },
        len: {
          args: [6, 255],
          msg: 'La contraseña debe tener al menos 6 caracteres',
        },
      },
    },
    rol: {
      type: DataTypes.ENUM('cliente', 'admin'),
      defaultValue: 'cliente',
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      // Hash password antes de crear
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      // Hash password antes de actualizar si ha cambiado
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
