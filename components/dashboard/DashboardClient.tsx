'use client';

import { useMemo, useState } from 'react';
import { signOut } from 'next-auth/react';

type User = {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved';
};

type Filter = 'all' | 'pending' | 'approved';

type DashboardClientProps = {
  initialUsers: User[];
};

const statusMap = {
  pending: '대기',
  approved: '승인',
} as const;

const badgeClassMap = {
  pending: 'bg-gray-100 text-gray-700',
  approved: 'bg-green-100 text-green-700',
} as const;

export default function DashboardClient({ initialUsers }: DashboardClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState<Filter>('all');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    if (filter === 'all') {
      return users;
    }

    return users.filter((user) => user.status === filter);
  }, [users, filter]);

  const approveUser = async (id: string) => {
    setLoadingId(id);

    const previous = users;
    const nextUsers = users.map((user) =>
      user.id === id ? { ...user, status: 'approved' as const } : user,
    );
    setUsers(nextUsers);

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        setUsers(previous);
      }
    } catch {
      setUsers(previous);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-5xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <h2 className="mt-2 text-xl font-semibold text-gray-800">회원 승인 관리</h2>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            type="button"
          >
            로그아웃
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          {[
            { key: 'all', label: 'Show All' },
            { key: 'pending', label: 'Pending' },
            { key: 'approved', label: 'Approved' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key as Filter)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                filter === item.key
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border border-gray-300 text-left text-sm text-gray-800">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-3 font-semibold">이름</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">이메일</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">상태</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="bg-white">
                  <td className="border border-gray-300 px-4 py-3">{user.name}</td>
                  <td className="border border-gray-300 px-4 py-3">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClassMap[user.status]}`}>
                      {statusMap[user.status]}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    {user.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => approveUser(user.id)}
                        disabled={loadingId === user.id}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                      >
                        {loadingId === user.id ? '처리 중...' : '승인'}
                      </button>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
