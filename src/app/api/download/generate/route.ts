import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import crypto from 'crypto';
import { convertToDirectLink, isValidUrl } from '@/lib/link-converter';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, customerEmail, transactionId } = body;

    if (!gameId || !customerEmail || !transactionId) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة غير مكتملة' },
        { status: 400 }
      );
    }

    // التحقق من عدم وجود رابط تحميل نشط لنفس المعاملة
    const existingTokensQuery = query(
      collection(db, 'downloadTokens'),
      where('transactionId', '==', transactionId)
    );
    
    const existingTokens = await getDocs(existingTokensQuery);
    if (!existingTokens.empty) {
      // فلترة النتائج في الذاكرة - تحميل واحد فقط
      const validTokens = existingTokens.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as DownloadToken))
        .filter(token => token.currentDownloads < token.maxDownloads);
      
      if (validTokens.length > 0) {
        const existingToken = validTokens[0];
        
        return NextResponse.json({
          success: true,
          downloadUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/download/access/${existingToken.id}`,
          maxDownloads: existingToken.maxDownloads
        });
      }
    }

    // جلب معلومات اللعبة من Firebase
    const gameDoc = await getDoc(doc(db, 'games', gameId));
    if (!gameDoc.exists()) {
      return NextResponse.json(
        { error: 'اللعبة غير موجودة' },
        { status: 404 }
      );
    }

    const gameData = gameDoc.data();
    if (!gameData.downloadUrl || gameData.downloadUrl.trim() === '') {
      return NextResponse.json(
        { error: 'رابط التحميل غير متاح لهذه اللعبة' },
        { status: 400 }
      );
    }

    // تحويل الرابط إلى رابط مباشر
    const convertedLink = convertToDirectLink(gameData.downloadUrl);
    
    if (!convertedLink.isValid) {
      return NextResponse.json(
        { error: 'رابط التحميل غير صالح أو غير مدعوم' },
        { status: 400 }
      );
    }

    // التحقق من أن الرابط المباشر صالح
    if (!isValidUrl(convertedLink.directUrl)) {
      return NextResponse.json(
        { error: 'فشل في تحويل الرابط إلى رابط مباشر' },
        { status: 400 }
      );
    }

    console.log(`تم تحويل الرابط: ${convertedLink.originalUrl} -> ${convertedLink.directUrl}`);

    // التحقق من أن اللعبة نشطة
    if (!gameData.isActive) {
      return NextResponse.json(
        { error: 'اللعبة غير متاحة للتحميل حالياً' },
        { status: 400 }
      );
    }

    // توليد رمز فريد للتحميل
    const tokenId = crypto.randomBytes(32).toString('hex');
    
    // إنشاء رابط التحميل المؤقت
    const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/download/access/${tokenId}`;

    // إنشاء كائن التحميل
    const downloadToken: DownloadToken = {
      id: tokenId,
      gameId,
      originalUrl: convertedLink.directUrl, // استخدام الرابط المباشر
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 ساعة (للتنظيف فقط)
      maxDownloads: 3, // تحميل ثلاث مرات
      currentDownloads: 0,
      createdAt: new Date(),
      customerEmail,
      transactionId
    };

    // حفظ رمز التحميل في Firebase
    await setDoc(doc(db, 'downloadTokens', tokenId), downloadToken);

    console.log(`تم إنشاء رابط تحميل مؤقت للعبة ${gameId} للعميل ${customerEmail}`);

    return NextResponse.json({
      success: true,
      downloadUrl,
      maxDownloads: 3
    });

  } catch (error) {
    console.error('خطأ في إنشاء رابط التحميل:', error);
    return NextResponse.json(
      { error: 'خطأ في إنشاء رابط التحميل' },
      { status: 500 }
    );
  }
}
