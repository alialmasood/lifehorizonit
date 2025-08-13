'use client';

import { useState } from 'react';

export default function DownloadTestPage() {
  const [testUrl, setTestUrl] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testDownload = async () => {
    if (!testUrl) {
      alert('يرجى إدخال رابط للاختبار');
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('بدء اختبار التحميل من:', testUrl);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
        signal: AbortSignal.timeout(300000), // 5 دقائق
      });

      console.log('استجابة الاختبار:', response.status, response.statusText);

      const result = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        type: response.type,
        redirected: response.redirected,
      };

      if (response.ok) {
        const blob = await response.blob();
        result.fileSize = blob.size;
        result.fileType = blob.type;
        result.fileName = 'test-file';
        
        // محاولة استخراج اسم الملف من headers
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            result.fileName = filenameMatch[1].replace(/['"]/g, '');
          }
        }
      }

      setTestResult(result);
      console.log('نتيجة الاختبار:', result);

    } catch (error) {
      console.error('خطأ في اختبار التحميل:', error);
      setTestResult({
        error: true,
        message: error instanceof Error ? error.message : 'خطأ غير معروف',
        name: error instanceof Error ? error.name : 'UnknownError'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectDownload = async () => {
    if (!testUrl) {
      alert('يرجى إدخال رابط للاختبار');
      return;
    }

    try {
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
        signal: AbortSignal.timeout(300000),
      });

      if (!response.ok) {
        throw new Error(`خطأ في التحميل: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'test-download';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);

      alert('تم بدء التحميل المباشر بنجاح!');

    } catch (error) {
      console.error('خطأ في التحميل المباشر:', error);
      alert(`خطأ في التحميل المباشر: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            اختبار نظام التحميل
          </h1>

          <div className="space-y-6">
            {/* إدخال الرابط */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط الملف للاختبار:
              </label>
              <input
                type="url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://example.com/file.zip"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* أزرار الاختبار */}
            <div className="flex space-x-4 space-x-reverse">
              <button
                onClick={testDownload}
                disabled={isLoading || !testUrl}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'جاري الاختبار...' : '🔍 اختبار الرابط'}
              </button>
              
              <button
                onClick={testDirectDownload}
                disabled={isLoading || !testUrl}
                className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⬇️ اختبار التحميل المباشر
              </button>
            </div>

            {/* نتائج الاختبار */}
            {testResult && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">نتائج الاختبار:</h2>
                
                {testResult.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-bold text-red-900 mb-2">خطأ في الاختبار:</h3>
                    <p className="text-red-700 mb-2">النوع: {testResult.name}</p>
                    <p className="text-red-700">الرسالة: {testResult.message}</p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-900 mb-2">تم الاختبار بنجاح:</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">الحالة:</p>
                        <p className="font-mono text-sm text-gray-900">
                          {testResult.status} {testResult.statusText}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">نوع الملف:</p>
                        <p className="font-mono text-sm text-gray-900">
                          {testResult.fileType || 'غير محدد'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">حجم الملف:</p>
                        <p className="font-mono text-sm text-gray-900">
                          {testResult.fileSize ? `${(testResult.fileSize / 1024 / 1024).toFixed(2)} MB` : 'غير محدد'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 mb-1">اسم الملف:</p>
                        <p className="font-mono text-sm text-gray-900">
                          {testResult.fileName || 'غير محدد'}
                        </p>
                      </div>
                    </div>

                    {/* Headers */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Headers:</p>
                      <div className="bg-gray-100 p-3 rounded text-xs font-mono max-h-40 overflow-y-auto">
                        {Object.entries(testResult.headers).map(([key, value]) => (
                          <div key={key} className="mb-1">
                            <span className="text-blue-600">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* معلومات مساعدة */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">معلومات مساعدة:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• استخدم هذه الصفحة لاختبار روابط التحميل قبل إضافتها</li>
                <li>• تأكد من أن الرابط يدعم التحميل المباشر</li>
                <li>• تحقق من أن الملف لا يتجاوز الحد الأقصى المسموح</li>
                <li>• راجع سجلات الخادم للحصول على مزيد من التفاصيل</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
