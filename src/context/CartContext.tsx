"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  category: string;
  imageUrl: string | null;
  isDigital: boolean;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('naturopathy_cart');
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to parse cart from local storage", e);
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('naturopathy_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(current => {
      const existing = current.find(i => i.id === item.id);
      if (existing) {
        return current.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(current => current.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(current => 
      current.map(i => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.priceCents * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
