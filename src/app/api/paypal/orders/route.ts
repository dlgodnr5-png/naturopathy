import { NextResponse } from "next/server";
import { createOrder, PAYPAL_CURRENCY } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount, currency, description } = body as {
      amount?: string;
      currency?: string;
      description?: string;
    };

    // NOTE: 실제 운영에서는 클라이언트가 보낸 금액을 신뢰하지 말고,
    // 장바구니/상품 가격을 DB에서 다시 계산해 amount 를 산출해야 합니다.
    if (!amount || !/^\d+(\.\d{1,2})?$/.test(amount)) {
      return NextResponse.json(
        { error: "유효한 결제 금액(amount)이 필요합니다." },
        { status: 400 }
      );
    }

    const order = await createOrder({
      amount,
      currency: currency ?? PAYPAL_CURRENCY,
      description: description ?? "Naturopathy 주문",
    });

    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("PayPal 주문 생성 오류:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "주문 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
