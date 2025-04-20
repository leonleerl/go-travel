'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button, Dialog, DialogTrigger } from '@/components/ui';
import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useState } from 'react';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className='text-black font-semibold' onClick={() => setFormType('login')}>
              Log In
            </Button>
          </DialogTrigger>
          {formType === 'login' ? <LoginForm /> : <RegisterForm />}
        </Dialog>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className='text-black font-semibold' onClick={() => setFormType('register')}>
              Sign Up
            </Button>
          </DialogTrigger>
          {formType === 'register' ? <RegisterForm /> : <LoginForm />}
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-sm">
        你好, {session.user?.name || 'User'}
      </div>
      <Link href="/profile">
        <Button variant="outline">个人资料</Button>
      </Link>
      <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
        退出登录
      </Button>
    </div>
  );
}