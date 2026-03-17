import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';
import LogoutButton from '@/components/LogoutButton';
import { authOptions } from '@/lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <LogoutButton />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-gray-800">회원 승인 관리</h2>
        <AdminDashboard />
      </div>
    </main>
  );
}
