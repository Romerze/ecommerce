export interface IUser {
  _id?: string;
  nombre: string;
  email: string;
  password: string;
  rol: 'cliente' | 'admin';
  direccion?: string;
  telefono?: string;
  createdAt?: Date;
}

export interface IProducto {
  _id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: 'hombre' | 'mujer' | 'niños' | 'accesorios';
  subcategoria?: string;
  tallas: string[];
  colores: string[];
  imagenes: string[];
  stock: number;
  destacado?: boolean;
  createdAt?: Date;
}

export interface IItemCarrito {
  producto: string | IProducto;
  cantidad: number;
  talla: string;
  color: string;
  precio: number;
}

export interface IPedido {
  _id?: string;
  usuario: string | IUser;
  items: IItemCarrito[];
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  direccionEnvio: {
    calle: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
  };
  metodoPago: string;
  createdAt?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    rol: string;
  };
}
