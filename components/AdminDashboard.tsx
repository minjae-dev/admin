'use client';

import { useEffect, useState } from 'react';

type UserStatus = 'pending' | 'approved';

type User = {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  isPublic: boolean;
  role: string;
  createdAt: string;
};

type UserFormData = {
  name: string;
  email: string;
  status: UserStatus;
  isPublic: boolean;
  role: string;
};

const defaultFormData: UserFormData = {
  name: '',
  email: '',
  status: 'pending',
  isPublic: false,
  role: 'member',
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [publicFilter, setPublicFilter] = useState<'all' | 'public' | 'private'>('all');

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

  const openCreateForm = () => {
    setEditingUserId(null);
    setFormData(defaultFormData);
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      status: user.status,
      isPublic: user.isPublic,
      role: user.role,
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (formSubmitting) {
      return;
    }
    setIsFormOpen(false);
    setEditingUserId(null);
    setFormData(defaultFormData);
    setFormError('');
  };

  const handleSaveUser = async () => {
    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      setFormError('이름은 필수입니다.');
      return;
    }

    if (!email) {
      setFormError('이메일은 필수입니다.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');
    setError('');

    try {
      const payload = {
        name,
        email,
        status: formData.status,
        isPublic: formData.isPublic,
        role: formData.role.trim() || 'member',
      };

      const response = await fetch(editingUserId ? `/api/users/${editingUserId}` : '/api/users', {
        method: editingUserId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(result?.message ?? '회원 저장 중 오류가 발생했습니다.');
      }

      const savedUser = (await response.json()) as User;

      if (editingUserId) {
        setUsers((prev) => prev.map((user) => (user.id === editingUserId ? savedUser : user)));
        setToastMessage('회원 정보 수정 완료');
      } else {
        setUsers((prev) => [savedUser, ...prev]);
        setToastMessage('회원 추가 완료');
      }

      setTimeout(() => {
        setToastMessage('');
      }, 2000);

      closeForm();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const updateUserStatus = async (id: string, status: UserStatus) => {
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

  const toggleUserPublic = async (id: string, isPublic: boolean) => {
    try {
      setProcessingId(id);
      setError('');
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic }),
      });

      if (!response.ok) {
        throw new Error('공개 여부 변경 중 오류가 발생했습니다.');
      }

      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, isPublic } : user)));
      setToastMessage(isPublic ? '공개 설정 완료' : '비공개 설정 완료');
      setTimeout(() => {
        setToastMessage('');
      }, 2000);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('정말 이 회원을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setProcessingId(id);
      setError('');

      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('회원 삭제 중 오류가 발생했습니다.');
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
      setToastMessage('회원 삭제 완료');
      setTimeout(() => {
        setToastMessage('');
      }, 2000);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.email.toLowerCase().includes(normalizedQuery);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPublic =
      publicFilter === 'all' ||
      (publicFilter === 'public' && user.isPublic) ||
      (publicFilter === 'private' && !user.isPublic);
    return matchesQuery && matchesStatus && matchesPublic;
  });

  return (
    <div className="mt-4 overflow-x-auto">
      {toastMessage ? (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
          {toastMessage}
        </div>
      ) : null}

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-600">회원을 추가/수정하고 승인 및 공개 여부를 관리하세요.</p>
        <button
          type="button"
          onClick={openCreateForm}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          회원 추가
        </button>
      </div>

      {loading ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-6 text-center text-gray-600">회원 목록 불러오는 중...</div>
      ) : (
        <>
          <div className="mb-4 rounded-md border border-gray-200 bg-white p-3">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="이름 또는 이메일로 검색"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as 'all' | UserStatus)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
              >
                <option value="all">전체 상태</option>
                <option value="pending">pending</option>
                <option value="approved">approved</option>
              </select>

              <select
                value={publicFilter}
                onChange={(event) => setPublicFilter(event.target.value as 'all' | 'public' | 'private')}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
              >
                <option value="all">전체 공개여부</option>
                <option value="public">공개</option>
                <option value="private">비공개</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setPublicFilter('all');
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                초기화
              </button>
            </div>

            <p className="mt-2 text-xs text-gray-600">
              총 {users.length}명 중 {filteredUsers.length}명 표시
            </p>
          </div>

          <table className="w-full border border-gray-300 text-left text-sm text-gray-800">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-3 font-semibold">이름</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">이메일</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">상태</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">공개여부</th>
                <th className="border border-gray-300 px-4 py-3 font-semibold">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr className="bg-white">
                  <td colSpan={5} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                    검색/필터 조건에 맞는 회원이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
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
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.isPublic ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {user.isPublic ? '공개' : '비공개'}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex flex-wrap gap-2">
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
                            {processingId === user.id ? '처리 중...' : '승인 취소'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleUserPublic(user.id, !user.isPublic)}
                          disabled={processingId === user.id}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                          {processingId === user.id ? '처리 중...' : user.isPublic ? '비공개로' : '공개로'}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditForm(user)}
                          disabled={processingId === user.id}
                          className="rounded-md border border-blue-300 px-3 py-1.5 text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:bg-blue-50"
                        >
                          수정
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteUser(user.id)}
                          disabled={processingId === user.id}
                          className="rounded-md border border-red-300 px-3 py-1.5 text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">{editingUserId ? '회원 정보 수정' : '회원 추가'}</h3>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">이름</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">이메일</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">상태</label>
                <select
                  value={formData.status}
                  onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value as UserStatus }))}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                >
                  <option value="pending">pending</option>
                  <option value="approved">approved</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">공개 여부</label>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }))}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    formData.isPublic ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {formData.isPublic ? '공개' : '비공개'}
                </button>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">역할(role)</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
                  placeholder="member"
                />
              </div>
            </div>

            {formError ? <p className="mt-3 text-sm text-red-600">{formError}</p> : null}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                disabled={formSubmitting}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                disabled={formSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {formSubmitting ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
