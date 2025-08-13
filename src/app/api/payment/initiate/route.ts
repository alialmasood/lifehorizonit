import { NextRequest, NextResponse } from 'next/server';
import { AREEBA_CONFIG, generateTransactionId, getBase64Auth } from '@/lib/areeba-config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      amount, 
      customerEmail, 
      customerName, 
      customerAddress, 
      customerPhone,
      gameId,
      gameTitle,
      gameCurrency 
    } = body;

    // التحقق من البيانات المطلوبة
    if (!amount || !customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة غير مكتملة' },
        { status: 400 }
      );
    }

    // إنشاء معرف المعاملة الفريد (يضمن عدم تكرار المعاملات)
    const merchantTransactionId = generateTransactionId();
    
    console.log(`بدء معاملة جديدة: ${merchantTransactionId}`);
    console.log(`المبلغ: ${amount} IQD`);
    console.log(`العميل: ${customerName} (${customerEmail})`);
    if (customerAddress) console.log(`العنوان: ${customerAddress}`);
    if (customerPhone) console.log(`الهاتف: ${customerPhone}`);
    if (gameTitle) console.log(`اللعبة: ${gameTitle}`);
    if (gameCurrency) console.log(`عملة اللعبة: ${gameCurrency}`);

    // تحضير بيانات الطلب - مطابق تماماً لتعليمات Postman
    // إرسال البيانات الأساسية فقط التي يدعمها أريبا
    const paymentData = {
      merchantTransactionId,
      amount: amount.toString(),
      currency: "IQD",
      successUrl: `${request.nextUrl.origin}/payment/success?transactionId=${merchantTransactionId}&amount=${amount}&currency=IQD&customerEmail=${encodeURIComponent(customerEmail)}&customerName=${encodeURIComponent(customerName)}`,
      cancelUrl: `${request.nextUrl.origin}/payment/cancel?transactionId=${merchantTransactionId}`,
      errorUrl: `${request.nextUrl.origin}/payment/error?transactionId=${merchantTransactionId}`,
      callbackUrl: `${request.nextUrl.origin}/api/payment/callback`
    };

    console.log('بيانات الدفع المرسلة:', paymentData);

    // إرسال الطلب إلى بوابة الدفع - مطابق لتعليمات Postman
    const response = await fetch(
      `${AREEBA_CONFIG.BASE_URL}/transaction/${AREEBA_CONFIG.API_KEY}/debit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${getBase64Auth()}`,
        },
        body: JSON.stringify(paymentData),
      }
    );

    const result = await response.json();
    console.log('استجابة بوابة الدفع:', result);

    if (!response.ok) {
      console.error('خطأ في بوابة الدفع:', result);
      return NextResponse.json(
        { error: 'خطأ في الاتصال ببوابة الدفع', details: result },
        { status: response.status }
      );
    }

    // التحقق من نوع الاستجابة
    if (result.returnType === 'REDIRECT' && result.redirectUrl) {
      console.log(`✅ تم إنشاء معاملة بنجاح: ${merchantTransactionId}`);
      console.log(`رابط التوجيه: ${result.redirectUrl}`);
      
      // حفظ معلومات العميل الإضافية في localStorage أو قاعدة البيانات
      // يمكن إضافتها لاحقاً عند الحاجة
      
      return NextResponse.json({
        success: true,
        redirectUrl: result.redirectUrl,
        transactionId: merchantTransactionId,
        amount: amount,
        currency: "IQD"
      });
    } else {
      console.error('استجابة غير متوقعة من بوابة الدفع:', result);
      return NextResponse.json(
        { error: 'استجابة غير متوقعة من بوابة الدفع', details: result },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('خطأ في معالجة الدفع:', error);
    return NextResponse.json(
      { error: 'خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
} 