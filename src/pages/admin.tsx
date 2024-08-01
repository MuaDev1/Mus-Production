import React, { useState, useEffect } from 'react';
import { Manga } from '../types';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [editing, setEditing] = useState<Manga | null>(null);
  const [selectedMangaId, setSelectedMangaId] = useState<number | null>(null);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);

  useEffect(() => {
    async function fetchMangas() {
      const response = await fetch('/api/manga');
      const data = await response.json();
      setMangas(data);
    }

    async function fetchChapters() {
      const response = await fetch('/api/chapter');
      const data = await response.json();
      setChapters(data);
    }

    fetchMangas();
    fetchChapters();
  }, []);

  const handleChapterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMangaId === null) {
      alert('يرجى اختيار مانجا');
      return;
    }
    const method = editingChapter ? 'PUT' : 'POST';
    const url = editingChapter ? `/api/chapter/${editingChapter.id}` : '/api/chapter';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: chapterTitle, chapterNumber, imageUrls, mangaId: selectedMangaId }),
    });
    const data = await response.json();
    if (editingChapter) {
      setChapters(chapters.map(chapter => (chapter.id === data.id ? data : chapter)));
      setEditingChapter(null);
    } else {
      setChapters([...chapters, data]);
    }
    setChapterTitle('');
    setChapterNumber(1);
    setImageUrls([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/manga/${editing.id}` : '/api/manga';
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, image }),
    });

    const data = await response.json();
    if (editing) {
      setMangas(mangas.map(manga => (manga.id === data.id ? data : manga)));
      setEditing(null);
    } else {
      setMangas([...mangas, data]);
    }
    setTitle('');
    setDescription('');
    setImage('');
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/manga/${id}`, { method: 'DELETE' });
    setMangas(mangas.filter(manga => manga.id !== id));
  };

  const handleEdit = (manga: Manga) => {
    setTitle(manga.title);
    setDescription(manga.description);
    setImage(manga.image);
    setEditing(manga);
  };

  const handleChapterEdit = (chapter: any) => {
    setChapterTitle(chapter.title);
    setChapterNumber(chapter.chapterNumber);
    setImageUrls(chapter.imageUrls);
    setSelectedMangaId(chapter.mangaId);
    setEditingChapter(chapter);
  };

  const handleChapterDelete = async (id: number) => {
    await fetch(`/api/chapter/${id}`, { method: 'DELETE' });
    setChapters(chapters.filter(chapter => chapter.id !== id));
  };

  // الإحصائيات العامة
  const totalMangas = mangas.length;
  const totalChapters = chapters.length; // تعديل الإحصائيات لتشمل الفصول
  
  return (
    <div className="flex">
      {/* القائمة الجانبية */}
      <aside className="w-64 bg-gray-800 text-white min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#stats" className="block py-2 px-4 rounded hover:bg-gray-700">الإحصائيات</a>
            </li>
            <li className="mb-4">
              <a href="#add-manga" className="block py-2 px-4 rounded hover:bg-gray-700">إضافة مانجا</a>
            </li>
            <li className="mb-4">
              <a href="#add-chapter" className="block py-2 px-4 rounded hover:bg-gray-700">إضافة فصل</a>
            </li>
            <li className="mb-4">
              <a href="#manga-list" className="block py-2 px-4 rounded hover:bg-gray-700">قائمة المانجات</a>
            </li>
            <li className="mb-4">
              <a href="#chapter-list" className="block py-2 px-4 rounded hover:bg-gray-700">قائمة الفصول</a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-8 bg-gray-100">
        <section id="stats" className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">الإحصائيات العامة</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-100 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">عدد المانجات</h3>
              <p className="text-3xl font-bold text-gray-900">{totalMangas}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">عدد الفصول</h3>
              <p className="text-3xl font-bold text-gray-900">{totalChapters}</p>
            </div>
          </div>
        </section>

        <section id="add-manga" className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editing ? 'تعديل مانجا' : 'إضافة مانجا'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 text-lg mb-2">العنوان</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-lg mb-2">الوصف</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-lg mb-2">رابط الصورة</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
            >
              {editing ? 'تحديث' : 'إضافة'}
            </button>
          </form>
        </section>

        <section id="add-chapter" className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editingChapter ? 'تعديل فصل' : 'إضافة فصل'}</h2>
          <form onSubmit={handleChapterSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600 text-lg mb-2">عنوان الفصل</label>
              <input
                type="text"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-lg mb-2">رقم الفصل</label>
              <input
                type="number"
                value={chapterNumber}
                onChange={(e) => setChapterNumber(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-lg mb-2">روابط الصور (افصلها بفواصل)</label>
              <textarea
                value={imageUrls.join(',')}
                onChange={(e) => setImageUrls(e.target.value.split(',').map(url => url.trim()))}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                placeholder="أدخل روابط الصور هنا..."
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600 text-lg mb-2">اختيار مانجا</label>
              <select
                value={selectedMangaId || ''}
                onChange={(e) => setSelectedMangaId(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-md text-gray-900"
                required
              >
                <option value="">اختر مانجا</option>
                {mangas.map(manga => (
                  <option key={manga.id} value={manga.id}>{manga.title}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600"
            >
              {editingChapter ? 'تحديث' : 'إضافة فصل'}
            </button>
          </form>
        </section>

        <section id="manga-list" className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">قائمة المانجات</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-4">العنوان</th>
                <th className="border border-gray-300 p-4">الوصف</th>
                <th className="border border-gray-300 p-4">الصورة</th>
                <th className="border border-gray-300 p-4">تعديل</th>
                <th className="border border-gray-300 p-4">حذف</th>
              </tr>
            </thead>
            <tbody>
              {mangas.map(manga => (
                <tr key={manga.id}>
                  <td className="border border-gray-300 p-4">{manga.title}</td>
                  <td className="border border-gray-300 p-4">{manga.description}</td>
                  <td className="border border-gray-300 p-4">
                    <img src={manga.image} alt={manga.title} className="w-24 h-24 object-cover" />
                  </td>
                  <td className="border border-gray-300 p-4">
                    <button
                      onClick={() => handleEdit(manga)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border border-gray-300 p-4">
                    <button
                      onClick={() => handleDelete(manga.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section id="chapter-list" className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">قائمة الفصول</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-4">عنوان الفصل</th>
                <th className="border border-gray-300 p-4">رقم الفصل</th>
                <th className="border border-gray-300 p-4">المانجا</th>
                <th className="border border-gray-300 p-4">تعديل</th>
                <th className="border border-gray-300 p-4">حذف</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map(chapter => (
                <tr key={chapter.id}>
                  <td className="border border-gray-300 p-4">{chapter.title}</td>
                  <td className="border border-gray-300 p-4">{chapter.chapterNumber}</td>
                  <td className="border border-gray-300 p-4">{mangas.find(manga => manga.id === chapter.mangaId)?.title}</td>
                  <td className="border border-gray-300 p-4">
                    <button
                      onClick={() => handleChapterEdit(chapter)}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
                    >
                      تعديل
                    </button>
                  </td>
                  <td className="border border-gray-300 p-4">
                    <button
                      onClick={() => handleChapterDelete(chapter.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
