import { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
=======
import Link from 'next/link';
>>>>>>> cbb5bd41ed6999d71965f3df2ed00c87883f26e8

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
  }, [router.pathname]);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
<<<<<<< HEAD
    <nav className="bg-gray-900 p-4 flex justify-between items-center shadow-md">
      <Link href="/" legacyBehavior>
        <a className="flex items-center text-2xl font-bold text-white hover:text-yellow-500 transition duration-300">
        <Image src="/logo.png" alt="Mus Production Logo" width={200} height={30} />
        </a>
      </Link>
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/" legacyBehavior>
          <a className="text-gray-300 hover:text-white transition duration-300">Home</a>
        </Link>
        {user && (
          <>
            <Link href="/profile" legacyBehavior>
              <a className="text-gray-300 hover:text-white transition duration-300">Profile</a>
            </Link>
            {user.isAdmin && (
              <Link href="/admin" legacyBehavior>
                <a className="text-gray-300 hover:text-white transition duration-300">Admin</a>
              </Link>
            )}
            <span className="text-gray-300">Welcome, {user.fullName}</span>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-400 transition duration-300"
            >
              Logout
            </button>
          </>
        )}
        {!user && (
          <Link href="/login" legacyBehavior>
            <a className="py-2 px-4 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition duration-300">
              Login
            </a>
          </Link>
        )}
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-gray-900 text-center shadow-lg">
          <Link href="/" legacyBehavior>
            <a className="block py-2 px-4 text-gray-300 hover:text-white transition duration-300">Home</a>
          </Link>
          {user && (
            <>
              <Link href="/profile" legacyBehavior>
                <a className="block py-2 px-4 text-gray-300 hover:text-white transition duration-300">Profile</a>
              </Link>
              {user.isAdmin && (
                <Link href="/admin" legacyBehavior>
                  <a className="block py-2 px-4 text-gray-300 hover:text-white transition duration-300">Admin</a>
                </Link>
              )}
              <span className="block py-2 px-4 text-gray-300">Welcome, {user.fullName}</span>
              <button
                onClick={handleLogout}
                className="block w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-400 transition duration-300"
              >
                Logout
              </button>
=======
    <nav className="bg-gray-800 text-white fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link href="/">
            <a className="hover:text-gray-400">MySite</a>
          </Link>
        </div>
        <div className="space-x-4">
          <Link href="/">
            <a className="hover:text-gray-400">Home</a>
          </Link>
          <Link href="/manga">
            <a className="hover:text-gray-400">Manga</a>
          </Link>
          <Link href="/chapters">
            <a className="hover:text-gray-400">Chapters</a>
          </Link>
          {isLoggedIn ? (
            <>
              <a href="#" onClick={handleLogout} className="hover:text-gray-400">Logout</a>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="hover:text-gray-400">Login</a>
              </Link>
              <Link href="/register">
                <a className="hover:text-gray-400">Register</a>
              </Link>
>>>>>>> cbb5bd41ed6999d71965f3df2ed00c87883f26e8
            </>
          )}
          {!user && (
            <Link href="/login" legacyBehavior>
              <a className="block w-full py-2 px-4 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition duration-300">
                Login
              </a>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
