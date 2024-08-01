import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface User {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  profilePicture?: string;
  backgroundPicture?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

const readUsers = (): User[] => {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const writeUsers = (users: User[]): void => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const updatedUser: User = req.body;

      const users = readUsers();
      const userIndex = users.findIndex(user => user.email === updatedUser.email);

      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      users[userIndex] = { ...users[userIndex], ...updatedUser };
      writeUsers(users);

      return res.status(200).json(users[userIndex]);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء تحديث البيانات.' });
    }
  } else {
    return res.status(405).json({ message: 'طريقة الطلب غير مدعومة.' });
  }
}
