import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { name: '김민수', email: 'user1@test.com', status: 'pending' },
    { name: '이영희', email: 'user2@test.com', status: 'approved' },
    { name: '박지훈', email: 'user3@test.com', status: 'pending' },
  ] as const;

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        status: user.status,
      },
      create: {
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
