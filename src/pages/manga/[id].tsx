import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

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
  mangaId: number;
}

interface Props {
  manga: Manga | null;
  chapters: Chapter[];
}

const MangaPage: React.FC<Props> = ({ manga, chapters }) => {
  const router = useRouter();
  const { id } = router.query;

  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  const handleChapterClick = (chapterId: number) => {
    router.push(`/chapter/${chapterId}`);
  };

  if (!manga) {
    return <div className="text-center p-6 text-white">لا يمكن العثور على المانجا.</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <main className="p-6 md:p-12 lg:p-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:space-x-12 mb-12">
          {/* صورة المانجا */}
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div className="w-80 h-[32rem] overflow-hidden rounded-lg border-4 border-yellow-500 shadow-lg">
              <img
                src={manga.image}
                alt={manga.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* وصف المانجا */}
          <div className="md:w-2/3">
            <header className="text-center md:text-left mb-6">
              <h1 className="text-5xl font-bold text-white mb-4">{manga.title}</h1>
            </header>

            <section className="bg-gray-800 p-6 rounded-lg shadow-md mb-12">
              <h2 className="text-4xl font-semibold text-white mb-6">الوصف</h2>
              <p className="text-lg text-gray-300">{manga.description}</p>
            </section>

            <section>
              <h2 className="text-4xl font-semibold text-white mb-6">الفصول</h2>
              <ul className="space-y-4">
                {chapters
                  .filter(chapter => chapter.mangaId === manga.id)
                  .map(chapter => (
                    <li key={chapter.id}>
                      <button
                        onClick={() => handleChapterClick(chapter.id)}
                        className="text-yellow-400 hover:underline text-xl"
                      >
                        {`فصل ${chapter.chapterNumber}: ${chapter.title}`}
                      </button>
                    </li>
                  ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  if (!id || typeof id !== 'string') {
    return { props: { manga: null, chapters: [] } };
  }

  try {
    const resManga = await fetch(`http://localhost:3000/api/manga/${id}`);
    const manga = await resManga.json();

    const resChapters = await fetch(`http://localhost:3000/api/chapter`);
    const chapters = await resChapters.json();

    if (resManga.ok && resChapters.ok) {
      return { props: { manga, chapters } };
    } else {
      return { props: { manga: null, chapters: [] } };
    }
  } catch (error) {
    console.error('Failed to fetch manga or chapters:', error);
    return { props: { manga: null, chapters: [] } };
  }
};

export default MangaPage;
