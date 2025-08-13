'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentError() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>('حدث خطأ أثناء معالجة الدفع');
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    const error = searchParams.get('error') || '';
    const txId = searchParams.get('transactionId') || '';
    
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
    setTransactionId(txId);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">فشل في الدفع</h1>
          <p className="text-gray-600 mb-6">
            {errorMessage}
          </p>

          {/* Transaction ID */}
          {transactionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">رقم المعاملة الفاشلة:</p>
              <p className="font-mono text-sm text-gray-700 break-all">{transactionId}</p>
            </div>
          )}

          {/* Help Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              يمكنك المحاولة مرة أخرى أو التواصل مع خدمة العملاء للحصول على المساعدة. 
              سيتم إنشاء معاملة جديدة عند المحاولة مرة أخرى.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              العودة للصفحة الرئيسية
            </button>
            
            <button
              onClick={() => window.location.href = '/payment/checkout?amount=9.99'}
              className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              المحاولة مرة أخرى
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 