import { useState } from 'react';
import { useRouter } from 'next/router';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    profilePicture: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'حدث خطأ أثناء التسجيل.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('حدث خطأ أثناء التسجيل.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center text-gray-100">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">إنشاء حساب</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-lg mb-2">اسم المستخدم</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-lg mb-2">كلمة المرور</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-lg mb-2">الاسم الكامل</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="profilePicture" className="block text-lg mb-2">رابط الصورة الشخصية (اختياري)</label>
            <input
              type="text"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-gray-100 border border-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-500 text-gray-900 font-bold rounded hover:bg-yellow-400"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400">لديك حساب بالفعل؟</p>
          <button
            onClick={() => router.push('/login')}
            className="text-blue-400 hover:underline mt-2"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
