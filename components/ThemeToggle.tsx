'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className="p-2 rounded-md hover:ring-2 hover:ring-gray-300 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
