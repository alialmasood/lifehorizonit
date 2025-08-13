'use client';

import { useState } from 'react';

interface LinkDiagnostic {
  url: string;
  status: 'pending' | 'checking' | 'success' | 'error';
  result?: any;
  error?: string;
}

export default function LinkDiagnosticsPage() {
  const [links, setLinks] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState<LinkDiagnostic[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    if (!links.trim()) {
      alert('يرجى إدخال الروابط للفحص');
      return;
    }

    const linkList = links.split('\n').filter(link => link.trim());
    if (linkList.length === 0) {
      alert('لم يتم العثور على روابط صحيحة');
      return;
    }

    setIsRunning(true);
    const newDiagnostics: LinkDiagnostic[] = linkList.map(url => ({
      url: url.trim(),
      status: 'pending'
    }));
    setDiagnostics(newDiagnostics);

    for (let i = 0; i < newDiagnostics.length; i++) {
      const diagnostic = newDiagnostics[i];
      
      // تحديث الحالة إلى "جاري الفحص"
      setDiagnostics(prev => prev.map((d, index) => 
        index === i ? { ...d, status: 'checking' } : d
      ));

      try {
        console.log(`فحص الرابط: ${diagnostic.url}`);
        
        const response = await fetch(diagnostic.url, {
          method: 'HEAD', // استخدام HEAD للفحص السريع
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(30000), // 30 ثانية
        });

        const result = {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
          url: response.url,
          finalUrl: response.url,
          redirected: response.redirected,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
          contentDisposition: response.headers.get('content-disposition'),
        };

        // تحليل النتيجة
        const analysis = analyzeResponse(result);
        
        setDiagnostics(prev => prev.map((d, index) => 
          index === i ? { 
            ...d, 
            status: 'success', 
            result: { ...result, analysis }
          } : d
        ));

      } catch (error) {
        console.error(`خطأ في فحص الرابط ${diagnostic.url}:`, error);
        
        setDiagnostics(prev => prev.map((d, index) => 
          index === i ? { 
            ...d, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'خطأ غير معروف'
          } : d
        ));
      }

      // انتظار قليل بين الطلبات
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRunning(false);
  };

  const analyzeResponse = (result: any) => {
    const analysis = {
      isDownloadable: false,
      issues: [] as string[],
      recommendations: [] as string[],
      contentType: result.contentType || 'غير محدد',
      fileSize: result.contentLength ? `${(parseInt(result.contentLength) / 1024 / 1024).toFixed(2)} MB` : 'غير محدد'
    };

    // فحص نوع المحتوى
    if (result.contentType) {
      if (result.contentType.includes('text/html')) {
        analysis.issues.push('الخادم يعيد صفحة HTML بدلاً من ملف التحميل');
        analysis.recommendations.push('تحقق من صحة الرابط');
        analysis.recommendations.push('تأكد من أن الملف لا يتطلب مصادقة');
      } else if (result.contentType.includes('application/') || 
                 result.contentType.includes('image/') ||
                 result.contentType.includes('video/') ||
                 result.contentType.includes('audio/')) {
        analysis.isDownloadable = true;
      } else {
        analysis.issues.push(`نوع محتوى غير معروف: ${result.contentType}`);
      }
    }

    // فحص الحجم
    if (result.contentLength) {
      const sizeInMB = parseInt(result.contentLength) / 1024 / 1024;
      if (sizeInMB > 100) {
        analysis.issues.push('الملف كبير جداً (أكثر من 100 MB)');
        analysis.recommendations.push('فكر في تقسيم الملف أو استخدام خدمة استضافة أخرى');
      }
    }

    // فحص إعادة التوجيه
    if (result.redirected) {
      analysis.issues.push('تم إعادة توجيه الرابط');
      analysis.recommendations.push('استخدم الرابط النهائي مباشرة');
    }

    // فحص الحالة
    if (!result.ok) {
      analysis.issues.push(`خطأ في الخادم: ${result.status} ${result.statusText}`);
      if (result.status === 404) {
        analysis.recommendations.push('الملف غير موجود - تحقق من الرابط');
      } else if (result.status === 403) {
        analysis.recommendations.push('غير مسموح بالوصول - قد يتطلب الملف مصادقة');
      }
    }

    return analysis;
  };

  const clearResults = () => {
    setDiagnostics([]);
    setLinks('');
  };

  const exportResults = () => {
    const report = {
      timestamp: new Date().toISOString(),
      totalLinks: diagnostics.length,
      successful: diagnostics.filter(d => d.status === 'success').length,
      failed: diagnostics.filter(d => d.status === 'error').length,
      results: diagnostics
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `link-diagnostics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            تشخيص متقدم للروابط
          </h1>

          <div className="space-y-6">
            {/* إدخال الروابط */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الروابط للفحص (رابط واحد في كل سطر):
              </label>
              <textarea
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="https://example.com/file1.zip&#10;https://example.com/file2.rar&#10;https://example.com/file3.exe"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* أزرار التحكم */}
            <div className="flex space-x-4 space-x-reverse">
              <button
                onClick={runDiagnostics}
                disabled={isRunning || !links.trim()}
                className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? 'جاري الفحص...' : '🔍 بدء التشخيص'}
              </button>
              
              <button
                onClick={clearResults}
                disabled={isRunning}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                مسح النتائج
              </button>
              
              {diagnostics.length > 0 && (
                <button
                  onClick={exportResults}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                >
                  📊 تصدير النتائج
                </button>
              )}
            </div>

            {/* النتائج */}
            {diagnostics.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  نتائج التشخيص ({diagnostics.length} رابط)
                </h2>
                
                <div className="space-y-4">
                  {diagnostics.map((diagnostic, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 truncate flex-1">
                          {diagnostic.url}
                        </h3>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {diagnostic.status === 'pending' && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">في الانتظار</span>
                          )}
                          {diagnostic.status === 'checking' && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                              جاري الفحص
                            </span>
                          )}
                          {diagnostic.status === 'success' && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">نجح</span>
                          )}
                          {diagnostic.status === 'error' && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded">فشل</span>
                          )}
                        </div>
                      </div>

                      {diagnostic.status === 'success' && diagnostic.result && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">الحالة:</p>
                              <p className="font-mono text-sm text-gray-900">
                                {diagnostic.result.status} {diagnostic.result.statusText}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">نوع المحتوى:</p>
                              <p className="font-mono text-sm text-gray-900">
                                {diagnostic.result.analysis.contentType}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">الحجم:</p>
                              <p className="font-mono text-sm text-gray-900">
                                {diagnostic.result.analysis.fileSize}
                              </p>
                            </div>
                          </div>

                          {/* التحليل */}
                          <div>
                            <p className="text-sm text-gray-600 mb-2">التحليل:</p>
                            <div className="space-y-2">
                              {diagnostic.result.analysis.isDownloadable ? (
                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                  <p className="text-green-700 text-sm">✅ الرابط قابل للتحميل</p>
                                </div>
                              ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                  <p className="text-yellow-700 text-sm">⚠️ الرابط قد لا يكون قابل للتحميل</p>
                                </div>
                              )}

                              {diagnostic.result.analysis.issues.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded p-2">
                                  <p className="text-red-700 text-sm font-bold mb-1">المشاكل المكتشفة:</p>
                                  <ul className="text-red-700 text-sm space-y-1">
                                    {diagnostic.result.analysis.issues.map((issue, i) => (
                                      <li key={i}>• {issue}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {diagnostic.result.analysis.recommendations.length > 0 && (
                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                  <p className="text-blue-700 text-sm font-bold mb-1">التوصيات:</p>
                                  <ul className="text-blue-700 text-sm space-y-1">
                                    {diagnostic.result.analysis.recommendations.map((rec, i) => (
                                      <li key={i}>• {rec}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {diagnostic.status === 'error' && diagnostic.error && (
                        <div className="bg-red-50 border border-red-200 rounded p-3">
                          <p className="text-red-700 text-sm">
                            <strong>خطأ:</strong> {diagnostic.error}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* معلومات مساعدة */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">معلومات مساعدة:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• استخدم هذه الأداة لفحص مجموعة من الروابط دفعة واحدة</li>
                <li>• الأداة تفحص نوع المحتوى والحجم وإمكانية التحميل</li>
                <li>• يمكن تصدير النتائج كملف JSON للمراجعة لاحقاً</li>
                <li>• الروابط التي تعيد HTML قد تكون غير صحيحة أو تتطلب مصادقة</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
