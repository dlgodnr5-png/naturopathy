import Link from "next/link";
import "./page.css"; 

export default async function Home() {
  const products = [
    {
      id: "1",
      name: "유기농 자연치유 허브티 세트",
      description: "스트레스 완화와 깊은 수면을 돕는 100% 유기농 허브티입니다.",
      priceCents: 25000,
      category: "보조제/식품",
      isDigital: false,
      imageUrl: null
    },
    {
      id: "2",
      name: "[온라인 강의] 4주 완성 자연치유 홈트",
      description: "집에서 따라할 수 있는 면역력 강화 운동법을 소개하는 비디오 강의입니다.",
      priceCents: 89000,
      category: "온라인 강의",
      isDigital: true,
      imageUrl: null
    },
    {
      id: "3",
      name: "자연치유 레시피 E-Book",
      description: "매일 건강하게 즐길 수 있는 100가지 자연식 레시피를 담은 전자책.",
      priceCents: 15000,
      category: "서적/이북",
      isDigital: true,
      imageUrl: null
    },
    {
      id: "4",
      name: "프리미엄 프로바이오틱스 30일분",
      description: "장 건강을 책임지는 고순도 유산균. 자연 유래 성분만 담았습니다.",
      priceCents: 45000,
      category: "보조제/식품",
      isDigital: false,
      imageUrl: null
    }
  ];

  return (
    <div className="home-container">
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            자연이 주는 온전한 치유
          </h1>
          <p className="hero-subtitle">
            건강한 몸과 마음을 위한 프리미엄 건강 보조제와 
            자연치유 온라인 강의를 만나보세요.
          </p>
          <div className="hero-actions">
            <Link href="/products">
              <button className="glass-btn">모든 상품 보기</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="product-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">추천 상품</h2>
            <p className="section-desc">자연치유 크리에이터가 직접 엄선했습니다.</p>
          </div>
          <Link href="/products" className="view-all-link">
            전체 보기 →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="glass-container empty-state">
            <p>등록된 상품이 없습니다. 관리자 페이지에서 추가해주세요.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="glass-container product-card">
                <div className="product-image-placeholder">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <span className="placeholder-icon">🌿</span>
                  )}
                </div>
                <div className="product-meta">
                  <span className="badge">
                    {product.category}
                  </span>
                  {product.isDigital && (
                    <span className="digital-badge">디지털</span>
                  )}
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">
                  {product.description || "상품 설명이 없습니다."}
                </p>
                <div className="product-footer">
                  <span className="product-price">
                    ₩{(product.priceCents).toLocaleString()}
                  </span>
                  <button className="glass-btn add-cart-btn">담기</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
