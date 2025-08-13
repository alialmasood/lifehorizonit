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
      const fileResponse = await fetch(tokenData.originalUrl);
      
      if (!fileResponse.ok) {
        throw new Error(`خطأ في جلب الملف: ${fileResponse.status}`);
      }

      // الحصول على نوع الملف واسمه
      const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
      const contentDisposition = fileResponse.headers.get('content-disposition');
      
      // استخراج اسم الملف من Content-Disposition أو من الرابط
      let fileName = 'game-download';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          fileName = filenameMatch[1].replace(/['"]/g, '');
        }
      } else {
        // استخراج اسم الملف من الرابط
        const url = new URL(tokenData.originalUrl);
        const pathParts = url.pathname.split('/');
        const urlFileName = pathParts[pathParts.length - 1];
        if (urlFileName && urlFileName.includes('.')) {
          fileName = urlFileName;
        }
      }

      // تحويل الملف إلى ArrayBuffer
      const arrayBuffer = await fileResponse.arrayBuffer();

      // إرجاع الملف مباشرة
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

    } catch (error) {
      console.error('خطأ في جلب الملف:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/error?type=download_failed&message=فشل في تحميل الملف`
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
