import { useEffect, useState } from 'react';
import { Manga } from '../types';
import MangaCard from './MangaCard';

export default function MangaList() {
  const [mangas, setMangas] = useState<Manga[]>([]);

  useEffect(() => {
    async function fetchMangas() {
      const response = await fetch('/api/manga');
      const data = await response.json();
      setMangas(data);
    }

    fetchMangas();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {mangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>
    </div>
  );
}
