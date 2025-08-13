'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-md shadow-2xl' 
        : 'bg-white shadow-lg'
    } relative`}>
      {/* Gradient برتقالي خفيف في الأسفل */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 opacity-60"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 space-x-reverse">
              {/* الشعار - يمكنك استبدال مسار الصورة بالشعار الخاص بكم */}
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src="/images/logo.png" 
                  alt="أفق الحياة - شعار الشركة" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // في حالة عدم وجود الشعار، نعرض الأيقونة الافتراضية
                    const target = e.currentTarget as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center hidden">
                  <svg className="w-9 h-9 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isScrolled 
                  ? 'text-white' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent'
              }`}>أفق الحياة</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
            <Link href="/" className={`transition-colors duration-200 font-medium ${
              isScrolled 
                ? 'text-gray-200 hover:text-orange-400' 
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              الرئيسية
            </Link>
            <Link href="/services" className={`transition-colors duration-200 font-medium ${
              isScrolled 
                ? 'text-gray-200 hover:text-orange-400' 
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              خدماتنا
            </Link>
            <Link href="/courses" className={`transition-colors duration-200 font-medium ${
              isScrolled 
                ? 'text-gray-200 hover:text-orange-400' 
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              الدورات
            </Link>
            <Link href="/about" className={`transition-colors duration-200 font-medium ${
              isScrolled 
                ? 'text-gray-200 hover:text-orange-400' 
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              من نحن
            </Link>
            <Link href="/contact" className={`transition-colors duration-200 font-medium ${
              isScrolled 
                ? 'text-gray-200 hover:text-orange-400' 
                : 'text-gray-700 hover:text-orange-600'
            }`}>
              تواصل معنا
            </Link>
            <div className="w-8"></div>
            <Link href="/store" className={`transition-all duration-200 font-medium px-4 py-2 rounded-lg border-2 ${
              isScrolled 
                ? 'text-gray-200 border-gray-200 hover:text-orange-400 hover:border-orange-400' 
                : 'text-gray-700 border-gray-300 hover:text-orange-600 hover:border-orange-600'
            }`}>
              مركز الألعاب
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`transition-colors duration-200 focus:outline-none ${
                isScrolled 
                  ? 'text-gray-200 hover:text-orange-400' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t transition-all duration-300 ${
              isScrolled 
                ? 'bg-black/95 backdrop-blur-md border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <Link href="/" className={`block px-3 py-2 transition-colors duration-200 font-medium ${
                isScrolled 
                  ? 'text-gray-200 hover:text-orange-400' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}>
                الرئيسية
              </Link>
              <Link href="/services" className={`block px-3 py-2 transition-colors duration-200 font-medium ${
                isScrolled 
                  ? 'text-gray-200 hover:text-orange-400' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}>
                خدماتنا
              </Link>
              <Link href="/courses" className={`block px-3 py-2 transition-colors duration-200 font-medium ${
                isScrolled 
                  ? 'text-gray-200 hover:text-orange-400' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}>
                الدورات
              </Link>
              <Link href="/about" className={`block px-3 py-2 transition-colors duration-200 font-medium ${
                isScrolled 
                  ? 'text-gray-200 hover:text-orange-400' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}>
                من نحن
              </Link>
              <Link href="/contact" className={`block px-3 py-2 transition-colors duration-200 font-medium ${
                isScrolled 
                  ? 'text-gray-200 hover:text-orange-400' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}>
                تواصل معنا
              </Link>
              <div className="h-2"></div>
              <Link href="/store" className={`block px-4 py-2 transition-all duration-200 font-medium rounded-lg border-2 ${
                isScrolled 
                  ? 'text-gray-200 border-gray-200 hover:text-orange-400 hover:border-orange-400' 
                  : 'text-gray-700 border-gray-300 hover:text-orange-600 hover:border-orange-600'
              }`}>
                مركز الألعاب
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
