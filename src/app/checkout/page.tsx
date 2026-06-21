import Link from "next/link";
import "./checkout.css";

export default function CheckoutPage() {
  const cartItems = [
    {
      id: "1",
      name: "유기농 자연치유 허브티 세트",
      priceCents: 25000,
      quantity: 2,
    },
    {
      id: "2",
      name: "[온라인 강의] 4주 완성 자연치유 홈트",
      priceCents: 89000,
      quantity: 1,
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.priceCents * item.quantity, 0);

  return (
    <div className="checkout-container">
      {/* Header */}
      <header className="glass-container global-header">
        <div className="header-content">
          <Link href="/" className="logo">
            🌿 Naturo<span className="text-primary">Pathy</span>
          </Link>
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-layout">
          
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <h1 className="checkout-title">결제하기</h1>
            
            <div className="glass-container form-card">
              <h2 className="form-section-title">주문자 정보</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>이름</label>
                  <input type="text" className="glass-input" placeholder="홍길동" />
                </div>
                <div className="form-group">
                  <label>이메일</label>
                  <input type="email" className="glass-input" placeholder="example@email.com" />
                </div>
                <div className="form-group">
                  <label>전화번호</label>
                  <input type="tel" className="glass-input" placeholder="010-0000-0000" />
                </div>
              </div>
            </div>

            <div className="glass-container form-card">
              <h2 className="form-section-title">결제 수단</h2>
              <div className="payment-methods-grid">
                <button className="payment-method-btn active">
                  신용카드 (KCP)
                </button>
                <button className="payment-method-btn">
                  PayPal
                </button>
                <button className="payment-method-btn kakao">
                  카카오페이
                </button>
                <button className="payment-method-btn naver">
                  네이버페이
                </button>
                <button className="payment-method-btn toss">
                  토스페이
                </button>
              </div>
              
              <div className="payment-placeholder-area">
                {/* This area will render the specific payment widget based on selection */}
                <div className="placeholder-box">
                  결제 모듈 렌더링 영역 (Placeholder)
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-section">
            <div className="glass-container summary-card">
              <h2 className="summary-title">주문 내역</h2>
              
              <div className="checkout-items">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout-item-row">
                    <span className="item-name">{item.name} x {item.quantity}</span>
                    <span className="item-price">₩{(item.priceCents * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

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
              
              <button className="glass-btn checkout-btn">
                ₩{subtotal.toLocaleString()} 결제하기
              </button>
              
              <p className="legal-notice">
                주문 내용을 확인하였으며, 정보 제공 등에 동의합니다. (결제 대행 서비스 자동 정산 적용)
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
