'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAdmin(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || password !== adminPassword) {
    return { error: 'Incorrect password' };
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', 'authenticated', { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });

  redirect('/admin');
}
