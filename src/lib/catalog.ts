/**
 * 서버 측 신뢰 가능한 상품 카탈로그 및 가격 계산.
 *
 * 결제 금액은 절대 클라이언트가 보낸 값을 신뢰하지 않고, 여기 정의된
 * 가격으로 서버에서 직접 계산합니다. (가격 조작 공격 방지)
 */

export interface CatalogProduct {
  id: string;
  name: string;
  /** 원화 단가 */
  priceWon: number;
}

export const CATALOG: readonly CatalogProduct[] = [
  { id: "1", name: "유기농 자연치유 허브티 세트", priceWon: 25000 },
  { id: "2", name: "[온라인 강의] 4주 완성 자연치유 홈트", priceWon: 89000 },
];

export function getProduct(id: string): CatalogProduct | undefined {
  return CATALOG.find((p) => p.id === id);
}

/** 환경 변수에서 KRW→USD 환율을 안전하게 읽습니다. (잘못된 값은 기본 1350) */
export function getKrwToUsdRate(): number {
  const raw = Number(
    process.env.PAYPAL_KRW_RATE ?? process.env.NEXT_PUBLIC_PAYPAL_KRW_RATE ?? "1350"
  );
  return Number.isFinite(raw) && raw > 0 ? raw : 1350;
}

export interface LineItemInput {
  id: string;
  quantity: number;
}

export interface PricedOrder {
  subtotalWon: number;
  /** "100.00" 형식의 USD 금액 (PayPal은 KRW 미지원) */
  amountUsd: string;
  items: { id: string; name: string; quantity: number; priceWon: number }[];
}

/**
 * 클라이언트가 보낸 (id, quantity)만 신뢰하고, 단가는 서버 카탈로그에서 조회하여
 * 총 결제 금액을 계산합니다.
 */
export function priceOrder(items: LineItemInput[]): PricedOrder {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("주문 상품(items)이 비어 있습니다.");
  }

  const priced = items.map((item) => {
    const product = getProduct(String(item?.id));
    if (!product) {
      throw new Error(`알 수 없는 상품 ID: ${item?.id}`);
    }
    const quantity = Math.floor(Number(item?.quantity));
    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new Error(`유효하지 않은 수량입니다: ${item?.quantity}`);
    }
    return {
      id: product.id,
      name: product.name,
      quantity,
      priceWon: product.priceWon,
    };
  });

  const subtotalWon = priced.reduce((acc, i) => acc + i.priceWon * i.quantity, 0);
  const amountUsd = (subtotalWon / getKrwToUsdRate()).toFixed(2);

  return { subtotalWon, amountUsd, items: priced };
}
