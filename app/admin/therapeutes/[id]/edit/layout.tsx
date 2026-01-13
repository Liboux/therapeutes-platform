'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminEditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    verifyAuth();
  }, []);

  const verifyAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify-admin');
      const data = await response.json();

      if (!data.success) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  return <>{children}</>;
}