import { NextRequest, NextResponse } from 'next/server';

interface ValidationResult {
  isValid: boolean;
  isDownloadable: boolean;
  contentType: string;
  fileSize: number;
  fileName: string;
  issues: string[];
  recommendations: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'الرابط مطلوب' },
        { status: 400 }
      );
    }

    console.log('التحقق من صحة الرابط:', url);

    const validationResult = await validateDownloadUrl(url);

    return NextResponse.json({
      success: true,
      result: validationResult
    });

  } catch (error) {
    console.error('خطأ في التحقق من الرابط:', error);
    return NextResponse.json(
      { 
        error: 'خطأ في التحقق من الرابط',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}

async function validateDownloadUrl(url: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: false,
    isDownloadable: false,
    contentType: '',
    fileSize: 0,
    fileName: '',
    issues: [],
    recommendations: []
  };

  try {
    // محاولة أولى باستخدام HEAD
    const headResponse = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
      },
      signal: AbortSignal.timeout(30000),
    });

    console.log('استجابة HEAD:', headResponse.status, headResponse.statusText);

    if (!headResponse.ok) {
      result.issues.push(`خطأ في الخادم: ${headResponse.status} ${headResponse.statusText}`);
      
      if (headResponse.status === 404) {
        result.recommendations.push('الملف غير موجود - تحقق من الرابط');
      } else if (headResponse.status === 403) {
        result.recommendations.push('غير مسموح بالوصول - قد يتطلب الملف مصادقة');
      } else if (headResponse.status === 401) {
        result.recommendations.push('يتطلب مصادقة - استخدم رابط عام');
      }
      
      return result;
    }

    const contentType = headResponse.headers.get('content-type') || '';
    const contentLength = headResponse.headers.get('content-length');
    const contentDisposition = headResponse.headers.get('content-disposition');

    result.contentType = contentType;
    result.fileSize = contentLength ? parseInt(contentLength) : 0;

    // استخراج اسم الملف
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        result.fileName = filenameMatch[1].replace(/['"]/g, '');
      }
    } else {
      // استخراج من الرابط
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const urlFileName = pathParts[pathParts.length - 1];
      if (urlFileName && urlFileName.includes('.')) {
        result.fileName = urlFileName;
      }
    }

    // التحقق من نوع المحتوى
    if (contentType.includes('text/html')) {
      result.issues.push('الخادم يعيد صفحة HTML بدلاً من ملف التحميل');
      result.recommendations.push('تحقق من صحة الرابط');
      result.recommendations.push('تأكد من أن الملف لا يتطلب مصادقة');
      result.recommendations.push('جرب فتح الرابط في المتصفح أولاً');
    } else if (isDownloadableContentType(contentType)) {
      result.isDownloadable = true;
      result.isValid = true;
    } else {
      result.issues.push(`نوع محتوى غير مدعوم: ${contentType}`);
      result.recommendations.push('تأكد من أن الرابط يشير إلى ملف قابل للتحميل');
    }

    // التحقق من الحجم
    if (result.fileSize > 0) {
      const sizeInMB = result.fileSize / 1024 / 1024;
      if (sizeInMB > 100) {
        result.issues.push(`الملف كبير جداً (${sizeInMB.toFixed(2)} MB)`);
        result.recommendations.push('فكر في تقسيم الملف أو استخدام خدمة استضافة أخرى');
      }
    }

    // التحقق من إعادة التوجيه
    if (headResponse.redirected) {
      result.issues.push('تم إعادة توجيه الرابط');
      result.recommendations.push('استخدم الرابط النهائي مباشرة');
    }

    // إذا كان HTML، حاول قراءة المحتوى للتحليل
    if (contentType.includes('text/html')) {
      try {
        const getResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          signal: AbortSignal.timeout(30000),
        });

        if (getResponse.ok) {
          const textContent = await getResponse.text();
          
          // البحث عن رسائل خطأ شائعة
          if (textContent.toLowerCase().includes('error') || 
              textContent.toLowerCase().includes('not found') ||
              textContent.toLowerCase().includes('404')) {
            result.issues.push('تم اكتشاف رسائل خطأ في الصفحة');
          }

          // محاولة استخراج عنوان الصفحة
          const titleMatch = textContent.match(/<title[^>]*>([^<]*)<\/title>/i);
          if (titleMatch) {
            result.issues.push(`عنوان الصفحة: ${titleMatch[1]}`);
          }
        }
      } catch (error) {
        console.error('خطأ في قراءة محتوى HTML:', error);
      }
    }

  } catch (error) {
    console.error('خطأ في التحقق من الرابط:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        result.issues.push('انتهت مهلة الطلب');
        result.recommendations.push('تحقق من سرعة الاتصال أو حجم الملف');
      } else if (error.message.includes('fetch')) {
        result.issues.push('فشل في الاتصال بالخادم');
        result.recommendations.push('تحقق من صحة الرابط');
        result.recommendations.push('تأكد من أن الخادم متاح');
      } else {
        result.issues.push(`خطأ في الاتصال: ${error.message}`);
      }
    }
  }

  return result;
}

function isDownloadableContentType(contentType: string): boolean {
  const downloadableTypes = [
    // ملفات الألعاب والبرامج
    'application/x-executable',
    'application/x-msdownload',
    'application/x-msi',
    'application/x-msdos-program',
    'application/octet-stream',
    
    // ملفات مضغوطة
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-gzip',
    'application/x-bzip2',
    'application/x-tar',
    
    // ملفات الوسائط
    'video/',
    'audio/',
    'image/',
    
    // ملفات المستندات
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    
    // ملفات أخرى
    'application/vnd.android.package-archive', // APK
    'application/x-ipad-app', // IPA
  ];

  return downloadableTypes.some(type => contentType.includes(type));
}
