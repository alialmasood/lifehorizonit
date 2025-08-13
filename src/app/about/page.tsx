'use client';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">من نحن</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
              شركة أفق الحياة لتكنولوجيا المعلومات والخدمات العامة
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">قصة الشركة</h2>
              <p className="text-lg text-gray-600 mb-6">
                تأسست شركة أفق الحياة لتكنولوجيا المعلومات والخدمات العامة بهدف تقديم حلول تقنية متكاملة ومبتكرة 
                للشركات والمؤسسات في العراق والمنطقة. بدأت رحلتنا بفريق صغير من المطورين المحترفين 
                الذين يؤمنون بقدرة التقنية على تغيير العالم.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                على مر السنين، تطورت شركتنا لتصبح شريكاً موثوقاً به في مجال التقنية، 
                حيث نقدم خدمات شاملة تشمل البرمجة وتطوير التطبيقات وبناء المواقع الإلكترونية 
                وتطوير الأنظمة الإدارية والدورات التدريبية المتخصصة.
              </p>
              <p className="text-lg text-gray-600">
                نفتخر بفريق عملنا المحترف والمتخصص، ونستخدم أحدث التقنيات والأدوات 
                لضمان تقديم خدمات عالية الجودة تلبي توقعات عملائنا وتتجاوزها.
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">قيمنا الأساسية</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold mb-2">الابتكار</h4>
                    <p className="text-orange-100">
                      نسعى دائماً لتطوير حلول مبتكرة ومتطورة تلبي احتياجات المستقبل
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">الجودة</h4>
                    <p className="text-orange-100">
                      نلتزم بأعلى معايير الجودة في جميع خدماتنا ومنتجاتنا
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-2">الموثوقية</h4>
                    <p className="text-orange-100">
                      نحرص على بناء علاقات طويلة الأمد مع عملائنا قائمة على الثقة والشفافية
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">رؤيتنا</h3>
              <p className="text-gray-600">
                أن نكون الشريك التقني الموثوق به للشركات والمؤسسات في العراق والمنطقة، 
                ونقدم حلول تقنية مبتكرة تساهم في تطوير وتقدم المجتمع وتمكين المؤسسات 
                من تحقيق أهدافها من خلال الاستفادة من أحدث التقنيات والحلول الرقمية.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">رسالتنا</h3>
              <p className="text-gray-600">
                تقديم خدمات تقنية عالية الجودة ومبتكرة، وتمكين عملائنا من تحقيق أهدافهم 
                من خلال الاستفادة من أحدث التقنيات والحلول الرقمية. نسعى لتطوير مهارات 
                الكوادر المحلية من خلال الدورات التدريبية المتخصصة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">فريق العمل</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              فريق محترف ومتخصص في مختلف مجالات التقنية والبرمجة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">أحمد محمد</h3>
              <p className="text-orange-600 font-semibold mb-3">مدير عام</p>
              <p className="text-gray-600">
                خبير في إدارة المشاريع التقنية مع خبرة تزيد عن 10 سنوات
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">سارة علي</h3>
              <p className="text-orange-600 font-semibold mb-3">مدير تطوير البرمجيات</p>
              <p className="text-gray-600">
                متخصصة في تطوير التطبيقات والمواقع الإلكترونية بأحدث التقنيات
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">محمد حسن</h3>
              <p className="text-orange-600 font-semibold mb-3">مدير التدريب</p>
              <p className="text-gray-600">
                خبير في تصميم وتقديم الدورات التدريبية المتخصصة في مجال التقنية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">إنجازاتنا</h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              أرقام تتحدث عن نجاحنا وثقة عملائنا بنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">100+</div>
              <div className="text-orange-100 text-lg">مشروع مكتمل</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-orange-100 text-lg">عميل راضٍ</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">5+</div>
              <div className="text-orange-100 text-lg">سنوات خبرة</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">200+</div>
              <div className="text-orange-100 text-lg">متدرب</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
