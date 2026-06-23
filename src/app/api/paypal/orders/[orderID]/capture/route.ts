import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ orderID: string }> }
) {
  try {
    const { orderID } = await params;

    if (!orderID) {
      return NextResponse.json({ error: "orderID 가 필요합니다." }, { status: 400 });
    }

    const capture = await captureOrder(orderID);

    // 결제 확정 후: 주문 저장 / 세금계산서 발행(/api/legal/invoice) 등을 이어서 처리할 수 있습니다.
    return NextResponse.json({ id: capture.id, status: capture.status, capture });
  } catch (error) {
    console.error("PayPal 결제 캡처 오류:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "결제 캡처에 실패했습니다." },
      { status: 500 }
    );
  }
}
