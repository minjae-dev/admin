import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: '김민수', email: 'user1@test.com', status: 'pending' },
      { name: '이영희', email: 'user2@test.com', status: 'approved' },
      { name: '박지훈', email: 'user3@test.com', status: 'pending' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
