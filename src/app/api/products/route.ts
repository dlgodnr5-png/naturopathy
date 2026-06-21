import { NextResponse } from "next/server";

export async function GET() {
  const products = [
    {
      id: "1",
      name: "유기농 자연치유 허브티 세트",
      priceCents: 25000,
      category: "보조제/식품",
      isDigital: false,
      stock: 50,
      imageUrl: null
    },
    {
      id: "2",
      name: "[온라인 강의] 4주 완성 자연치유 홈트",
      priceCents: 89000,
      category: "온라인 강의",
      isDigital: true,
      stock: -1,
      imageUrl: null
    }
  ];

  return NextResponse.json(products);
}
