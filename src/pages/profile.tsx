import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import { useEffect, useState } from 'react';
import Head from 'next/head';

interface User {
  username: string;
  email: string;
  password: string;
  fullName: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
  readMangas: ReadManga[]; // إضافة خاصية لتخزين المانجات التي قرأها المستخدم
}

interface ReadManga {
  mangaId: number;
  chapterId: number;
}

interface Manga {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface Chapter {
  id: number;
  title: string;
  chapterNumber: number;
  imageUrls: string[];
  mangaId: number;
}

interface Props {
  user: User;
  mangas: Manga[];
  chapters: Chapter[];
}

const ProfilePage: React.FC<Props> = ({ user, mangas, chapters }) => {
  const [userMangas, setUserMangas] = useState<Manga[]>([]);
  const [userChapters, setUserChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (user.readMangas) {
      // جلب المانجات التي قرأها المستخدم
      const userMangaIds = user.readMangas.map(readManga => readManga.mangaId);
      const filteredMangas = mangas.filter(manga => userMangaIds.includes(manga.id));

      setUserMangas(filteredMangas);

      // جلب الفصول الخاصة بكل مانجا قرأها المستخدم
      const userChapterIds = user.readMangas.map(readManga => readManga.chapterId);
      const filteredChapters = chapters.filter(chapter => userChapterIds.includes(chapter.id));

      setUserChapters(filteredChapters);
    }
  }, [user, mangas, chapters]);

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 p-6">
      <Head>
        <title>{user.fullName} - Profile - Mus Production</title>
      </Head>
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-6">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="ml-6">
            <h1 className="text-3xl font-bold">{user.fullName}</h1>
            <p className="text-lg text-gray-400">{user.email}</p>
            <p className="text-lg text-gray-400">{user.isAdmin ? 'مدير' : 'مستخدم'}</p>
            <p className="text-sm text-gray-500">تاريخ الانضمام: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">المانجات التي قرأتها</h2>
        {userMangas.length === 0 ? (
          <p>لم تقم بقراءة أي مانجا بعد.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMangas.map(manga => (
              <div key={manga.id} className="bg-gray-700 p-4 rounded-lg">
                <img src={manga.image} alt={manga.title} className="w-full h-48 object-cover mb-4 rounded" />
                <h3 className="text-xl font-semibold">{manga.title}</h3>
                <p className="text-gray-400">{manga.description}</p>
                <div className="mt-2">
                  <h4 className="text-lg font-semibold">الفصول التي قرأتها</h4>
                  {userChapters
                    .filter(chapter => chapter.mangaId === manga.id)
                    .map(chapter => (
                      <p key={chapter.id} className="text-gray-300">الفصل {chapter.chapterNumber}</p>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // قراءة بيانات المستخدم من ملف JSON
  const userFilePath = path.join(process.cwd(), 'data', 'users.json');
  const userJsonData = fs.readFileSync(userFilePath, 'utf-8');
  const users: User[] = JSON.parse(userJsonData);

  // للحصول على المستخدم الأول كمثال، يمكنك تعديله بناءً على طريقة التوثيق الخاصة بك
  const user = users[0];

  // قراءة بيانات المانجات من ملف JSON
  const mangaFilePath = path.join(process.cwd(), 'data', 'mangas.json');
  const mangaJsonData = fs.readFileSync(mangaFilePath, 'utf-8');
  const mangas: Manga[] = JSON.parse(mangaJsonData);

  // قراءة بيانات الفصول من ملف JSON
  const chapterFilePath = path.join(process.cwd(), 'data', 'chapters.json');
  const chapterJsonData = fs.readFileSync(chapterFilePath, 'utf-8');
  const chapters: Chapter[] = JSON.parse(chapterJsonData);

  return {
    props: {
      user,
      mangas,
      chapters,
    },
  };
};

export default ProfilePage;
