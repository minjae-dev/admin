import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  });

  return <DashboardClient initialUsers={users as Array<{ id: string; name: string; email: string; status: 'pending' | 'approved' }>} />;
}
