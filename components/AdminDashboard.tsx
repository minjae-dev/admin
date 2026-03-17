'use client';

type User = {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved';
};

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('/api/users', { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('회원 목록을 불러오지 못했습니다.');
      }

      const data = (await response.json()) as User[];
      setUsers(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (id: string, status: User['status']) => {
    try {
      setProcessingId(id);
      setError('');
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('회원 상태 변경 중 오류가 발생했습니다.');
      }

      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status } : user)));
      setToastMessage(status === 'approved' ? '회원 승인 완료' : '회원 승인 취소 완료');
      setTimeout(() => {
        setToastMessage('');
      }, 2000);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="mt-4 overflow-x-auto">
      {toastMessage ? (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {toastMessage}
        </div>
      ) : null}

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">회원 목록 불러오는 중...</div>
      ) : (
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
            {users.map((user) => (
              <tr key={user.id} className="bg-white">
                <td className="border border-gray-300 px-4 py-3">{user.name}</td>
                <td className="border border-gray-300 px-4 py-3">{user.email}</td>
                <td className="border border-gray-300 px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  {user.status === 'pending' ? (
                    <button
                      type="button"
                      onClick={() => updateUserStatus(user.id, 'approved')}
                      disabled={processingId === user.id}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      {processingId === user.id ? '처리 중...' : '승인'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateUserStatus(user.id, 'pending')}
                      disabled={processingId === user.id}
                      className="rounded-md bg-gray-600 px-3 py-1.5 text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      {processingId === user.id ? '처리 중...' : '취소'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
