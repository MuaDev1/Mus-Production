import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

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
  mangaList: [];
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
  if (req.method === 'POST') {
    try {
      const newUser: User = req.body;
      const users = readUsers();
      const readingList = readReadingList();

      // Check if the email already exists
      if (users.some(user => user.email === newUser.email)) {
        return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل.' });
      }

      // Add new user to the list
      users.push({ ...newUser, isAdmin: false, createdAt: new Date().toISOString() });
      writeUsers(users);

      // Initialize reading list for the new user
      readingList.push({ username: newUser.username, mangaList: [] });
      writeReadingList(readingList);

      return res.status(201).json({ message: 'تم تسجيل الحساب بنجاح.' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ message: 'حدث خطأ أثناء التسجيل.' });
    }
  } else {
    return res.status(405).json({ message: 'طريقة الطلب غير مدعومة.' });
  }
}
