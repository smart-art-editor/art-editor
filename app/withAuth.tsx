'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3Context } from '../context/SignUp';

export function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const { account } = useWeb3Context();
    const router = useRouter();

    useEffect(() => {
      if (!account) {
        router.push('/');
      }
    }, [account, router]);

    if (!account) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
}