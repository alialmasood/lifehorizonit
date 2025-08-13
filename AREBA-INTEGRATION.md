# تكامل بوابة الدفع أريبا - دليل مفصل

## نظرة عامة

هذا الدليل يوضح كيفية تكامل بوابة الدفع الخاصة بشركة أريبا في تطبيق Next.js، مطابق تماماً لتعليمات Postman المقدمة.

## البيانات المطلوبة

### بيانات المصادقة
```typescript
API_KEY: 'TESTKEYIQ3093980103'
USERNAME: 'Ali.112233445566'
PASSWORD: 'Zxxznmmn@123'
MERCHANT_ID: 'IQ3093980103'
```

### Basic Auth
```typescript
// Concatenation: Ali.112233445566:Zxxznmmn@123
// Base64 encoded: QWxpLjExMjIzMzQ0NTU2NjpaeHh6bm1tbkAxMjM=
```

## إعداد الطلب

### 1. الرابط (URL)
```
POST https://gateway.areebapayment.com/api/v3/transaction/TESTKEYIQ3093980103/debit
```

### 2. Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Basic QWxpLjExMjIzMzQ0NTU2NjpaeHh6bm1tbkAxMjM="
}
```

### 3. Body (JSON)
```json
{
  "merchantTransactionId": "TXN123456789",
  "amount": "1000",
  "currency": "IQD",
  "successUrl": "https://example.com/success",
  "cancelUrl": "https://example.com/cancel",
  "errorUrl": "https://example.com/error",
  "callbackUrl": "https://example.com/callback"
}
```

## الاستجابة المتوقعة

### نجاح الطلب
```json
{
  "returnType": "REDIRECT",
  "redirectUrl": "https://gateway.areebapayment.com/redirect/0c571fd3c105002a924f/Y2YzYTY5Nzk1M2I2MDFlOTJlMGY4NDZjZmIyZGYwOTQwNmE1Yzg3MGMyMDM1NDI1OTZmMzNjZGU0MGQyYTVmNDM1NmIxYTIxMjliMDZhYTBmMzkxZDIxMWM4YzQ3ZTk1MWUwMTcwNmU2ZGZlNDU2Y2RmNGVlZjMzYzIwZTYyMmI=",
  "merchantTransactionId": "TXN123456789"
}
```

### رابط التوجيه
الرابط المستلم من `redirectUrl` سيوجه المستخدم إلى بوابة الدفع الحقيقية من أريبا، مثل:
```
https://gateway.areebapayment.com/redirect/0c571fd3c105002a924f/Y2YzYTY5Nzk1M2I2MDFlOTJlMGY4NDZjZmIyZGYwOTQwNmE1Yzg3MGMyMDM1NDI1OTZmMzNjZGU0MGQyYTVmNDM1NmIxYTIxMjliMDZhYTBmMzkxZDIxMWM4YzQ3ZTk1MWUwMTcwNmU2ZGZlNDU2Y2RmNGVlZjMzYzIwZTYyMmI=
```

## كيفية العمل في التطبيق

### 1. بدء عملية الدفع
```typescript
// في الصفحة الرئيسية
const handlePurchase = () => {
  window.location.href = '/payment/checkout?amount=1000';
};
```

### 2. إنشاء المعاملة
```typescript
// في API route
const paymentData = {
  merchantTransactionId: generateTransactionId(), // TXN123456789
  amount: "1000",
  currency: "IQD",
  successUrl: `${origin}/payment/success?transactionId=${merchantTransactionId}&amount=${amount}&currency=IQD`,
  cancelUrl: `${origin}/payment/cancel?transactionId=${merchantTransactionId}`,
  errorUrl: `${origin}/payment/error?transactionId=${merchantTransactionId}`,
  callbackUrl: `${origin}/api/payment/callback`
};
```

### 3. إرسال الطلب
```typescript
const response = await fetch(
  `https://gateway.areebapayment.com/api/v3/transaction/TESTKEYIQ3093980103/debit`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${getBase64Auth()}`,
    },
    body: JSON.stringify(paymentData),
  }
);
```

### 4. التوجيه إلى بوابة الدفع
```typescript
const result = await response.json();
if (result.returnType === 'REDIRECT' && result.redirectUrl) {
  window.location.href = result.redirectUrl;
}
```

## اختبار النظام

### 1. تشغيل التطبيق
```bash
npm run dev
```

### 2. فتح المتصفح
```
http://localhost:3000
```

### 3. اختبار الدفع
- اضغط على "شراء الآن"
- أدخل بيانات البطاقة التجريبية
- اضغط على "إتمام الدفع"
- ستتم توجيهك إلى بوابة الدفع من أريبا

### 4. اختبار API مباشرة
```bash
node test-areeba-request.js
```

## بيانات البطاقة التجريبية

```json
{
  "cardNumber": "5123 4500 0000 0008",
  "expiryDate": "01/39",
  "securityCode": "123",
  "cardholderName": "test"
}
```

## ملاحظات مهمة

1. **merchantTransactionId**: يجب أن يكون فريداً في كل طلب
2. **currency**: استخدم "IQD" للدينار العراقي
3. **amount**: استخدم "1000" للمبلغ (1000 دينار عراقي)
4. **URLs**: تأكد من أن الروابط صحيحة وقابلة للوصول
5. **Basic Auth**: تأكد من صحة بيانات المصادقة

## استكشاف الأخطاء

### خطأ 401 (Unauthorized)
- تحقق من صحة بيانات المصادقة
- تأكد من Base64 encoding

### خطأ 400 (Bad Request)
- تحقق من صحة JSON format
- تأكد من وجود جميع الحقول المطلوبة

### خطأ 500 (Internal Server Error)
- تحقق من صحة API Key
- تأكد من أن الحساب مفعل

## المراجع

- [بوابة الدفع أريبا](https://gateway.areebapayment.com)
- [تعليمات Postman](https://gateway.areebapayment.com/redirect/0c571fd3c105002a924f/Y2YzYTY5Nzk1M2I2MDFlOTJlMGY4NDZjZmIyZGYwOTQwNmE1Yzg3MGMyMDM1NDI1OTZmMzNjZGU0MGQyYTVmNDM1NmIxYTIxMjliMDZhYTBmMzkxZDIxMWM4YzQ3ZTk1MWUwMTcwNmU2ZGZlNDU2Y2RmNGVlZjMzYzIwZTYyMmI=)

---

© 2024 متجر أريبا الإلكتروني - جميع الحقوق محفوظة 