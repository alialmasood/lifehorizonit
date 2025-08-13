'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  gameUrl: string;
  isActive: boolean;
  createdAt: Date;
}

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    gameUrl: '',
    isActive: true
  });
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  // تحميل الألعاب من Firebase
  const loadGames = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'games'));
      const gamesData = querySnapshot.docs.map(doc => ({
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

  // إضافة لعبة جديدة
  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const gameData = {
        ...formData,
        createdAt: new Date()
      };
      await addDoc(collection(db, 'games'), gameData);
      setFormData({
        title: '',
        description: '',
        category: '',
        imageUrl: '',
        gameUrl: '',
        isActive: true
      });
      loadGames();
      alert('تم إضافة اللعبة بنجاح!');
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
      setEditingGame(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        imageUrl: '',
        gameUrl: '',
        isActive: true
      });
      loadGames();
      alert('تم تحديث اللعبة بنجاح!');
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
        loadGames();
        alert('تم حذف اللعبة بنجاح!');
      } catch (error) {
        console.error('Error deleting game:', error);
        alert('حدث خطأ أثناء حذف اللعبة');
      }
    }
  };

  // تحرير لعبة
  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setFormData({
      title: game.title,
      description: game.description,
      category: game.category,
      imageUrl: game.imageUrl,
      gameUrl: game.gameUrl,
      isActive: game.isActive
    });
  };

  // إلغاء التحرير
  const handleCancelEdit = () => {
    setEditingGame(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      imageUrl: '',
      gameUrl: '',
      isActive: true
    });
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">إدارة الألعاب</h1>
          <p className="text-xl text-gray-600">إضافة وتحرير وحذف الألعاب في مركز الألعاب</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingGame ? 'تحرير اللعبة' : 'إضافة لعبة جديدة'}
            </h2>
            
            <form onSubmit={editingGame ? handleUpdateGame : handleAddGame} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان اللعبة
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="أدخل عنوان اللعبة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف اللعبة
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="أدخل وصف اللعبة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فئة اللعبة
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">اختر فئة اللعبة</option>
                  <option value="action">أكشن</option>
                  <option value="puzzle">ألغاز</option>
                  <option value="strategy">استراتيجية</option>
                  <option value="sports">رياضة</option>
                  <option value="adventure">مغامرة</option>
                  <option value="educational">تعليمية</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الصورة
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="أدخل رابط صورة اللعبة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط اللعبة
                </label>
                <input
                  type="url"
                  value={formData.gameUrl}
                  onChange={(e) => setFormData({...formData, gameUrl: e.target.value})}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="أدخل رابط اللعبة"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="mr-2 text-sm text-gray-700">
                  اللعبة نشطة
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                >
                  {editingGame ? 'تحديث اللعبة' : 'إضافة اللعبة'}
                </button>
                {editingGame && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
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
                        <img
                          src={game.imageUrl}
                          alt={game.title}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/64x64?text=Game';
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{game.title}</h3>
                          <p className="text-sm text-gray-600">{game.category}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            game.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {game.isActive ? 'نشطة' : 'غير نشطة'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleEditGame(game)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                        >
                          تحرير
                        </button>
                        <button
                          onClick={() => handleDeleteGame(game.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                        >
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
