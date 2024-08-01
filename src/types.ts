// src/types.ts
export interface Manga {
    id: number;
    title: string;
    description: string;
    image: string;
    chapters: Chapter[];
  }
  
  export interface Chapter {
    id: number;
    title: string;
    image: string; // تأكد من إضافة هذا السطر
    mangaId: number;
    manga?: Manga;
  }
export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // تأكد من تشفير كلمة المرور
  name: string;
  image?: string;
  isAdmin: boolean; // خاصية جديدة
}
