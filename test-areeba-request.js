// ملف اختبار لإرسال طلب إلى بوابة أريبا - مطابق لتعليمات Postman
// يمكنك تشغيله باستخدام: node test-areeba-request.js

const fetch = require('node-fetch');

// البيانات المطلوبة - مطابقة لتعليمات Postman
const API_KEY = 'TESTKEYIQ3093980103';
const USERNAME = 'Ali.112233445566';
const PASSWORD = 'Zxxznmmn@123';

// إنشاء Basic Auth
const credentials = `${USERNAME}:${PASSWORD}`;
const base64Auth = Buffer.from(credentials).toString('base64');

// بيانات الطلب - مطابقة تماماً لتعليمات Postman
const paymentData = {
  merchantTransactionId: `TXN${Date.now()}`, // يتغير في كل طلب
  amount: "1000",
  currency: "IQD",
  successUrl: "https://example.com/success",
  cancelUrl: "https://example.com/cancel",
  errorUrl: "https://example.com/error",
  callbackUrl: "https://example.com/callback"
};

async function testAreebaRequest() {
  try {
    console.log('🚀 بدء اختبار طلب أريبا - مطابق لتعليمات Postman...');
    console.log('📋 بيانات الطلب:', JSON.stringify(paymentData, null, 2));
    console.log('🔑 Basic Auth:', base64Auth);
    
    const response = await fetch(
      `https://gateway.areebapayment.com/api/v3/transaction/${API_KEY}/debit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${base64Auth}`,
        },
        body: JSON.stringify(paymentData),
      }
    );

    const result = await response.json();
    
    console.log('📊 رمز الاستجابة:', response.status);
    console.log('📄 استجابة أريبا:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.returnType === 'REDIRECT') {
      console.log('✅ تم إنشاء المعاملة بنجاح!');
      console.log('🔗 رابط التوجيه:', result.redirectUrl);
      console.log('📝 معرف المعاملة:', result.merchantTransactionId);
    } else {
      console.log('❌ فشل في إنشاء المعاملة');
    }
    
  } catch (error) {
    console.error('💥 خطأ في الطلب:', error);
  }
}

// تشغيل الاختبار
testAreebaRequest(); 