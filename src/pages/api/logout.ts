// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // حذف الكوكيز المستخدم عند تسجيل الخروج
  res.setHeader('Set-Cookie', 'user=; Path=/; HttpOnly; Max-Age=0');
  res.status(200).json({ message: 'Logged out successfully' });
}
