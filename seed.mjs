import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "유기농 자연치유 허브티 세트",
      description: "스트레스 완화와 깊은 수면을 돕는 100% 유기농 허브티입니다.",
      priceCents: 25000,
      category: "보조제/식품",
      stock: 50,
      isDigital: false,
    },
    {
      name: "[온라인 강의] 4주 완성 자연치유 홈트",
      description: "집에서 따라할 수 있는 면역력 강화 운동법을 소개하는 비디오 강의입니다.",
      priceCents: 89000,
      category: "온라인 강의",
      isDigital: true,
    },
    {
      name: "자연치유 레시피 E-Book",
      description: "매일 건강하게 즐길 수 있는 100가지 자연식 레시피를 담은 전자책.",
      priceCents: 15000,
      category: "서적/이북",
      isDigital: true,
    },
    {
      name: "프리미엄 프로바이오틱스 30일분",
      description: "장 건강을 책임지는 고순도 유산균. 자연 유래 성분만 담았습니다.",
      priceCents: 45000,
      category: "보조제/식품",
      stock: 100,
      isDigital: false,
    }
  ];

  for (const p of products) {
    await prisma.product.create({
      data: p
    });
  }

  console.log("Mock products seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
