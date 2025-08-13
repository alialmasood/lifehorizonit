import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('استلام إشعار دفع من بوابة أريبا:', body);

    // استخراج البيانات المهمة
    const {
      merchantTransactionId,
      transactionId,
      status,
      amount,
      currency,
      customer,
      errorCode,
      errorMessage
    } = body;

    // تسجيل تفاصيل المعاملة
    console.log(`معاملة: ${merchantTransactionId}`);
    console.log(`حالة الدفع: ${status}`);
    console.log(`المبلغ: ${amount} ${currency}`);
    
    if (customer) {
      console.log(`العميل: ${customer.firstName} ${customer.lastName}`);
      console.log(`البريد الإلكتروني: ${customer.email}`);
    }

    // التحقق من حالة الدفع
    if (status === 'SUCCESS') {
      console.log(`✅ تم الدفع بنجاح للمعاملة: ${merchantTransactionId}`);
      
      // هنا يمكنك إضافة منطق إضافي للدفع الناجح:
      // - تحديث حالة الطلب في قاعدة البيانات
      // - إرسال إشعار للمستخدم
      // - إرسال تأكيد بالبريد الإلكتروني
      // - تحديث المخزون
      
    } else if (status === 'FAILED') {
      console.log(`❌ فشل الدفع للمعاملة: ${merchantTransactionId}`);
      console.log(`رمز الخطأ: ${errorCode}`);
      console.log(`رسالة الخطأ: ${errorMessage}`);
      
      // هنا يمكنك إضافة منطق إضافي للدفع الفاشل:
      // - تحديث حالة الطلب في قاعدة البيانات
      // - إرسال إشعار للمستخدم
      // - إعادة المخزون
      
    } else if (status === 'CANCELLED') {
      console.log(`🚫 تم إلغاء الدفع للمعاملة: ${merchantTransactionId}`);
      
      // هنا يمكنك إضافة منطق إضافي للإلغاء:
      // - تحديث حالة الطلب في قاعدة البيانات
      // - إرسال إشعار للمستخدم
      // - إعادة المخزون
    }

    // حفظ تفاصيل المعاملة في السجل (يمكن استبدالها بقاعدة بيانات)
    const transactionLog = {
      timestamp: new Date().toISOString(),
      merchantTransactionId,
      transactionId,
      status,
      amount,
      currency,
      customer,
      errorCode,
      errorMessage
    };

    console.log('تفاصيل المعاملة المحفوظة:', transactionLog);

    // الرد بـ 200 OK لإعلام البوابة باستلام الإشعار
    return NextResponse.json({ 
      received: true,
      timestamp: new Date().toISOString(),
      transactionId: merchantTransactionId
    });

  } catch (error) {
    console.error('خطأ في معالجة إشعار الدفع:', error);
    return NextResponse.json(
      { error: 'خطأ في معالجة الإشعار' },
      { status: 500 }
    );
  }
}

// دعم GET requests أيضاً (في حالة استخدام GET للـ callback)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transactionId');
  const merchantTransactionId = searchParams.get('merchantTransactionId');
  const amount = searchParams.get('amount');
  const currency = searchParams.get('currency');
  
  console.log('استلام callback GET:', { 
    status, 
    transactionId, 
    merchantTransactionId,
    amount,
    currency
  });
  
  // معالجة البيانات المستلمة عبر GET
  if (status && merchantTransactionId) {
    console.log(`معاملة ${merchantTransactionId}: ${status}`);
    
    if (status === 'SUCCESS') {
      console.log(`✅ تم الدفع بنجاح للمعاملة: ${merchantTransactionId}`);
    } else if (status === 'FAILED') {
      console.log(`❌ فشل الدفع للمعاملة: ${merchantTransactionId}`);
    } else if (status === 'CANCELLED') {
      console.log(`🚫 تم إلغاء الدفع للمعاملة: ${merchantTransactionId}`);
    }
  }
  
  return NextResponse.json({ 
    received: true,
    timestamp: new Date().toISOString(),
    transactionId: merchantTransactionId
  });
} 