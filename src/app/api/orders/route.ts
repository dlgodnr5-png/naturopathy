import { NextResponse } from "next/server";

export async function GET() {
  // Check auth session here
  
  const mockOrders = [
    {
      id: "ord_1",
      date: new Date().toISOString(),
      totalCents: 25000,
      status: "COMPLETED",
      items: [
        {
          id: "item_1",
          name: "유기농 자연치유 허브티 세트",
          quantity: 1,
          priceCents: 25000
        }
      ]
    }
  ];

  return NextResponse.json(mockOrders);
}
