'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
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
  createdAt: any;
  registeredStudentsCount?: number;
}

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // جلب جميع الدورات النشطة بدون ترتيب لتجنب مشاكل الفهارس
      const coursesQuery = query(
        collection(db, 'courses'),
        where('isActive', '==', true)
      );
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      
      // ترتيب الدورات حسب تاريخ الإنشاء في الذاكرة
      coursesData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      // جلب عدد الطلاب المسجلين لكل دورة (للأول 3 فقط)
      const firstThreeCourses = coursesData.slice(0, 3);
      const coursesWithStudentCount = await Promise.all(
        firstThreeCourses.map(async (course) => {
          try {
            const registrationsQuery = query(
              collection(db, 'courseRegistrations'),
              where('courseId', '==', course.id),
              where('status', 'in', ['pending', 'approved'])
            );
            const registrationsSnapshot = await getDocs(registrationsQuery);
            return {
              ...course,
              registeredStudentsCount: registrationsSnapshot.size
            };
          } catch (error) {
            console.error(`خطأ في جلب عدد الطلاب للدورة ${course.id}:`, error);
            return {
              ...course,
              registeredStudentsCount: 0
            };
          }
        })
      );
      
      setCourses(coursesWithStudentCount);
    } catch (error) {
      console.error('خطأ في جلب الدورات:', error);
    } finally {
      setLoading(false);
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

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'تطوير الويب':
        return 'from-blue-500 to-purple-600';
      case 'تطوير تطبيقات الموبايل':
        return 'from-purple-500 to-pink-600';
      case 'البرمجة العامة':
        return 'from-green-500 to-teal-600';
      case 'قواعد البيانات':
        return 'from-indigo-500 to-blue-600';
      case 'الأمن السيبراني':
        return 'from-red-500 to-orange-600';
      case 'الذكاء الاصطناعي':
        return 'from-purple-500 to-indigo-600';
      default:
        return 'from-orange-400 to-orange-600';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل الدورات...</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد دورات متاحة حالياً</h3>
          <p className="text-gray-500 mb-6">سيتم إضافة دورات جديدة قريباً</p>
          <Link 
            href="/contact"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
          >
            تواصل معنا للاستفسار
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group">
            {/* Course Image */}
            <div className="relative overflow-hidden">
              {course.imageUrl ? (
                <img 
                  src={course.imageUrl} 
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className={`w-full h-48 bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center`}>
                  {getCategoryIcon(course.category)}
                </div>
              )}
              
              {/* Course Level Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-gray-800">
                  {course.level}
                </span>
              </div>

                             {/* Students Count */}
               <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                 {course.registeredStudentsCount || 0} طالب
               </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              {/* Category */}
              <div className="flex items-center text-orange-600 mb-3">
                {getCategoryIcon(course.category)}
                <span className="mr-2 text-sm font-medium">{course.category}</span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                {course.description}
              </p>

              {/* Instructor */}
              <div className="flex items-center text-gray-500 mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">{course.instructor}</span>
              </div>

              {/* Course Details */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-orange-500">
                  <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold">{course.rating || 0}</span>
                  <span className="text-sm text-gray-500 mr-1">({course.totalReviews || 0})</span>
                </div>
                <div className="text-gray-500 text-sm">{course.duration}</div>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-600">
                  {course.price?.toLocaleString()} د.ع
                </span>
                <Link 
                  href={`/courses/${course.id}`}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:from-orange-600 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
                >
                  عرض التفاصيل
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Courses Button */}
      <div className="text-center">
        <Link href="/courses" className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
          <span>عرض جميع الدورات</span>
          <svg className="w-5 h-5 mr-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </>
  );
}
