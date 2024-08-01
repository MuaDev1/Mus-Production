// pages/logout.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch('/api/logout', { method: 'POST' });
      router.push('/login');
    };

    logout();
  }, [router]);

  return <div className="p-6">جاري تسجيل الخروج...</div>;
};

export default LogoutPage;
