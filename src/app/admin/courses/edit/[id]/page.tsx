'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  duration: string;
  level: string;
  category: string;
  instructor: string;
  imageUrl: string;
  isActive: boolean;
  features: string[];
  requirements: string[];
  syllabus: string[];
  maxStudents: number;
  currentStudents: number;
  rating: number;
  totalReviews: number;
}

const COURSE_LEVELS = ['مبتدئ', 'متوسط', 'متقدم', 'احترافي'];
const COURSE_CATEGORIES = [
  'تطوير الويب',
  'تطوير تطبيقات الموبايل',
  'البرمجة العامة',
  'قواعد البيانات',
  'الأمن السيبراني',
  'الذكاء الاصطناعي',
  'علم البيانات',
  'شبكات الحاسوب',
  'إدارة المشاريع التقنية',
  'التسويق الرقمي',
  'دورات اللغة الإنجليزية',
  'دورات اللغة العربية',
  'دورات طبية',
  'دورات تمريض',
  'دورات صيدلة',
  'دورات نفطية',
  'دورات هندسية',
  'دورات تقنية أخرى'
];

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    duration: '',
    level: 'مبتدئ',
    category: 'تطوير الويب',
    instructor: '',
    imageUrl: '',
    isActive: true,
    features: [''],
    requirements: [''],
    syllabus: [''],
    maxStudents: 20,
    currentStudents: 0,
    rating: 0,
    totalReviews: 0
  });

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        const courseData = courseDoc.data();
        setFormData({
          title: courseData.title || '',
          description: courseData.description || '',
          price: courseData.price || 0,
          duration: courseData.duration || '',
          level: courseData.level || 'مبتدئ',
          category: courseData.category || 'تطوير الويب',
          instructor: courseData.instructor || '',
          imageUrl: courseData.imageUrl || '',
          isActive: courseData.isActive !== undefined ? courseData.isActive : true,
          features: courseData.features?.length > 0 ? courseData.features : [''],
          requirements: courseData.requirements?.length > 0 ? courseData.requirements : [''],
          syllabus: courseData.syllabus?.length > 0 ? courseData.syllabus : [''],
          maxStudents: courseData.maxStudents || 20,
          currentStudents: courseData.currentStudents || 0,
          rating: courseData.rating || 0,
          totalReviews: courseData.totalReviews || 0
        });
      } else {
        alert('الدورة غير موجودة');
        router.push('/admin/courses');
      }
    } catch (error) {
      console.error('خطأ في جلب الدورة:', error);
      alert('حدث خطأ في جلب بيانات الدورة');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'maxStudents' || name === 'currentStudents' || name === 'rating' || name === 'totalReviews' 
        ? Number(value) 
        : value
    }));
  };

  const handleArrayInputChange = (index: number, field: 'features' | 'requirements' | 'syllabus', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'features' | 'requirements' | 'syllabus') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'features' | 'requirements' | 'syllabus') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const courseData = {
        ...formData,
        features: formData.features.filter(f => f.trim() !== ''),
        requirements: formData.requirements.filter(r => r.trim() !== ''),
        syllabus: formData.syllabus.filter(s => s.trim() !== ''),
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'courses', courseId), courseData);
      router.push('/admin/courses');
    } catch (error) {
      console.error('خطأ في تحديث الدورة:', error);
      alert('حدث خطأ في تحديث الدورة. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">تعديل الدورة</h1>
              <p className="text-gray-600 mt-2">تعديل بيانات الدورة التدريبية</p>
            </div>
            <Link 
              href="/admin/courses"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all duration-200"
            >
              العودة للقائمة
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">المعلومات الأساسية</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الدورة *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أدخل عنوان الدورة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدرب *
                </label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="اسم المدرب"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {COURSE_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المستوى *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {COURSE_LEVELS.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر (دينار عراقي) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="مثال: 24 ساعة تدريبية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأقصى للطلاب
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عدد الطلاب الحاليين
                </label>
                <input
                  type="number"
                  name="currentStudents"
                  value={formData.currentStudents}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="mr-2 text-sm font-medium text-gray-700">
                  تفعيل الدورة
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف الدورة *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="أدخل وصفاً مفصلاً للدورة"
              />
            </div>
          </div>

          {/* Course Image URL */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">صورة الدورة</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط صورة الدورة *
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-sm text-gray-500 mt-2">
                أدخل رابط مباشر لصورة الدورة (يجب أن ينتهي بـ .jpg, .png, .gif, إلخ)
              </p>
            </div>

            {formData.imageUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  معاينة الصورة
                </label>
                <img 
                  src={formData.imageUrl} 
                  alt="معاينة صورة الدورة" 
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    alert('لا يمكن تحميل الصورة. يرجى التحقق من الرابط.');
                  }}
                />
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">مميزات الدورة</h2>
            
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayInputChange(index, 'features', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أدخل ميزة الدورة"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'features')}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  حذف
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              إضافة ميزة
            </button>
          </div>

          {/* Requirements */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">متطلبات الدورة</h2>
            
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={requirement}
                  onChange={(e) => handleArrayInputChange(index, 'requirements', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أدخل متطلب الدورة"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'requirements')}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  حذف
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              إضافة متطلب
            </button>
          </div>

          {/* Syllabus */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">منهج الدورة</h2>
            
            {formData.syllabus.map((item, index) => (
              <div key={index} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayInputChange(index, 'syllabus', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أدخل عنصر المنهج"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'syllabus')}
                  className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  حذف
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => addArrayItem('syllabus')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              إضافة عنصر منهج
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/courses"
              className="px-8 py-3 bg-gray-500 text-white rounded-lg font-bold hover:bg-gray-600 transition-all duration-200"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  جاري الحفظ...
                </>
              ) : (
                'حفظ التغييرات'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
