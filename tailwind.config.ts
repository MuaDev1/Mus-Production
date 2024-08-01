// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}', // تحديث المسار لتضمين الملفات داخل src/pages
    './src/components/**/*.{js,ts,jsx,tsx}', // تحديث المسار لتضمين الملفات داخل src/components
    './src/app/**/*.{js,ts,jsx,tsx}', // تحديث المسار لتضمين الملفات داخل src/app إذا كنت تستخدمها أيضًا
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
