import React, { createContext, useState, useContext, useEffect } from 'react';
import { CarritoContextType, ItemCarrito, Producto } from '../types';

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ItemCarrito[]>(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregarAlCarrito = (producto: Producto, cantidad: number, talla: string, color: string) => {
    setItems((prevItems) => {
      const itemExistente = prevItems.find(
        (item) =>
          item.producto._id === producto._id &&
          item.talla === talla &&
          item.color === color
      );

      if (itemExistente) {
        return prevItems.map((item) =>
          item.producto._id === producto._id &&
          item.talla === talla &&
          item.color === color
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }

      return [...prevItems, { producto, cantidad, talla, color, precio: producto.precio }];
    });
  };

  const eliminarDelCarrito = (productoId: string, talla: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.producto._id === productoId && item.talla === talla && item.color === color)
      )
    );
  };

  const actualizarCantidad = (
    productoId: string,
    talla: string,
    color: string,
    cantidad: number
  ) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(productoId, talla, color);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.producto._id === productoId && item.talla === talla && item.color === color
          ? { ...item, cantidad }
          : item
      )
    );
  };

  const vaciarCarrito = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const value: CarritoContextType = {
    items,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    totalItems,
    totalPrecio
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
};

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (context === undefined) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};
