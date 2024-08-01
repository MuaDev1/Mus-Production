import Head from 'next/head';
import MangaList from '../components/MangaList';

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      <Head>
        <title>Home - Mus Production</title>
      </Head>
      <main>
        <section className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-gray-900 to-black">
          <div className="absolute inset-0">
            <img
              src="https://i.redd.it/xm87t35i71b71.jpg"
              alt="خلفية"
              className="w-full h-full object-cover opacity-40"
            />
          </div>
          <div className="relative container mx-auto px-4 py-20 text-center">
            <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight">
              استكشف عالم <span className="text-yellow-500">المانجا العربية</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              منصة متخصصة في تقديم المانجا العربية من إنتاج مبدعين عرب. استمتع بقراءة أحدث المانجات واكتشف العوالم المدهشة التي أنشأها المبدعون العرب.
            </p>
            <a href="#manga-list" className="bg-yellow-500 text-gray-900 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-600 transition-transform duration-300 transform hover:scale-105">
              اكتشف الآن
            </a>
          </div>
        </section>
        <section id="manga-list" className="py-16 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold mb-8 text-center text-white">المانجات الشائعة</h2>
            <MangaList />
          </div>
        </section>
        <footer className="bg-gray-800 text-gray-400 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Mus Production. جميع الحقوق محفوظة.</p>
            <div className="mt-4 text-sm">
              <a href="#" className="hover:text-gray-300 mx-2">سياسة الخصوصية</a>
              <span>|</span>
              <a href="#" className="hover:text-gray-300 mx-2">الشروط والأحكام</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
