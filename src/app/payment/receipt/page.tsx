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

function ReceiptContent() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [purchasedGame, setPurchasedGame] = useState<PurchasedGame | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');

  useEffect(() => {
    const txId = searchParams.get('transactionId') || '';
    const amt = searchParams.get('amount') || '';
    const curr = searchParams.get('currency') || 'USD';
    const email = searchParams.get('customerEmail') || '';
    const name = searchParams.get('customerName') || '';

    setTransactionId(txId);
    setAmount(amt);
    setCurrency(curr);
    setCustomerEmail(email);
    setCustomerName(name);

    const gameData = localStorage.getItem('purchasingGame');
    if (gameData) {
      try {
        const game = JSON.parse(gameData);
        if (game && game.id && game.title) {
          setPurchasedGame(game);
        } else {
          console.error('بيانات اللعبة غير مكتملة:', game);
        }
      } catch (error) {
        console.error('خطأ في قراءة بيانات اللعبة:', error);
      }
    } else {
      console.warn('لم يتم العثور على بيانات اللعبة في localStorage');
    }
  }, [searchParams]);

  const getCurrencySymbol = (c: string) => (c === 'USD' ? '$' : c === 'IQD' ? 'د.ع' : c);

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* طباعة فقط - مخفي على الشاشة */}
      <div className="hidden print:block receipt-print">
        <div className="max-w-md mx-auto">
          {/* رأس الإيصال */}
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">إيصال دفع</h1>
            <p className="text-xs text-gray-500 mt-2">{formatDate()}</p>
          </div>

          {/* تفاصيل المعاملة */}
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-bold text-gray-900 mb-3 text-lg">تفاصيل المعاملة</h2>
              
              {transactionId && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">رقم المعاملة:</p>
                  <p className="font-mono text-sm text-gray-900 font-bold">{transactionId}</p>
                </div>
              )}
              
              {amount && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">المبلغ المدفوع:</p>
                  <p className="text-lg font-bold text-gray-900">
                    {getCurrencySymbol(currency)} {amount} {currency}
                  </p>
                </div>
              )}
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-1">تاريخ الدفع:</p>
                <p className="text-sm text-gray-900">{formatDate()}</p>
              </div>
            </div>
          </div>

          {/* تفاصيل اللعبة */}
          {purchasedGame && (
            <div className="mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="font-bold text-gray-900 mb-3 text-lg">تفاصيل اللعبة</h2>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">اسم اللعبة:</p>
                  <p className="text-lg font-bold text-blue-900">{purchasedGame.title}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">السعر:</p>
                  <p className="text-lg font-bold text-blue-900">
                    {getCurrencySymbol(purchasedGame.currency || 'USD')} 
                    {purchasedGame.price} {purchasedGame.currency || 'USD'}
                  </p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">معرف اللعبة:</p>
                  <p className="font-mono text-sm text-gray-900">{purchasedGame.id}</p>
                </div>
              </div>
            </div>
          )}

          {/* معلومات العميل */}
          <div className="mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="font-bold text-gray-900 mb-3 text-lg">معلومات العميل</h2>
              
              {customerName && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">اسم العميل:</p>
                  <p className="text-lg font-bold text-green-900">{customerName}</p>
                </div>
              )}
              
              {customerEmail && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني:</p>
                  <p className="text-sm text-green-900">{customerEmail}</p>
                </div>
              )}
            </div>
          </div>

          {/* ملاحظات */}
          <div className="mb-8">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h2 className="font-bold text-gray-900 mb-3 text-lg">ملاحظات مهمة</h2>
              <ul className="text-sm text-gray-700 space-y-2 text-right">
                <li>• هذا الإيصال صالح كدليل على إتمام عملية الدفع</li>
                <li>• احتفظ بهذا الإيصال للرجوع إليه عند الحاجة</li>
                <li>• يمكنك تحميل اللعبة من صفحة النجاح</li>
                <li>• التحميل متاح لثلاث مرات فقط</li>
              </ul>
            </div>
          </div>

          {/* تذييل الإيصال */}
          <div className="text-center border-t-2 border-gray-300 pt-4">
            <p className="text-sm text-gray-600 mb-2">شكراً لك على الشراء</p>
            <p className="text-xs text-gray-500">Thank you for your purchase</p>
          </div>
        </div>
      </div>

      {/* أزرار التحكم - مخفية عند الطباعة */}
      <div className="print:hidden max-w-md mx-auto mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">طباعة الإيصال</h2>
          
          <div className="space-y-4">
            <button
              onClick={handlePrint}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🖨️ طباعة الإيصال
            </button>
            
            <button
              onClick={handleBack}
              className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← العودة
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              سيتم طباعة الإيصال مع تفاصيل المعاملة واللعبة فقط
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={null}>
      <ReceiptContent />
    </Suspense>
  );
}
