'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentCancel() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    const txId = searchParams.get('transactionId') || '';
    setTransactionId(txId);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          {/* Cancel Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">تم إلغاء الدفع</h1>
          <p className="text-gray-600 mb-6">
            تم إلغاء عملية الدفع. لم يتم خصم أي مبلغ من حسابك.
          </p>

          {/* Transaction ID */}
          {transactionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">رقم المعاملة الملغية:</p>
              <p className="font-mono text-sm text-gray-700 break-all">{transactionId}</p>
            </div>
          )}

          {/* Info Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              إذا كنت ترغب في إكمال عملية الشراء، يمكنك العودة والضغط على زر الشراء مرة أخرى. 
              سيتم إنشاء معاملة جديدة.
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