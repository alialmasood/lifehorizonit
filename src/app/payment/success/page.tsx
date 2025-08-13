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

interface DownloadLink {
  downloadUrl: string;
  expiresAt: string;
  maxDownloads: number;
  currentDownloads?: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('');
  const [purchasedGame, setPurchasedGame] = useState<PurchasedGame | null>(null);
  const [downloadLink, setDownloadLink] = useState<DownloadLink | null>(null);
  const [generatingLink, setGeneratingLink] = useState(false);
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
          localStorage.removeItem('purchasingGame');
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



  const generateDownloadLink = async () => {
    if (!purchasedGame) {
      alert('بيانات اللعبة غير متوفرة');
      return;
    }
    
    if (!transactionId) {
      alert('رقم المعاملة غير متوفر');
      return;
    }
    
    if (!customerEmail) {
      alert('بريد العميل غير متوفر');
      return;
    }
    
    if (!purchasedGame.id) {
      alert('معرف اللعبة غير متوفر');
      return;
    }

    setGeneratingLink(true);

    try {
      const response = await fetch('/api/download/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: purchasedGame.id,
          customerEmail: customerEmail,
          transactionId: transactionId
        }),
      });

      if (!response.ok) {
        throw new Error(`خطأ في الخادم: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setDownloadLink({
          downloadUrl: result.downloadUrl,
          expiresAt: result.expiresAt,
          maxDownloads: result.maxDownloads,
          currentDownloads: 0
        });
      } else {
        console.error('خطأ في استجابة API:', result);
        alert(`خطأ في إنشاء رابط التحميل: ${result.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('خطأ في إنشاء رابط التحميل:', error);
      if (error instanceof Error) {
        alert(`حدث خطأ أثناء إنشاء رابط التحميل: ${error.message}`);
      } else {
        alert('حدث خطأ أثناء إنشاء رابط التحميل');
      }
    } finally {
      setGeneratingLink(false);
    }
  };

  const handleDownloadGame = async () => {
    if (!downloadLink?.downloadUrl) {
      alert('يرجى إنشاء رابط التحميل أولاً');
      return;
    }

    // التحقق من عدد مرات التحميل المتبقية
    const remainingDownloads = (downloadLink.maxDownloads || 3) - (downloadLink.currentDownloads || 0);
    if (remainingDownloads <= 0) {
      alert('تم استنفاذ جميع مرات التحميل المتاحة');
      return;
    }

    try {
      console.log('بدء عملية التحميل...', downloadLink.downloadUrl);
      
      // إخفاء الرابط عن المستخدم وإجراء التحميل مباشرة
      const response = await fetch(downloadLink.downloadUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
        },
        // زيادة timeout للطلبات الكبيرة
        signal: AbortSignal.timeout(300000), // 5 دقائق
      });

      console.log('استجابة الخادم:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`خطأ في التحميل: ${response.status} ${response.statusText}`);
      }

             // الحصول على اسم الملف من headers أو الرابط
       let fileName = 'game-download';
       const contentDisposition = response.headers.get('content-disposition');
       
       if (contentDisposition) {
         const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
         if (filenameMatch && filenameMatch[1]) {
           fileName = filenameMatch[1].replace(/['"]/g, '');
         }
       } else {
         // استخراج اسم الملف من الرابط
         const url = new URL(downloadLink.downloadUrl);
         const pathParts = url.pathname.split('/');
         const urlFileName = pathParts[pathParts.length - 1];
         if (urlFileName && urlFileName.includes('.')) {
           fileName = urlFileName;
         }
       }

       console.log('اسم الملف:', fileName);

       // تحويل الاستجابة إلى blob
       const blob = await response.blob();
       console.log('حجم الملف:', blob.size, 'bytes');
      
      // إنشاء رابط تحميل مؤقت
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // إنشاء عنصر تحميل مخفي
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      link.style.display = 'none';
      
      // إضافة العنصر للصفحة وتنفيذ التحميل
      document.body.appendChild(link);
      link.click();
      
      // تنظيف الذاكرة
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
      
      // تحديث عداد التحميلات
      const newCurrentDownloads = (downloadLink.currentDownloads || 0) + 1;
      setDownloadLink({
        ...downloadLink,
        currentDownloads: newCurrentDownloads
      });
      
      // إظهار رسالة نجاح مع عدد المرات المتبقية
      const newRemainingDownloads = (downloadLink.maxDownloads || 3) - newCurrentDownloads;
      if (newRemainingDownloads > 0) {
        alert(`تم بدء تحميل اللعبة بنجاح! 🎉\nالمرات المتبقية: ${newRemainingDownloads}`);
      } else {
        alert('تم بدء تحميل اللعبة بنجاح! 🎉\nهذه كانت آخر مرة تحميل متاحة.');
      }
      
        } catch (error) {
      console.error('خطأ في تحميل اللعبة:', error);
      
      // رسائل خطأ أكثر تفصيلاً
      let errorMessage = 'حدث خطأ أثناء تحميل اللعبة. يرجى المحاولة مرة أخرى.';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'انتهت مهلة التحميل. الملف كبير جداً أو بطيء الاتصال.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'فشل في الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.';
        } else if (error.message.includes('404')) {
          errorMessage = 'الملف غير موجود أو تم حذفه.';
        } else if (error.message.includes('403')) {
          errorMessage = 'غير مسموح بالوصول للملف.';
        } else if (error.message.includes('500')) {
          errorMessage = 'خطأ في الخادم. يرجى المحاولة لاحقاً.';
        } else {
          errorMessage = `خطأ في التحميل: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    }
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
          <p className="text-gray-600 mb-6">
            شكراً لك {customerName ? `عزيزي ${customerName}` : 'عزيزي العميل'} على الشراء. تمت معالجة الدفع بنجاح.
          </p>

          {purchasedGame ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">اللعبة المشتراة:</h3>
              <p className="text-lg font-bold text-orange-600 mb-2">{purchasedGame.title}</p>
              <p className="text-sm text-gray-600 mb-3">
                السعر: {getCurrencySymbol(purchasedGame.currency || 'USD')}
                {purchasedGame.price} {purchasedGame.currency || 'USD'}
              </p>
              
                                                           {downloadLink ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700 mb-2">
                        ✅ تم إعداد التحميل بنجاح
                      </p>
                      {(() => {
                        const remainingDownloads = (downloadLink.maxDownloads || 3) - (downloadLink.currentDownloads || 0);
                        if (remainingDownloads > 0) {
                          return (
                            <p className="text-xs text-green-600">
                              المرات المتبقية: <span className="font-bold text-blue-600">{remainingDownloads}</span> من {downloadLink.maxDownloads}
                            </p>
                          );
                        } else {
                          return (
                            <p className="text-xs text-red-600 font-bold">
                              تم استنفاذ جميع مرات التحميل المتاحة
                            </p>
                          );
                        }
                      })()}
                    </div>
                    {(() => {
                      const remainingDownloads = (downloadLink.maxDownloads || 3) - (downloadLink.currentDownloads || 0);
                      if (remainingDownloads > 0) {
                        return (
                          <button
                            onClick={handleDownloadGame}
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-lg font-bold"
                          >
                            ⬇️ تحميل اللعبة الآن ({remainingDownloads} متبقي)
                          </button>
                        );
                      } else {
                        return (
                          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                            <p className="text-gray-600 font-semibold">
                              تم استنفاذ جميع مرات التحميل
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              لا يمكن التحميل مرة أخرى
                            </p>
                          </div>
                        );
                      }
                    })()}
                  </div>
              ) : (
                                 <div className="space-y-3">
                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                     <p className="text-sm text-blue-700 mb-2">
                       🔒 نظام تحميل آمن ومؤقت
                     </p>
                                                                 <p className="text-xs text-blue-600">
                         التحميل متاح لثلاث مرات - مراعاة لظروف المستخدم
                       </p>
                      <p className="text-xs text-blue-600">
                         الرابط آمن ولا يمكن مشاركته
                       </p>
                   </div>
                  <button
                    onClick={generateDownloadLink}
                    disabled={generatingLink}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingLink ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        جاري إنشاء الرابط...
                      </div>
                    ) : (
                      'إنشاء رابط التحميل'
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-900 mb-2">تحذير:</h3>
              <p className="text-sm text-yellow-700">
                لم يتم العثور على بيانات اللعبة المشتراة. يرجى التأكد من إتمام عملية الشراء بشكل صحيح.
              </p>
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
               onClick={() => {
                 const params = new URLSearchParams({
                   transactionId: transactionId,
                   amount: amount,
                   currency: currency,
                   customerEmail: customerEmail,
                   customerName: customerName
                 });
                 window.open(`/payment/receipt?${params.toString()}`, '_blank');
               }}
               className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-200"
             >
               🖨️ طباعة الإيصال
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
