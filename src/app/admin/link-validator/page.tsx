'use client';

import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  isDownloadable: boolean;
  contentType: string;
  fileSize: number;
  fileName: string;
  issues: string[];
  recommendations: string[];
}

export default function LinkValidatorPage() {
  const [url, setUrl] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validateUrl = async () => {
    if (!url.trim()) {
      alert('يرجى إدخال رابط للتحقق');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    try {
      console.log('بدء التحقق من الرابط:', url);
      
      const response = await fetch('/api/download/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setValidationResult(data.result);
        console.log('نتيجة التحقق:', data.result);
      } else {
        throw new Error(data.error || 'خطأ في التحقق من الرابط');
      }

    } catch (error) {
      console.error('خطأ في التحقق من الرابط:', error);
      alert(`خطأ في التحقق من الرابط: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    } finally {
      setIsValidating(false);
    }
  };

  const clearResults = () => {
    setValidationResult(null);
    setUrl('');
  };

  const getStatusColor = (isValid: boolean, isDownloadable: boolean) => {
    if (isValid && isDownloadable) return 'text-green-600';
    if (isValid && !isDownloadable) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = (isValid: boolean, isDownloadable: boolean) => {
    if (isValid && isDownloadable) return '✅ رابط صالح وقابل للتحميل';
    if (isValid && !isDownloadable) return '⚠️ رابط صالح ولكن قد لا يكون قابل للتحميل';
    return '❌ رابط غير صالح';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            التحقق من صحة الروابط
          </h1>

          <div className="space-y-6">
            {/* إدخال الرابط */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط الملف للتحقق:
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/file.zip"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* أزرار التحكم */}
            <div className="flex space-x-4 space-x-reverse">
              <button
                onClick={validateUrl}
                disabled={isValidating || !url.trim()}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? 'جاري التحقق...' : '🔍 التحقق من الرابط'}
              </button>
              
              <button
                onClick={clearResults}
                disabled={isValidating}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                مسح النتائج
              </button>
            </div>

            {/* نتائج التحقق */}
            {validationResult && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">نتائج التحقق:</h2>
                
                <div className="space-y-4">
                  {/* حالة الرابط */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">حالة الرابط:</h3>
                    <p className={`text-lg font-semibold ${getStatusColor(validationResult.isValid, validationResult.isDownloadable)}`}>
                      {getStatusText(validationResult.isValid, validationResult.isDownloadable)}
                    </p>
                  </div>

                  {/* معلومات الملف */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-blue-900 mb-2">معلومات الملف:</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-blue-700 mb-1">اسم الملف:</p>
                          <p className="font-mono text-sm text-blue-900">
                            {validationResult.fileName || 'غير محدد'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 mb-1">نوع المحتوى:</p>
                          <p className="font-mono text-sm text-blue-900">
                            {validationResult.contentType || 'غير محدد'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 mb-1">حجم الملف:</p>
                          <p className="font-mono text-sm text-blue-900">
                            {validationResult.fileSize > 0 
                              ? `${(validationResult.fileSize / 1024 / 1024).toFixed(2)} MB`
                              : 'غير محدد'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-bold text-green-900 mb-2">قابلية التحميل:</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-green-700 mb-1">صالح:</p>
                          <p className="font-semibold text-green-900">
                            {validationResult.isValid ? 'نعم' : 'لا'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700 mb-1">قابل للتحميل:</p>
                          <p className="font-semibold text-green-900">
                            {validationResult.isDownloadable ? 'نعم' : 'لا'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* المشاكل والتوصيات */}
                  {validationResult.issues.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-bold text-red-900 mb-2">المشاكل المكتشفة:</h3>
                      <ul className="text-red-700 space-y-1">
                        {validationResult.issues.map((issue, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validationResult.recommendations.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-blue-900 mb-2">التوصيات:</h3>
                      <ul className="text-blue-700 space-y-1">
                        {validationResult.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* معلومات مساعدة */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-2">أنواع الملفات المدعومة:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
                <div>
                  <h4 className="font-semibold mb-2">ملفات الألعاب والبرامج:</h4>
                  <ul className="space-y-1">
                    <li>• .exe, .msi, .zip, .rar, .7z</li>
                    <li>• .iso, .bin, .dat</li>
                    <li>• .apk, .ipa</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">ملفات الوسائط والمستندات:</h4>
                  <ul className="space-y-1">
                    <li>• .mp4, .avi, .mp3, .wav</li>
                    <li>• .jpg, .png, .pdf</li>
                    <li>• .doc, .docx, .txt</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* نصائح إضافية */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">نصائح مهمة:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• تأكد من أن الرابط يدعم التحميل المباشر</li>
                <li>• تجنب الروابط التي تتطلب مصادقة خاصة</li>
                <li>• تحقق من أن الملف لا يتجاوز 100 MB</li>
                <li>• جرب فتح الرابط في المتصفح أولاً</li>
                <li>• استخدم خدمات استضافة موثوقة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
