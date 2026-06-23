import { NextResponse } from "next/server";
import { createOrder, PAYPAL_CURRENCY } from "@/lib/paypal";
import { priceOrder, type LineItemInput } from "@/lib/catalog";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    items?: LineItemInput[];
    description?: string;
  };

  // 보안: 클라이언트가 보낸 금액은 신뢰하지 않습니다.
  // (id, quantity)만 받아 서버 카탈로그 가격으로 총 결제 금액을 계산합니다.
  let priced;
  try {
    priced = priceOrder(body.items ?? []);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "유효하지 않은 주문입니다." },
      { status: 400 }
    );
  }

  try {
    const order = await createOrder({
      amount: priced.amountUsd,
      currency: PAYPAL_CURRENCY,
      description: body.description ?? "Naturopathy 주문",
    });

    return NextResponse.json({
      id: order.id,
      status: order.status,
      amount: priced.amountUsd,
      currency: PAYPAL_CURRENCY,
    });
  } catch (error) {
    console.error("PayPal 주문 생성 오류:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "주문 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
