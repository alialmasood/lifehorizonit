'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface PurchasedGame {
  id: string;
  title: string;
  price: number;
  currency: string;
  downloadUrl: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [purchasedGame, setPurchasedGame] = useState<PurchasedGame | null>(null);

  useEffect(() => {
    const txId = searchParams.get('transactionId') || '';
    const amt = searchParams.get('amount') || '';
    const curr = searchParams.get('currency') || 'USD';

    setTransactionId(txId);
    setAmount(amt);
    setCurrency(curr);

    const gameData = localStorage.getItem('purchasingGame');
    if (gameData) {
      try {
        const game = JSON.parse(gameData);
        setPurchasedGame(game);
        localStorage.removeItem('purchasingGame');
      } catch (error) {
        console.error('خطأ في قراءة بيانات اللعبة:', error);
      }
    }
  }, [searchParams]);

  const handleDownloadGame = () => {
    if (purchasedGame?.downloadUrl) window.open(purchasedGame.downloadUrl, '_blank');
    else alert('رابط التحميل سيكون متاحاً قريباً');
  };

  const getCurrencySymbol = (c: string) => (c === 'USD' ? '$' : c === 'IQD' ? 'د.ع' : c);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">تم الدفع بنجاح!</h1>
          <p className="text-gray-600 mb-6">شكراً لك على الشراء. تمت معالجة الدفع بنجاح.</p>

          {purchasedGame && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">اللعبة المشتراة:</h3>
              <p className="text-lg font-bold text-orange-600 mb-2">{purchasedGame.title}</p>
              <p className="text-sm text-gray-600 mb-3">
                السعر: {getCurrencySymbol(purchasedGame.currency || 'USD')}
                {purchasedGame.price} {purchasedGame.currency || 'USD'}
              </p>
              {purchasedGame.downloadUrl ? (
                <button
                  onClick={handleDownloadGame}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-sm"
                >
                  تحميل اللعبة
                </button>
              ) : (
                <p className="text-sm text-gray-500">رابط التحميل سيكون متاحاً قريباً</p>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            {amount && (
              <div className="mb-3">
                <p className="text-sm text-gray-500 mb-1">المبلغ المدفوع:</p>
                <p className="text-lg font-bold text-gray-900">
                  {amount} {currency}
                </p>
              </div>
            )}
            {transactionId && (
              <div>
                <p className="text-sm text-gray-500 mb-1">رقم المعاملة:</p>
                <p className="font-mono text-sm text-gray-700 break-all">{transactionId}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = '/store')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              العودة لمركز الألعاب
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              العودة للصفحة الرئيسية
            </button>
            <button
              onClick={() => window.print()}
              className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              طباعة الإيصال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
