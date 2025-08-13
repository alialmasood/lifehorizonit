'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const amount = searchParams.get('amount') || '9.99';

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '5123 4500 0000 0008',
    expiryDate: '01/39',
    securityCode: '123',
    cardholderName: 'test'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (name === 'securityCode') {
      const formatted = value.replace(/\D/g, '').substring(0, 4);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.cardNumber.replace(/\s/g, '') ||
      !formData.expiryDate ||
      !formData.securityCode ||
      !formData.cardholderName
    ) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          customerName: formData.cardholderName,
          customerEmail: 'test@example.com'
        })
      });

      const result = await response.json();
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        alert(result.error || 'حدث خطأ أثناء بدء عملية الدفع');
      }
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      alert('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إتمام الدفع</h1>
          <p className="text-gray-600">أدخل بيانات بطاقتك الائتمانية</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">المبلغ المطلوب</p>
            <p className="text-2xl font-bold text-gray-900">{amount} دينار عراقي</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-xs text-yellow-700">
              تم ملء النموذج ببيانات البطاقة التجريبية. يمكنك تعديلها أو استخدامها كما هي للاختبار.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                رقم البطاقة *
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>

            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                اسم حامل البطاقة *
              </label>
              <input
                type="text"
                id="cardholderName"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="الاسم كما يظهر على البطاقة"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الانتهاء *
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>

              <div>
                <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700 mb-2">
                  رمز الأمان *
                </label>
                <input
                  type="text"
                  id="securityCode"
                  name="securityCode"
                  value={formData.securityCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                بياناتك محمية ومشفرة. لن نشارك معلوماتك مع أي طرف ثالث.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري المعالجة...' : 'إتمام الدفع'}
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = '/')}
              className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              إلغاء
            </button>
          </form>
        </div>

        <div className="text-center mt-8 text-gray-500">
          <p>© 2024 متجر أريبا الإلكتروني - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
