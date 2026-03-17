'use client';

import { useState } from 'react';

type MemberStatus = '대기' | '승인';

type Member = {
  id: number;
  name: string;
  email: string;
  status: MemberStatus;
};

const defaultMembers: Member[] = [
  { id: 1, name: '김민수', email: 'user1@test.com', status: '대기' },
  { id: 2, name: '이영희', email: 'user2@test.com', status: '승인' },
  { id: 3, name: '박지훈', email: 'user3@test.com', status: '대기' },
];

export default function Home() {
  const [members, setMembers] = useState(defaultMembers);

  const approveMember = (id: number) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id ? { ...member, status: '승인' } : member,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <h2 className="mt-6 text-xl font-semibold text-gray-800">회원 승인 관리</h2>

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
              {members.map((member) => (
                <tr key={member.id} className="bg-white">
                  <td className="border border-gray-300 px-4 py-3">{member.name}</td>
                  <td className="border border-gray-300 px-4 py-3">{member.email}</td>
                  <td className="border border-gray-300 px-4 py-3">{member.status}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    {member.status === '대기' ? (
                      <button
                        type="button"
                        onClick={() => approveMember(member.id)}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-white transition hover:bg-blue-700"
                      >
                        승인
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
