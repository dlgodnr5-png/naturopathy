"use client";
import Link from "next/link";
import "./cart.css";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, subtotal } = useCart();

  return (
    <div className="cart-container">
      {/* Header */}
      <header className="glass-container global-header">
        <div className="header-content">
          <Link href="/" className="logo">
            🌿 Naturo<span className="text-primary">Pathy</span>
          </Link>
          <nav className="main-nav">
            <Link href="/">홈</Link>
            <Link href="/products">스토어</Link>
            <Link href="/cart">장바구니</Link>
            <button className="glass-btn login-btn">로그인</button>
          </nav>
        </div>
      </header>

      <main className="cart-main">
        <h1 className="cart-title">장바구니</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <div className="glass-container p-10 text-center text-slate-400">
                <p>장바구니가 비어 있습니다.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="glass-container cart-item">
                  <div className="cart-item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} />
                    ) : (
                      <span className="placeholder-icon">🌿</span>
                    )}
                  </div>
                  
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <span className="badge">{item.category}</span>
                      <button className="remove-btn" onClick={() => removeFromCart(item.id)}>삭제 ✕</button>
                    </div>
                    <h3 className="cart-item-name">{item.name}</h3>
                    <div className="cart-item-footer">
                      <div className="quantity-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <span className="cart-item-price">₩{(item.priceCents * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="cart-summary-section">
            <div className="glass-container summary-card">
              <h2 className="summary-title">주문 요약</h2>
              <div className="summary-row">
                <span>상품 금액</span>
                <span>₩{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>배송비</span>
                <span>무료</span>
              </div>
              <div className="summary-row total-row">
                <span>총 결제 금액</span>
                <span className="text-primary">₩{subtotal.toLocaleString()}</span>
              </div>
              <Link href="/checkout">
                <button className="glass-btn checkout-btn">결제하기</button>
              </Link>
              <Link href="/products" className="continue-shopping">
                쇼핑 계속하기
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
