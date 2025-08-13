'use client';

import Link from 'next/link';
import CoursesSection from '@/components/CoursesSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              مرحباً بكم في
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600"> أفق الحياة</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              شركة رائدة في مجال تكنولوجيا المعلومات والخدمات العامة.
              نقدم حلول تقنية متكاملة في البرمجة وتطوير التطبيقات وبناء المواقع الإلكترونية والدورات التدريبية المتخصصة.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/store" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                مركز الألعاب
              </Link>
              <Link href="/about" className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-500 hover:text-white transition-all duration-200">
                تعرف علينا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">خدماتنا المتميزة</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات التقنية المتطورة لتلبية احتياجات عملائنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Programming */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">البرمجة والتطوير</h3>
              <p className="text-gray-600 text-center">
                تطوير تطبيقات وبرامج مخصصة بأحدث التقنيات واللغات البرمجية
              </p>
            </div>

            {/* Web Development */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">تطوير المواقع</h3>
              <p className="text-gray-600 text-center">
                تصميم وبناء مواقع إلكترونية احترافية ومتجاوبة مع جميع الأجهزة
              </p>
            </div>

            {/* System Development */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">تطوير الأنظمة</h3>
              <p className="text-gray-600 text-center">
                بناء أنظمة إدارية متكاملة ومخصصة لاحتياجات الشركات والمؤسسات
              </p>
            </div>

            {/* Training */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">الدورات التدريبية</h3>
              <p className="text-gray-600 text-center">
                دورات تدريبية متخصصة في مجال التقنية والبرمجة بأحدث المناهج
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - نحول أفكارك إلى واقع رقمي */}
      <section className="relative py-32 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/hero-bg.jpg" 
            alt="التحول الرقمي" 
            className="w-full h-full object-cover opacity-30"
            onError={(e) => {
              // في حالة عدم وجود الصورة، نعرض خلفية متدرجة
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-300/60 via-orange-200/50 to-orange-400/60"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-300 to-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-15 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-orange-900 mb-8 leading-tight">
              نحول أفكارك إلى
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800">
                واقع رقمي متكامل
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-orange-800 max-w-4xl mx-auto leading-relaxed mb-16">
              مع خبرتنا وابتكارنا، نصنع مستقبلاً رقمياً يتجاوز التوقعات ونحقق رؤيتك بأعلى معايير الجودة
            </p>
            
            {/* Key Words */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="bg-orange-600/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-orange-600/30 hover:bg-orange-600/30 transition-all duration-300 transform hover:scale-110">
                <span className="text-2xl font-bold text-orange-800">ابتكار</span>
              </div>
              <div className="bg-orange-600/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-orange-600/30 hover:bg-orange-600/30 transition-all duration-300 transform hover:scale-110">
                <span className="text-2xl font-bold text-orange-800">تطور</span>
              </div>
              <div className="bg-orange-600/20 backdrop-blur-md rounded-2xl px-8 py-4 border border-orange-600/30 hover:bg-orange-600/30 transition-all duration-300 transform hover:scale-110">
                <span className="text-2xl font-bold text-orange-800">نجاح</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">من نحن</h2>
              <p className="text-lg text-gray-600 mb-6">
                شركة أفق الحياة لتكنولوجيا المعلومات والخدمات العامة هي شركة رائدة في مجال التقنية، 
                تأسست بهدف تقديم حلول تقنية متكاملة ومبتكرة لعملائنا في العراق والمنطقة.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                نتميز بفريق عمل محترف ومتخصص في مختلف مجالات التقنية، ونستخدم أحدث التقنيات 
                والأدوات لتقديم خدمات عالية الجودة تلبي توقعات عملائنا.
              </p>
              <Link href="/about" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200">
                تعرف على المزيد
              </Link>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">رؤيتنا</h3>
                <p className="text-lg mb-6">
                  أن نكون الشريك التقني الموثوق به للشركات والمؤسسات في العراق، 
                  ونقدم حلول تقنية مبتكرة تساهم في تطوير وتقدم المجتمع.
                </p>
                <h3 className="text-2xl font-bold mb-4">رسالتنا</h3>
                <p className="text-lg">
                  تقديم خدمات تقنية عالية الجودة ومبتكرة، وتمكين عملائنا من تحقيق أهدافهم 
                  من خلال الاستفادة من أحدث التقنيات والحلول الرقمية.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/digital-innovation-bg.jpg" 
            alt="الرقمنة والبرمجة" 
            className="w-full h-full object-cover opacity-40"
            onError={(e) => {
              // في حالة عدم وجود الصورة، نعرض خلفية متدرجة
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/60 via-orange-400/50 to-orange-600/60"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/15 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 leading-tight">
              نبتكر حلولاً رقمية
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-200">
                تصنع المستقبل
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-orange-100 max-w-4xl mx-auto leading-relaxed mb-12">
              مع أفق الحياة، التحول الرقمي ليس مجرد هدف، بل رحلة نخوضها معاً نحو النجاح
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/services" className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                استكشف خدماتنا
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-200 transform hover:scale-105">
                تواصل معنا
              </Link>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* تقنيات متطورة */}
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 text-center hover:bg-white/25 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-white/30">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">تقنيات متطورة</h3>
              <p className="text-white leading-relaxed">
                نستخدم أحدث التقنيات والأدوات المتطورة لتقديم حلول رقمية مبتكرة تلبي احتياجات العصر الرقمي
              </p>
            </div>

            {/* حلول مبتكرة */}
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 text-center hover:bg-white/25 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-white/30">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">حلول مبتكرة</h3>
              <p className="text-white leading-relaxed">
                نبتكر حلولاً فريدة ومخصصة لكل عميل، مع التركيز على الابتكار والإبداع في كل مشروع
              </p>
            </div>

            {/* نتائج متميزة */}
            <div className="bg-white/15 backdrop-blur-md rounded-3xl p-8 text-center hover:bg-white/25 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 border border-white/30">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mb-6 mx-auto shadow-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">نتائج متميزة</h3>
              <p className="text-white leading-relaxed">
                نضمن تحقيق نتائج متميزة وملموسة لكل مشروع، مع التركيز على الجودة والكفاءة العالية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">إنجازاتنا</h2>
            <p className="text-xl text-gray-600">
              أرقام تتحدث عن نجاحنا وثقة عملائنا بنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">100+</div>
              <div className="text-gray-600">مشروع مكتمل</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">50+</div>
              <div className="text-gray-600">عميل راضٍ</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">5+</div>
              <div className="text-gray-600">سنوات خبرة</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">200+</div>
              <div className="text-gray-600">متدرب</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">ابدأ مشروعك معنا اليوم</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            تواصل معنا الآن واحصل على استشارة مجانية لمشروعك التقني
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200">
              اتصل بنا
            </Link>
            <Link href="/store" className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-200">
              مركز الألعاب
            </Link>
          </div>
        </div>
      </section>

      {/* Training Courses Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">الدورات التدريبية</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              دورات تدريبية متخصصة في مجال التقنية والبرمجة بأحدث المناهج وأفضل المدربين
            </p>
          </div>
          
          <CoursesSection />
        </div>
      </section>
    </div>
  );
}
