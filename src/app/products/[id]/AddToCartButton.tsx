"use client";

import { useCart } from "../../../context/CartContext";

interface Product {
  id: string;
  name: string;
  priceCents: number;
  category: string;
  imageUrl: string | null;
  isDigital: boolean;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      category: product.category,
      imageUrl: product.imageUrl,
      isDigital: product.isDigital
    });
    alert("장바구니에 담겼습니다!");
  };

  return (
    <button className="glass-btn primary-btn" onClick={handleAddToCart}>
      장바구니 담기
    </button>
  );
}
