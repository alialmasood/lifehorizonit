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
          {/* ... (نفس بقية النموذج كما كان) ... */}
          {/* ضع بقية JSX الخاص بك هنا بدون أي تغيير */}
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
