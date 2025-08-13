'use client';

import { useState } from 'react';
import { convertToDirectLink } from '@/lib/link-converter';

interface ConvertedLink {
  originalUrl: string;
  directUrl: string;
  provider: 'google-drive' | 'dropbox' | 'unknown';
  fileName?: string;
  isValid: boolean;
}

export default function LinkConverterPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ConvertedLink | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = () => {
    if (!url.trim()) {
      alert('يرجى إدخال رابط');
      return;
    }

    setLoading(true);
    
    try {
      const converted = convertToDirectLink(url);
      setResult(converted);
    } catch (error) {
      console.error('خطأ في تحويل الرابط:', error);
      alert('حدث خطأ في تحويل الرابط');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/link-converter/test', {
        method: 'GET'
      });
      
      if (response.ok) {
        alert('تم تشغيل الاختبارات. راجع console للنتائج.');
      } else {
        alert('خطأ في تشغيل الاختبارات');
      }
    } catch (error) {
      console.error('خطأ في الاختبار:', error);
      alert('حدث خطأ في تشغيل الاختبارات');
    } finally {
      setLoading(false);
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google-drive': return 'Google Drive';
      case 'dropbox': return 'Dropbox';
      default: return 'غير معروف';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google-drive': return 'bg-blue-100 text-blue-800';
      case 'dropbox': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">محول الروابط</h1>
            <p className="text-gray-600">
              تحويل روابط Google Drive و Dropbox إلى روابط مباشرة
            </p>
          </div>

          {/* نموذج التحويل */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">تحويل الرابط</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الرابط المراد تحويله
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... أو https://dropbox.com/s/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleConvert}
                  disabled={loading || !url.trim()}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري التحويل...' : 'تحويل الرابط'}
                </button>
                
                <button
                  onClick={handleTest}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  اختبار النظام
                </button>
              </div>
            </div>
          </div>

          {/* النتيجة */}
          {result && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">نتيجة التحويل</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرابط الأصلي
                  </label>
                  <div className="bg-gray-50 p-3 rounded border break-all text-sm">
                    {result.originalUrl}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الرابط المباشر
                  </label>
                  <div className="bg-green-50 p-3 rounded border break-all text-sm">
                    {result.directUrl}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المزود
                    </label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getProviderColor(result.provider)}`}>
                      {getProviderName(result.provider)}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحالة
                    </label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      result.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.isValid ? 'صالح' : 'غير صالح'}
                    </span>
                  </div>
                  
                  {result.fileName && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        اسم الملف
                      </label>
                      <div className="bg-blue-50 p-2 rounded text-sm">
                        {result.fileName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* أمثلة */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">أمثلة على الروابط المدعومة</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Google Drive</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• https://drive.google.com/file/d/FILE_ID/view</li>
                  <li>• https://drive.google.com/open?id=FILE_ID</li>
                  <li>• https://drive.google.com/uc?id=FILE_ID</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Dropbox</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• https://www.dropbox.com/s/FILE_PATH/file.zip</li>
                  <li>• https://www.dropbox.com/sh/FILE_PATH/file.exe</li>
                </ul>
              </div>
            </div>
          </div>

          {/* معلومات تقنية */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات تقنية</h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <p>• يتم تحويل الروابط تلقائياً عند إنشاء رابط التحميل المؤقت</p>
              <p>• الروابط المباشرة تستخدم للتحميل الفعلي</p>
              <p>• الرابط الأصلي محمي ولا يتم كشفه للمستخدم</p>
              <p>• يدعم Google Drive و Dropbox حالياً</p>
              <p>• يمكن إضافة مزودين آخرين في المستقبل</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
