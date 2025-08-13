'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

interface Game {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  currency: string; // إضافة حقل العملة
  platform: string;
  imageUrl: string;
  videoUrl: string;
  downloadUrl: string;
  features: string;
  classification: string;
  isActive: boolean;
  createdAt: Date;
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export default function Store() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [processingPurchase, setProcessingPurchase] = useState(false);

  // تحميل الألعاب من Firebase
  const loadGames = async () => {
    try {
      // جلب جميع الألعاب النشطة
      const q = query(
        collection(db, 'games'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const gamesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Game[];
      
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  // تصفية الألعاب حسب الفئة
  const filteredGames = selectedCategory === 'all' 
    ? games 
    : games.filter(game => game.category === selectedCategory);

  // الحصول على الفئات الفريدة
  const categories = ['all', ...Array.from(new Set(games.map(game => game.category)))];

  // معالجة شراء اللعبة
  const handlePurchaseGame = (game: Game) => {
    setSelectedGame(game);
    setShowPurchaseModal(true);
  };

  // معالجة إرسال معلومات العميل
  const handleSubmitPurchase = async () => {
    if (!selectedGame) return;

    // التحقق من صحة البيانات
    if (!customerInfo.name.trim()) {
      alert('يرجى إدخال الاسم الكامل');
      return;
    }

    if (!customerInfo.email.trim()) {
      alert('يرجى إدخال البريد الإلكتروني');
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      alert('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    if (!customerInfo.address.trim()) {
      alert('يرجى إدخال العنوان');
      return;
    }

    if (!customerInfo.phone.trim()) {
      alert('يرجى إدخال رقم الهاتف');
      return;
    }

    setProcessingPurchase(true);

    try {
      // إرسال طلب الدفع
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedGame.price * 1000, // تحويل الدولار إلى دينار عراقي (تقريبي)
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          customerAddress: customerInfo.address,
          customerPhone: customerInfo.phone,
          gameId: selectedGame.id,
          gameTitle: selectedGame.title,
          gameCurrency: selectedGame.currency || 'USD'
        }),
      });

      const result = await response.json();

      if (result.success && result.redirectUrl) {
        // حفظ معلومات اللعبة في localStorage للاستخدام لاحقاً
        localStorage.setItem('purchasingGame', JSON.stringify({
          id: selectedGame.id,
          title: selectedGame.title,
          price: selectedGame.price,
          currency: selectedGame.currency || 'USD',
          downloadUrl: selectedGame.downloadUrl
        }));
        
        // إغلاق النافذة وإعادة تعيين البيانات
        setShowPurchaseModal(false);
        setSelectedGame(null);
        setCustomerInfo({ name: '', email: '', address: '', phone: '' });
        
        // التوجيه إلى صفحة الدفع
        window.location.href = result.redirectUrl;
      } else {
        alert(`خطأ في إعداد عملية الدفع: ${result.error || 'خطأ غير معروف'}`);
      }
    } catch (error) {
      console.error('خطأ في عملية الشراء:', error);
      alert('حدث خطأ أثناء إعداد عملية الدفع. يرجى المحاولة مرة أخرى.');
    } finally {
      setProcessingPurchase(false);
    }
  };

  // إغلاق النافذة
  const handleCloseModal = () => {
    setShowPurchaseModal(false);
    setSelectedGame(null);
    setCustomerInfo({ name: '', email: '', address: '', phone: '' });
    setProcessingPurchase(false);
  };

  const handleWatchVideo = (videoUrl: string) => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    } else {
      alert('رابط الفيديو غير متاح حالياً');
    }
  };

  // تحويل الفئة إلى العربية
  const getCategoryInArabic = (category: string) => {
    switch (category) {
      case 'programming': return 'برمجة';
      case 'action': return 'أكشن';
      case 'puzzle': return 'ألغاز';
      case 'strategy': return 'استراتيجية';
      case 'sports': return 'رياضة';
      case 'adventure': return 'مغامرة';
      case 'educational': return 'تعليمية';
      case 'simulation': return 'محاكاة';
      case 'arcade': return 'أركيد';
      default: return category;
    }
  };

  // تحويل المنصة إلى العربية
  const getPlatformInArabic = (platform: string) => {
    switch (platform) {
      case 'vr': return 'الواقع الافتراضي';
      case 'computer': return 'كمبيوتر';
      case 'mobile': return 'موبايل';
      case 'web': return 'ويب';
      default: return platform;
    }
  };

  // الحصول على رمز العملة للعرض
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'USD': return '$';
      case 'IQD': return 'د.ع';
      default: return currency;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الألعاب...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">مركز الألعاب</h1>
          <p className="text-xl text-gray-600">استمتع بمجموعة متنوعة من الألعاب الممتعة والتفاعلية</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                {category === 'all' ? 'جميع الألعاب' : getCategoryInArabic(category)}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">لا توجد ألعاب متاحة</h3>
            <p className="text-gray-600">سيتم إضافة ألعاب جديدة قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div key={game.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Game Image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-500 to-orange-600">
                  <img
                    src={game.imageUrl || 'https://via.placeholder.com/400x300?text=Game'}
                    alt={game.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Game';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-black/50 rounded-full">
                      {getCategoryInArabic(game.category)}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500/80 rounded-full">
                      {getPlatformInArabic(game.platform)}
                    </span>
                  </div>
                  {game.price > 0 && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-orange-500 rounded-full">
                        {getCurrencySymbol(game.currency || 'USD')}{game.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Game Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{game.titleEn}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {game.description}
                  </p>
                  
                  {game.features && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">الميزات:</p>
                      <p className="text-xs text-gray-600">{game.features}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => handlePurchaseGame(game)}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-sm"
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                        شراء الآن
                      </div>
                    </button>
                    {game.videoUrl && (
                      <button
                        onClick={() => handleWatchVideo(game.videoUrl)}
                        className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          مشاهدة
                        </div>
                      </button>
                    )}
                  </div>

                  {!game.downloadUrl && !game.videoUrl && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">رابط اللعبة سيكون متاحاً بعد الشراء</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* About Gaming Center */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 text-center">عن مركز الألعاب</h3>
          <p className="text-center text-orange-100 mb-6">
            مركز الألعاب من شركة أفق الحياة يوفر لك تجربة لعب ممتعة ومثيرة.
            نقدم مجموعة متنوعة من الألعاب التفاعلية المصممة بأحدث التقنيات.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">ألعاب متنوعة</h4>
              <p className="text-sm text-orange-100">مجموعة واسعة من الألعاب لجميع الأذواق</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">تجربة سلسة</h4>
              <p className="text-sm text-orange-100">واجهة سهلة الاستخدام وتجربة لعب سلسة</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">متعة مضمونة</h4>
              <p className="text-sm text-orange-100">استمتع بساعات من المرح والتسلية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedGame && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">شراء اللعبة</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={processingPurchase}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Game Info */}
            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3 space-x-reverse">
                <img
                  src={selectedGame.imageUrl || 'https://via.placeholder.com/60x60?text=Game'}
                  alt={selectedGame.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedGame.title}</h4>
                  <p className="text-sm text-gray-600">{selectedGame.titleEn}</p>
                  <p className="text-lg font-bold text-orange-600">{getCurrencySymbol(selectedGame.currency || 'USD')}{selectedGame.price}</p>
                </div>
              </div>
            </div>

            {/* Customer Information Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitPurchase(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="أدخل اسمك الكامل"
                    required
                    disabled={processingPurchase}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                    disabled={processingPurchase}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان *
                  </label>
                  <textarea
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="أدخل عنوانك الكامل"
                    rows={3}
                    required
                    disabled={processingPurchase}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="أدخل رقم هاتفك"
                    required
                    disabled={processingPurchase}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={processingPurchase}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processingPurchase}
                >
                  {processingPurchase ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري المعالجة...
                    </div>
                  ) : (
                    'إتمام الشراء'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
