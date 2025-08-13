'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ErrorContent() {
  const searchParams = useSearchParams();
  const [errorType, setErrorType] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const type = searchParams.get('type') || '';
    const message = searchParams.get('message') || '';

    setErrorType(type);
    setErrorMessage(message);
  }, [searchParams]);

  const getErrorInfo = () => {
    switch (errorType) {
             case 'max_downloads':
         return {
           title: 'تم استنفاذ عدد مرات التحميل',
           description: 'تم استخدام جميع مرات التحميل الثلاث المتاحة. لا يمكن التحميل مرة أخرى.',
           icon: '🔒'
         };
      case 'invalid':
        return {
          title: 'رابط التحميل غير صحيح',
          description: 'الرابط غير صحيح أو تم حذفه. يرجى إنشاء رابط جديد.',
          icon: '❌'
        };
      case 'download_failed':
        return {
          title: 'فشل في تحميل الملف',
          description: 'حدث خطأ أثناء تحميل الملف. يرجى المحاولة مرة أخرى.',
          icon: '📁'
        };
      default:
        return {
          title: 'خطأ في التحميل',
          description: errorMessage || 'حدث خطأ أثناء محاولة التحميل.',
          icon: '⚠️'
        };
    }
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">{errorInfo.icon}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{errorInfo.title}</h1>
          <p className="text-gray-600 mb-6">{errorInfo.description}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">معلومات مهمة:</h3>
                         <ul className="text-sm text-blue-700 space-y-1 text-right">
               <li>• يمكن استخدام الرابط لثلاث مرات تحميل</li>
               <li>• لا يمكن التحميل مرة أخرى بعد استنفاذ المرات الثلاث</li>
               <li>• الرابط آمن ولا يمكن مشاركته مع الآخرين</li>
             </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = '/payment/success')}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
            >
              العودة لصفحة النجاح
            </button>
            <button
              onClick={() => (window.location.href = '/store')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              العودة لمركز الألعاب
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ErrorContent />
    </Suspense>
  );
}
