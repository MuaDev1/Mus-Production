import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

interface User {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  profilePicture?: string;
  isAdmin?: boolean;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');
const JWT_SECRET = 'your-secret-key'; // تأكد من تغيير هذا المفتاح السري في بيئة الإنتاج

const readUsers = (): User[] => {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const readSessions = (): any[] => {
  if (fs.existsSync(SESSIONS_FILE)) {
    const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const writeSessions = (sessions: any[]): void => {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, password } = req.body;
      const users = readUsers();

      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
      }

      const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

      const sessions = readSessions();
      sessions.push({ token, user });
      writeSessions(sessions);

      return res.status(200).json({ token, user });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول.' });
    }
  } else {
    return res.status(405).json({ message: 'طريقة الطلب غير مدعومة.' });
  }
}
