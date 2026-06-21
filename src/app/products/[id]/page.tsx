import Link from "next/link";
import "./detail.css";
import AddToCartButton from "./AddToCartButton";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Mock data for the product detail (would be fetched from DB via Prisma normally)
  const product = {
    id: id,
    name: "유기농 자연치유 허브티 세트",
    description: "스트레스 완화와 깊은 수면을 돕는 100% 유기농 허브티입니다. 자연이 선사하는 최고의 휴식을 경험하세요.",
    priceCents: 25000,
    category: "보조제/식품",
    isDigital: false,
    imageUrl: null,
    stock: 50,
  };

  return (
    <div className="detail-container">
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

      {/* Main Content */}
      <main className="product-detail-main">
        <div className="glass-container product-card-large">
          <div className="product-layout">
            
            {/* Image Placeholder */}
            <div className="product-image-large">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <span className="placeholder-icon-large">🌿</span>
              )}
            </div>

            {/* Info Section */}
            <div className="product-info-panel">
              <div className="product-meta-large">
                <span className="badge-large">{product.category}</span>
                {product.isDigital && <span className="digital-badge">디지털 상품</span>}
              </div>

              <h1 className="product-title-large">{product.name}</h1>
              <p className="product-desc-large">{product.description}</p>
              
              <div className="product-price-large">
                ₩{(product.priceCents).toLocaleString()}
              </div>

              <div className="product-actions-large">
                <AddToCartButton product={product} />
                <button className="glass-btn secondary-btn">바로 구매하기</button>
              </div>

              <div className="product-details-list">
                <div className="detail-item">
                  <span className="detail-label">배송 안내</span>
                  <span className="detail-value">{product.isDigital ? "구매 즉시 열람 가능" : "영업일 기준 1~2일 내 발송"}</span>
                </div>
                {!product.isDigital && (
                  <div className="detail-item">
                    <span className="detail-label">재고 상태</span>
                    <span className="detail-value">{product.stock > 0 ? "재고 있음" : "품절"}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
