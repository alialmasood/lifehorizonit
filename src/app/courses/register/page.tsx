'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { collection, getDocs, addDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  isActive: boolean;
}

interface RegistrationFormData {
  fullNameAr: string;
  fullNameEn: string;
  phone: string;
  email: string;
  address: string;
  academicLevel: string;
  courseId: string;
  courseTitle: string;
  additionalInfo: string;
  emergencyContact: string;
  emergencyPhone: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  experience: string;
  goals: string;
}

const ACADEMIC_LEVELS = [
  'ثانوية عامة',
  'دبلوم',
  'بكالوريوس',
  'ماجستير',
  'دكتوراه',
  'طالب جامعي',
  'موظف',
  'أخرى'
];

const GENDERS = ['ذكر', 'أنثى'];

/** ضع الكود الأصلي داخل كومبوننت داخلي */
function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCourseId = searchParams.get('courseId');

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [formData, setFormData] = useState<RegistrationFormData>({
    fullNameAr: '',
    fullNameEn: '',
    phone: '',
    email: '',
    address: '',
    academicLevel: 'بكالوريوس',
    courseId: selectedCourseId || '',
    courseTitle: '',
    additionalInfo: '',
    emergencyContact: '',
    emergencyPhone: '',
    dateOfBirth: '',
    gender: 'ذكر',
    occupation: '',
    experience: '',
    goals: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId && courses.length > 0) {
      const selectedCourse = courses.find(course => course.id === selectedCourseId);
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          courseId: selectedCourseId,
          courseTitle: selectedCourse.title
        }));
      }
    }
  }, [selectedCourseId, courses]);

  const fetchCourses = async () => {
    try {
      const coursesQuery = query(collection(db, 'courses'), where('isActive', '==', true));
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];

      coursesData.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
      setCourses(coursesData);
    } catch (error) {
      console.error('خطأ في جلب الدورات:', error);
      alert('حدث خطأ في جلب الدورات المتاحة');
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'courseId') {
      const selectedCourse = courses.find(course => course.id === value);
      if (selectedCourse) {
        setFormData(prev => ({ ...prev, courseTitle: selectedCourse.title }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const registrationData = {
        ...formData,
        status: 'pending',
        registrationDate: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(db, 'courseRegistrations'), registrationData);
      alert('تم إرسال طلب التسجيل بنجاح! سنتواصل معك قريباً.');
      router.push('/courses');
    } catch (error) {
      console.error('خطأ في إرسال طلب التسجيل:', error);
      alert('حدث خطأ في إرسال طلب التسجيل. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  if (coursesLoading) {
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
              <h1 className="text-3xl font-bold text-gray-900">تسجيل الدورات التدريبية</h1>
              <p className="text-gray-600 mt-2">سجل الآن في الدورات التدريبية المتاحة</p>
            </div>
            <Link
              href="/courses"
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all duration-200"
            >
              العودة للدورات
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
          {/* Course Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">اختيار الدورة</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر الدورة المطلوبة *
              </label>
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">-- اختر الدورة --</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">المعلومات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل (عربي) *
                </label>
                <input
                  type="text"
                  name="fullNameAr"
                  value={formData.fullNameAr}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="الاسم الكامل باللغة العربية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل (إنجليزي) *
                </label>
                <input
                  type="text"
                  name="fullNameEn"
                  value={formData.fullNameEn}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Full Name in English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="07XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الميلاد *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الجنس *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {GENDERS.map(gender => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="العنوان الكامل"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">المعلومات الأكاديمية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المستوى الأكاديمي *
                </label>
                <select
                  name="academicLevel"
                  value={formData.academicLevel}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  {ACADEMIC_LEVELS.map(level => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المهنة
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="المهنة الحالية"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الخبرة السابقة
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="اذكر خبرتك السابقة في المجال (إن وجدت)"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">معلومات الطوارئ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شخص للاتصال في الطوارئ *
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="اسم الشخص"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم هاتف الطوارئ *
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="07XX XXX XXXX"
                />
              </div>
            </div>
          </div>

          {/* Goals and Additional Info */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">الأهداف والمعلومات الإضافية</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  أهدافك من الدورة *
                </label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="اذكر أهدافك من الالتحاق بهذه الدورة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  معلومات إضافية
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="أي معلومات إضافية تود إضافتها"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال طلب التسجيل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** صفحة Next الفعلية: لفّ المحتوى داخل Suspense */
export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
