import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId, customerInfo } = await req.json();

    // In a real scenario, this would call a local tax/invoice API (e.g., Hometax API, Popbill, etc.)
    // to automatically generate and issue a tax invoice or cash receipt.

    const invoiceData = {
      invoiceId: `INV-${Date.now()}`,
      orderId,
      status: "ISSUED",
      issuedAt: new Date().toISOString(),
      customerEmail: customerInfo?.email || "unknown@email.com",
      message: "Tax invoice has been automatically generated and sent to the customer."
    };

    return NextResponse.json({ success: true, data: invoiceData });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate invoice" }, { status: 500 });
  }
}
