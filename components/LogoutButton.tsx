'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.assign('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
    >
      로그아웃
    </button>
  );
}
