import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { useState } from 'react';

interface Chapter {
  id: number;
  title: string;
  chapterNumber: number;
  imageUrls: string[];
  mangaId: number;
}

interface Manga {
  id: number;
  title: string;
  image: string;
}

interface Props {
  chapter: Chapter | null;
  manga: Manga | null;
  allChapters: Chapter[]; // قائمة بجميع الفصول
}

const ChapterPage: React.FC<Props> = ({ chapter, manga, allChapters }) => {
  const router = useRouter();
  const [selectedChapter, setSelectedChapter] = useState(
    chapter ? { value: chapter.id, label: `Chapter ${chapter.chapterNumber}: ${chapter.title}` } : null
  );

  if (!chapter || !manga) {
    return <div className="text-center p-6 text-white">لا يمكن العثور على الفصل أو المانجا.</div>;
  }

  const handleChapterChange = (selectedOption: any) => {
    setSelectedChapter(selectedOption);
    router.push(`/chapter/${selectedOption.value}`);
  };

  const chapterOptions = allChapters
    ? allChapters.map((chap) => ({
        value: chap.id,
        label: `Chapter ${chap.chapterNumber}: ${chap.title}`,
      }))
    : [];

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <main className="p-6 md:p-12 lg:p-24 max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-6">{manga.title}</h1>
          <img
            src={manga.image}
            alt={manga.title}
            className="mx-auto w-32 h-32 object-cover rounded-full shadow-lg border-4 border-yellow-500"
          />
        </header>

        {/* Navigation Buttons */}
        <section className="flex justify-center items-center mb-12">
          <Select
            value={selectedChapter}
            onChange={handleChapterChange}
            options={chapterOptions}
            className="w-full max-w-xs text-black"
          />
        </section>

        <section className="bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold text-white mb-6">{chapter.title}</h2>
          <div className="flex flex-col items-center space-y-6">
            {chapter.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`صورة من الفصل ${chapter.chapterNumber}`}
                className="w-full max-w-3xl mb-6 rounded-lg shadow-lg border border-gray-700"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { chapterId } = context.query;

  if (!chapterId || typeof chapterId !== 'string') {
    return { props: { chapter: null, manga: null, allChapters: [] } };
  }

  try {
    const resChapter = await fetch(`http://localhost:3000/api/chapter/${chapterId}`);
    const chapter = await resChapter.json();

    const resManga = await fetch(`http://localhost:3000/api/manga/${chapter?.mangaId}`);
    const manga = await resManga.json();

    const resAllChapters = await fetch(`http://localhost:3000/api/chapter`);
    const allChapters = await resAllChapters.json();

    if (resChapter.ok && resManga.ok && resAllChapters.ok) {
      return { props: { chapter, manga, allChapters } };
    } else {
      return { props: { chapter: null, manga: null, allChapters: [] } };
    }
  } catch (error) {
    console.error('Failed to fetch chapter or manga:', error);
    return { props: { chapter: null, manga: null, allChapters: [] } };
  }
};

export default ChapterPage;
