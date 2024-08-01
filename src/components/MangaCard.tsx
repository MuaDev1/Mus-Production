import React from 'react';
import Link from 'next/link';
import { Manga } from '../types';

type Props = {
  manga: Manga;
};

export default function MangaCard({ manga }: Props) {
  return (
    <Link href={`/manga/${manga.id}`}>
      <div className="relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer">
        <div className="aspect-w-3 aspect-h-4">
          <img src={manga.image} alt={manga.title} className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="text-lg font-semibold text-white">{manga.title}</h2>
        </div>
      </div>
    </Link>
  );
}
