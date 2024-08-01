import { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Component {...pageProps} />
      </div>
    </>
  );
};

export default MyApp;
