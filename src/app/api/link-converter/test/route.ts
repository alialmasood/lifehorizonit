import { NextRequest, NextResponse } from 'next/server';
import { convertToDirectLink, testLinkConversion } from '@/lib/link-converter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'الرابط مطلوب' },
        { status: 400 }
      );
    }

    const result = convertToDirectLink(url);

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error) {
    console.error('خطأ في اختبار تحويل الرابط:', error);
    return NextResponse.json(
      { error: 'خطأ في تحويل الرابط' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // تشغيل الاختبارات المدمجة
    testLinkConversion();
    
    return NextResponse.json({
      success: true,
      message: 'تم تشغيل اختبارات تحويل الروابط. راجع console للنتائج.'
    });

  } catch (error) {
    console.error('خطأ في تشغيل الاختبارات:', error);
    return NextResponse.json(
      { error: 'خطأ في تشغيل الاختبارات' },
      { status: 500 }
    );
  }
}
