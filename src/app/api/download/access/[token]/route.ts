import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface DownloadToken {
  id: string;
  gameId: string;
  originalUrl: string;
  expiresAt: Date;
  maxDownloads: number;
  currentDownloads: number;
  createdAt: Date;
  customerEmail: string;
  transactionId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;

    if (!token) {
      return NextResponse.json(
        { error: 'رمز التحميل مطلوب' },
        { status: 400 }
      );
    }

    // جلب رمز التحميل من Firebase
    const tokenDoc = await getDoc(doc(db, 'downloadTokens', token));
    
    if (!tokenDoc.exists()) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/error?type=invalid&message=رابط التحميل غير صحيح أو منتهي الصلاحية`
      );
    }

    const tokenData = tokenDoc.data() as DownloadToken;



    // التحقق من عدد مرات التحميل
    if (tokenData.currentDownloads >= tokenData.maxDownloads) {
      // حذف الرابط بعد استنفاذ عدد التحميلات
      await deleteDoc(doc(db, 'downloadTokens', token));
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/error?type=max_downloads&message=تم استنفاذ عدد مرات التحميل المسموحة`
      );
    }

    // زيادة عداد التحميلات
    const newDownloadCount = tokenData.currentDownloads + 1;
    await updateDoc(doc(db, 'downloadTokens', token), {
      currentDownloads: newDownloadCount
    });

    // إذا تم استنفاذ عدد التحميلات، احذف الرابط
    if (newDownloadCount >= tokenData.maxDownloads) {
      await deleteDoc(doc(db, 'downloadTokens', token));
    }

    console.log(`تم الوصول للتحميل: ${tokenData.gameId} للعميل ${tokenData.customerEmail}`);

    // جلب الملف من الرابط الأصلي وإرجاعه مباشرة
    try {
      console.log('جاري جلب الملف من:', tokenData.originalUrl);
      
      const fileResponse = await fetch(tokenData.originalUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'none',
          'Cache-Control': 'no-cache',
        },
        // زيادة timeout للطلبات الكبيرة
        signal: AbortSignal.timeout(300000), // 5 دقائق
        redirect: 'follow',
      });
      
      console.log('استجابة الملف:', fileResponse.status, fileResponse.statusText);
      console.log('URL النهائي:', fileResponse.url);
      
      if (!fileResponse.ok) {
        throw new Error(`خطأ في جلب الملف: ${fileResponse.status} ${fileResponse.statusText}`);
      }

      // الحصول على نوع الملف واسمه
      const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
      const contentDisposition = fileResponse.headers.get('content-disposition');
      const contentLength = fileResponse.headers.get('content-length');
      
      console.log('نوع المحتوى:', contentType);
      console.log('حجم الملف:', contentLength, 'bytes');
      
      // التحقق من أن الاستجابة ليست HTML
      if (contentType.includes('text/html') || contentType.includes('text/plain')) {
        console.error('الاستجابة هي HTML بدلاً من ملف:', contentType);
        
        // محاولة قراءة المحتوى للتحقق
        const textContent = await fileResponse.text();
        console.log('محتوى الاستجابة (أول 500 حرف):', textContent.substring(0, 500));
        
        throw new Error('الخادم يعيد صفحة HTML بدلاً من الملف المطلوب. قد يكون الرابط غير صحيح أو يتطلب مصادقة.');
      }
      
      // استخراج اسم الملف من Content-Disposition أو من الرابط
      let fileName = 'game-download';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          fileName = filenameMatch[1].replace(/['"]/g, '');
        }
      } else {
        // استخراج اسم الملف من الرابط
        const url = new URL(fileResponse.url);
        const pathParts = url.pathname.split('/');
        const urlFileName = pathParts[pathParts.length - 1];
        if (urlFileName && urlFileName.includes('.')) {
          fileName = urlFileName;
        }
      }

      console.log('اسم الملف:', fileName);

      // تحويل الملف إلى ArrayBuffer
      const arrayBuffer = await fileResponse.arrayBuffer();
      
      console.log('تم تحويل الملف، الحجم:', arrayBuffer.byteLength, 'bytes');
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('الملف فارغ أو غير صالح');
      }

      // التحقق من أن الملف ليس HTML (فحص إضافي)
      const firstBytes = new Uint8Array(arrayBuffer.slice(0, 100));
      const firstChars = new TextDecoder().decode(firstBytes);
      if (firstChars.toLowerCase().includes('<!doctype') || firstChars.toLowerCase().includes('<html')) {
        throw new Error('المحتوى المستلم هو صفحة HTML وليس ملف التحميل المطلوب');
      }

      // إرجاع الملف مباشرة
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Content-Length': arrayBuffer.byteLength.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type, Content-Disposition'
        }
      });

    } catch (error) {
      console.error('خطأ في جلب الملف:', error);
      
      let errorMessage = 'فشل في تحميل الملف';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'انتهت مهلة التحميل - الملف كبير جداً';
        } else if (error.message.includes('404')) {
          errorMessage = 'الملف غير موجود';
        } else if (error.message.includes('403')) {
          errorMessage = 'غير مسموح بالوصول للملف';
        } else {
          errorMessage = error.message;
        }
      }
      
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/error?type=download_failed&message=${encodeURIComponent(errorMessage)}`
      );
    }

  } catch (error) {
    console.error('خطأ في الوصول للتحميل:', error);
    return NextResponse.json(
      { error: 'خطأ في الوصول للتحميل' },
      { status: 500 }
    );
  }
}
