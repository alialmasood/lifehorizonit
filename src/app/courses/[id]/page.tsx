'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface Course {
  id: string;
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

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'syllabus' | 'features' | 'requirements'>('overview');
  const [registeredStudentsCount, setRegisteredStudentsCount] = useState(0);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      fetchRegisteredStudentsCount();
    }
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        const courseData = courseDoc.data();
        setCourse({
          id: courseDoc.id,
          ...courseData
        } as Course);
      } else {
        alert('الدورة غير موجودة');
        router.push('/courses');
      }
    } catch (error) {
      console.error('خطأ في جلب الدورة:', error);
      alert('حدث خطأ في جلب بيانات الدورة');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredStudentsCount = async () => {
    try {
      const registrationsQuery = query(
        collection(db, 'courseRegistrations'),
        where('courseId', '==', courseId),
        where('status', 'in', ['pending', 'approved'])
      );
      const registrationsSnapshot = await getDocs(registrationsQuery);
      setRegisteredStudentsCount(registrationsSnapshot.size);
    } catch (error) {
      console.error('خطأ في جلب عدد الطلاب المسجلين:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'مبتدئ':
        return 'bg-green-100 text-green-800';
      case 'متوسط':
        return 'bg-yellow-100 text-yellow-800';
      case 'متقدم':
        return 'bg-orange-100 text-orange-800';
      case 'احترافي':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'تطوير الويب':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
          </svg>
        );
      case 'تطوير تطبيقات الموبايل':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'البرمجة العامة':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
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

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">الدورة غير موجودة</h2>
          <Link 
            href="/courses"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            العودة للدورات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-600">الرئيسية</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-orange-600">الدورات</Link>
            <span>/</span>
            <span className="text-gray-900">{course.title}</span>
          </nav>
        </div>
      </div>

      {/* Course Header */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Image */}
            <div className="lg:col-span-2">
              {course.imageUrl ? (
                <img 
                  src={course.imageUrl} 
                  alt={course.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg flex items-center justify-center">
                  {getCategoryIcon(course.category)}
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="space-y-6">
              {/* Category and Level */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-orange-600">
                  {getCategoryIcon(course.category)}
                  <span className="mr-2 text-sm font-medium">{course.category}</span>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {course.title}
              </h1>

              {/* Instructor */}
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">المدرب: {course.instructor}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center">
                <div className="flex items-center text-orange-500">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(course.rating || 0) ? 'text-orange-500' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="mr-2 text-sm text-gray-600">
                  {course.rating || 0} ({course.totalReviews || 0} تقييم)
                </span>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{course.duration}</div>
                  <div className="text-sm text-gray-600">المدة</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {registeredStudentsCount} / {course.maxStudents || 'غير محدد'}
                  </div>
                  <div className="text-sm text-gray-600">الطلاب</div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {course.price?.toLocaleString()} دينار عراقي
                </div>
                <div className="text-sm text-gray-600 mb-4">سعر الدورة</div>
                <Link 
                  href={`/courses/register?courseId=${course.id}`}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 text-center block"
                >
                  سجل الآن
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'نظرة عامة' },
                { id: 'syllabus', label: 'المنهج' },
                { id: 'features', label: 'المميزات' },
                { id: 'requirements', label: 'المتطلبات' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {activeTab === 'overview' && (
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">نظرة عامة على الدورة</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {course.description}
                </p>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">منهج الدورة</h2>
                {course.syllabus && course.syllabus.length > 0 ? (
                  <div className="space-y-4">
                    {course.syllabus.map((item, index) => (
                      <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow-sm border">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                          <span className="text-orange-600 font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">لم يتم تحديد منهج الدورة بعد.</p>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">مميزات الدورة</h2>
                {course.features && course.features.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm border">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">لم يتم تحديد مميزات الدورة بعد.</p>
                )}
              </div>
            )}

            {activeTab === 'requirements' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">متطلبات الدورة</h2>
                {course.requirements && course.requirements.length > 0 ? (
                  <div className="space-y-4">
                    {course.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start p-4 bg-white rounded-lg shadow-sm border">
                        <svg className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-900">{requirement}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">لم يتم تحديد متطلبات الدورة بعد.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Courses */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">دورات مشابهة</h2>
          <div className="text-center">
            <Link 
              href="/courses"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              استكشف جميع الدورات
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            جاهز للبدء في رحلة التعلم؟
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
            سجل الآن في هذه الدورة وابدأ في تطوير مهاراتك التقنية مع أفضل المدربين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              تواصل معنا للاستفسار
            </Link>
            <Link 
              href="/courses"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-200 transform hover:scale-105"
            >
              استكشف المزيد من الدورات
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
