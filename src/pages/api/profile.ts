import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ReadingEntry {
  mangaTitle: string;
  currentChapter: number;
}

interface User {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  profilePicture?: string;
  isAdmin?: boolean;
  createdAt?: string;
}

interface ReadingList {
  username: string;
  mangaList: ReadingEntry[];
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const READING_LIST_FILE = path.join(process.cwd(), 'data', 'readingList.json');

const readUsers = (): User[] => {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const readReadingList = (): ReadingList[] => {
  if (fs.existsSync(READING_LIST_FILE)) {
    const data = fs.readFileSync(READING_LIST_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return [];
};

const writeUsers = (users: User[]): void => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

const writeReadingList = (readingList: ReadingList[]): void => {
  fs.writeFileSync(READING_LIST_FILE, JSON.stringify(readingList, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const token = req.headers['authorization']?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'تحتاج إلى تسجيل الدخول.' });
      }

      const users = readUsers();
      const readingList = readReadingList();
      const user = users.find(user => user.email === token); // Assuming token is email for simplicity

      if (user) {
        const userReadingList = readingList.find(entry => entry.username === user.username);
        return res.status(200).json({
          ...user,
          readingList: userReadingList?.mangaList || []
        });
      } else {
        return res.status(404).json({ message: 'لم يتم العثور على المستخدم.' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء جلب البيانات.' });
    }
  } else {
    return res.status(405).json({ message: 'طريقة الطلب غير مدعومة.' });
  }
}
