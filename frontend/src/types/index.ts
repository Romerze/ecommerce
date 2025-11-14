export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'cliente' | 'admin';
  direccion?: string;
  telefono?: string;
}

export interface Producto {
  _id: string;
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
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  talla: string;
  color: string;
  precio: number;
}

export interface Pedido {
  _id: string;
  usuario: string | Usuario;
  items: ItemCarrito[];
  total: number;
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';
  direccionEnvio: {
    calle: string;
    ciudad: string;
    codigoPostal: string;
    pais: string;
  };
  metodoPago: string;
  createdAt: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  registrar: (datos: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface CarritoContextType {
  items: ItemCarrito[];
  agregarAlCarrito: (producto: Producto, cantidad: number, talla: string, color: string) => void;
  eliminarDelCarrito: (productoId: string, talla: string, color: string) => void;
  actualizarCantidad: (productoId: string, talla: string, color: string, cantidad: number) => void;
  vaciarCarrito: () => void;
  totalItems: number;
  totalPrecio: number;
}
