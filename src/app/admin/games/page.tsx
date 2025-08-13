'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

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

interface GameFormData {
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
}

export default function AdminGamesPage() {
  const [formData, setFormData] = useState<GameFormData>({
    title: '',
    titleEn: '',
    slug: '',
    description: '',
    category: 'programming',
    price: 0,
    currency: 'USD', // القيمة الافتراضية
    platform: 'vr',
    imageUrl: '',
    videoUrl: '',
    downloadUrl: '',
    features: '',
    classification: 'educational',
    isActive: true
  });
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // تحميل الألعاب
  const loadGames = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'games'));
      const gamesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Game[];
      setGames(gamesData);
    } catch (error) {
      console.error('Error loading games:', error);
      alert('حدث خطأ أثناء تحميل الألعاب');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  // إضافة لعبة جديدة
  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'games'), {
        ...formData,
        createdAt: new Date()
      });
      alert('تم إضافة اللعبة بنجاح!');
      setFormData({
        title: '',
        titleEn: '',
        slug: '',
        description: '',
        category: 'programming',
        price: 0,
        currency: 'USD',
        platform: 'vr',
        imageUrl: '',
        videoUrl: '',
        downloadUrl: '',
        features: '',
        classification: 'educational',
        isActive: true
      } as GameFormData);
      loadGames();
    } catch (error) {
      console.error('Error adding game:', error);
      alert('حدث خطأ أثناء إضافة اللعبة');
    }
  };

  // تحديث لعبة
  const handleUpdateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGame) return;
    
    try {
      await updateDoc(doc(db, 'games', editingGame.id), {
        ...formData,
        updatedAt: new Date()
      });
      alert('تم تحديث اللعبة بنجاح!');
      setEditingGame(null);
      setFormData({
        title: '',
        titleEn: '',
        slug: '',
        description: '',
        category: 'programming',
        price: 0,
        currency: 'USD',
        platform: 'vr',
        imageUrl: '',
        videoUrl: '',
        downloadUrl: '',
        features: '',
        classification: 'educational',
        isActive: true
      } as GameFormData);
      loadGames();
    } catch (error) {
      console.error('Error updating game:', error);
      alert('حدث خطأ أثناء تحديث اللعبة');
    }
  };

  // حذف لعبة
  const handleDeleteGame = async (gameId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه اللعبة؟')) {
      try {
        await deleteDoc(doc(db, 'games', gameId));
        alert('تم حذف اللعبة بنجاح!');
        loadGames();
      } catch (error) {
        console.error('Error deleting game:', error);
        alert('حدث خطأ أثناء حذف اللعبة');
      }
    }
  };

  // تبديل حالة اللعبة (نشطة/غير نشطة)
  const handleToggleActive = async (game: Game) => {
    try {
      await updateDoc(doc(db, 'games', game.id), {
        isActive: !game.isActive,
        updatedAt: new Date()
      });
      loadGames();
      alert(`تم ${game.isActive ? 'إخفاء' : 'إظهار'} اللعبة بنجاح!`);
    } catch (error) {
      console.error('Error toggling game status:', error);
      alert('حدث خطأ أثناء تغيير حالة اللعبة');
    }
  };

  // تحرير لعبة
  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setFormData({
      title: game.title || '',
      titleEn: game.titleEn || '',
      slug: game.slug || '',
      description: game.description || '',
      category: game.category || 'programming',
      price: game.price || 0,
      currency: game.currency || 'USD', // إضافة العملة
      platform: game.platform || 'vr',
      imageUrl: game.imageUrl || '',
      videoUrl: game.videoUrl || '',
      downloadUrl: game.downloadUrl || '',
      features: game.features || '',
      classification: game.classification || 'educational',
      isActive: game.isActive ?? true
    } as GameFormData);
  };

  // إلغاء التحرير
  const handleCancelEdit = () => {
    setEditingGame(null);
    setFormData({
      title: '',
      titleEn: '',
      slug: '',
      description: '',
      category: 'programming',
      price: 0,
      currency: 'USD',
      platform: 'vr',
      imageUrl: '',
      videoUrl: '',
      downloadUrl: '',
      features: '',
      classification: 'educational',
      isActive: true
    } as GameFormData);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">إدارة الألعاب</h1>
          <p className="text-xl text-gray-600">أضف لعبة جديدة مع التفاصيل الأساسية.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingGame ? 'تحرير اللعبة' : 'إضافة لعبة جديدة'}
            </h2>
            <form onSubmit={editingGame ? handleUpdateGame : handleAddGame} className="space-y-6">
              {/* عنوان اللعبة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان اللعبة
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="مثال: تحدي المبرمج"
                />
              </div>

              {/* اسم اللعبة (بالإنجليزية) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم اللعبة (بالإنجليزية)
                </label>
                <input
                  type="text"
                  value={formData.titleEn || ''}
                  onChange={(e) => setFormData({...formData, titleEn: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Example: Dev Challenge"
                />
              </div>

              {/* المعرف (Slug) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المعرف (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="dev-challenge"
                />
              </div>

              {/* الوصف */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="نبذة مختصرة عن اللعبة"
                />
              </div>

              {/* الفئة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  value={formData.category || 'programming'}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="programming">برمجة</option>
                  <option value="action">أكشن</option>
                  <option value="puzzle">ألغاز</option>
                  <option value="strategy">استراتيجية</option>
                  <option value="sports">رياضة</option>
                  <option value="adventure">مغامرة</option>
                  <option value="educational">تعليمية</option>
                </select>
              </div>

              {/* السعر والعملة */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر
                  </label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العملة
                  </label>
                  <select
                    value={formData.currency || 'USD'}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="USD">دولار أمريكي ($)</option>
                    <option value="IQD">دينار عراقي (د.ع)</option>
                  </select>
                </div>
              </div>

              {/* المنصة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنصة
                </label>
                <select
                  value={formData.platform || 'vr'}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="vr">ألعاب الواقع الافتراضي</option>
                  <option value="computer">ألعاب كمبيوتر</option>
                  <option value="mobile">ألعاب موبايل</option>
                  <option value="web">ألعاب ويب</option>
                </select>
              </div>

              {/* رابط الصورة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الصورة (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://.../cover.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">إن وجد، سيُفضّل على الصورة المرفوعة.</p>
              </div>

              {/* رابط الفيديو */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الفيديو (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl || ''}
                  onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* رابط التحميل */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط التحميل (اختياري)
                </label>
                <input
                  type="url"
                  value={formData.downloadUrl || ''}
                  onChange={(e) => setFormData({...formData, downloadUrl: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://.../download.zip"
                />
              </div>

              {/* ميزات مختصرة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ميزات مختصرة (مفصولة بفواصل)
                </label>
                <input
                  type="text"
                  value={formData.features || ''}
                  onChange={(e) => setFormData({...formData, features: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="مستويات متعددة, لوحة نتائج, أوضاع لعب"
                />
              </div>

              {/* تصنيف اللعبة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تصنيف اللعبة
                </label>
                <select
                  value={formData.classification || 'educational'}
                  onChange={(e) => setFormData({...formData, classification: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="educational">تعليمي</option>
                  <option value="simulation">محاكاة</option>
                  <option value="action">أكشن</option>
                  <option value="adventure">مغامرة</option>
                  <option value="strategy">استراتيجية</option>
                  <option value="puzzle">ألغاز</option>
                  <option value="sports">رياضة</option>
                  <option value="arcade">أركيد</option>
                </select>
              </div>

              {/* اللعبة نشطة */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="mr-2 text-sm text-gray-700">
                  اللعبة نشطة
                </label>
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200">
                  {editingGame ? 'تحديث اللعبة' : 'إضافة اللعبة'}
                </button>
                {editingGame && (
                  <button type="button" onClick={handleCancelEdit} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Games List */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">الألعاب المضافة</h2>
            {games.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد ألعاب مضافة بعد</p>
            ) : (
              <div className="space-y-4">
                {games.map((game) => (
                  <div key={game.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <img src={game.imageUrl || 'https://via.placeholder.com/64x64?text=Game'} alt={game.title} className="w-16 h-16 rounded-lg object-cover" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Game'; }} />
                        <div>
                          <h3 className="font-semibold text-gray-900">{game.title}</h3>
                          <p className="text-sm text-gray-600">{game.titleEn}</p>
                          <p className="text-xs text-gray-500">
                            {game.category} • {getCurrencySymbol(game.currency || 'USD')}{game.price} {game.currency || 'USD'}
                          </p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${ game.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }`}>
                            {game.isActive ? 'نشطة' : 'غير نشطة'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <button onClick={() => handleEditGame(game)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
                          تحرير
                        </button>
                        <button
                          onClick={() => handleToggleActive(game)}
                          className={`px-3 py-1 text-sm rounded transition-colors duration-200 ${
                            game.isActive
                              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                              : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {game.isActive ? 'إخفاء' : 'إظهار'}
                        </button>
                        <button onClick={() => handleDeleteGame(game.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200">
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
