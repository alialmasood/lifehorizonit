/**
 * مكتبة تحويل الروابط إلى روابط مباشرة
 * تدعم Google Drive و Dropbox
 */

export interface ConvertedLink {
  originalUrl: string;
  directUrl: string;
  provider: 'google-drive' | 'dropbox' | 'unknown';
  fileName?: string;
  isValid: boolean;
}

/**
 * تحويل رابط Google Drive إلى رابط مباشر
 */
function convertGoogleDriveLink(url: string): ConvertedLink {
  try {
    const urlObj = new URL(url);
    
    // التحقق من أن الرابط من Google Drive
    if (!urlObj.hostname.includes('drive.google.com')) {
      return {
        originalUrl: url,
        directUrl: url,
        provider: 'unknown',
        isValid: false
      };
    }

    // استخراج معرف الملف من الرابط
    let fileId = '';
    
    // نمط 1: /file/d/{fileId}
    const fileMatch = urlObj.pathname.match(/\/file\/d\/([^\/]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }
    
    // نمط 2: /open?id={fileId}
    if (!fileId) {
      const idMatch = urlObj.searchParams.get('id');
      if (idMatch) {
        fileId = idMatch;
      }
    }
    
    // نمط 3: /uc?id={fileId}
    if (!fileId) {
      const ucMatch = urlObj.pathname.match(/\/uc\?id=([^&]+)/);
      if (ucMatch) {
        fileId = ucMatch[1];
      }
    }

    if (!fileId) {
      return {
        originalUrl: url,
        directUrl: url,
        provider: 'google-drive',
        isValid: false
      };
    }

    // إنشاء الرابط المباشر
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // استخراج اسم الملف من الرابط الأصلي
    let fileName = '';
    const nameMatch = urlObj.pathname.match(/\/d\/[^\/]+\/([^\/\?]+)/);
    if (nameMatch) {
      fileName = decodeURIComponent(nameMatch[1]);
    }

    return {
      originalUrl: url,
      directUrl,
      provider: 'google-drive',
      fileName,
      isValid: true
    };

  } catch (error) {
    return {
      originalUrl: url,
      directUrl: url,
      provider: 'google-drive',
      isValid: false
    };
  }
}

/**
 * تحويل رابط Dropbox إلى رابط مباشر
 */
function convertDropboxLink(url: string): ConvertedLink {
  try {
    const urlObj = new URL(url);
    
    // التحقق من أن الرابط من Dropbox
    if (!urlObj.hostname.includes('dropbox.com')) {
      return {
        originalUrl: url,
        directUrl: url,
        provider: 'unknown',
        isValid: false
      };
    }

    // استخراج مسار الملف
    let filePath = '';
    
    // نمط 1: /s/{filePath}
    const sMatch = urlObj.pathname.match(/\/s\/(.+)/);
    if (sMatch) {
      filePath = sMatch[1];
    }
    
    // نمط 2: /sh/{filePath}
    const shMatch = urlObj.pathname.match(/\/sh\/(.+)/);
    if (shMatch) {
      filePath = shMatch[1];
    }

    if (!filePath) {
      return {
        originalUrl: url,
        directUrl: url,
        provider: 'dropbox',
        isValid: false
      };
    }

    // إنشاء الرابط المباشر
    const directUrl = `https://dl.dropboxusercontent.com/s/${filePath}`;
    
    // استخراج اسم الملف
    const pathParts = filePath.split('/');
    const fileName = pathParts[pathParts.length - 1] || '';

    return {
      originalUrl: url,
      directUrl,
      provider: 'dropbox',
      fileName: fileName ? decodeURIComponent(fileName) : undefined,
      isValid: true
    };

  } catch (error) {
    return {
      originalUrl: url,
      directUrl: url,
      provider: 'dropbox',
      isValid: false
    };
  }
}

/**
 * تحويل أي رابط إلى رابط مباشر
 */
export function convertToDirectLink(url: string): ConvertedLink {
  if (!url || typeof url !== 'string') {
    return {
      originalUrl: url,
      directUrl: url,
      provider: 'unknown',
      isValid: false
    };
  }

  // تنظيف الرابط
  const cleanUrl = url.trim();
  
  // التحقق من Google Drive
  if (cleanUrl.includes('drive.google.com')) {
    return convertGoogleDriveLink(cleanUrl);
  }
  
  // التحقق من Dropbox
  if (cleanUrl.includes('dropbox.com')) {
    return convertDropboxLink(cleanUrl);
  }
  
  // إذا لم يكن من المواقع المدعومة، إرجاع الرابط كما هو
  return {
    originalUrl: cleanUrl,
    directUrl: cleanUrl,
    provider: 'unknown',
    isValid: true
  };
}

/**
 * التحقق من صحة الرابط
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * الحصول على معلومات الملف من الرابط
 */
export function getFileInfo(url: string): {
  fileName: string;
  fileExtension: string;
  fileSize?: string;
} {
  const converted = convertToDirectLink(url);
  
  let fileName = 'game-download';
  let fileExtension = '';
  
  if (converted.fileName) {
    fileName = converted.fileName;
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex > 0) {
      fileExtension = fileName.substring(lastDotIndex + 1);
      fileName = fileName.substring(0, lastDotIndex);
    }
  }
  
  return {
    fileName,
    fileExtension,
    fileSize: undefined // يمكن إضافة منطق لجلب حجم الملف لاحقاً
  };
}

/**
 * اختبار الروابط
 */
export function testLinkConversion() {
  const testUrls = [
    'https://drive.google.com/file/d/1ABC123DEF456/view?usp=sharing',
    'https://drive.google.com/open?id=1ABC123DEF456',
    'https://www.dropbox.com/s/abc123def456/game.zip?dl=0',
    'https://www.dropbox.com/sh/abc123def456/game.exe',
    'https://example.com/file.zip'
  ];
  
  testUrls.forEach(url => {
    const result = convertToDirectLink(url);
    console.log(`Original: ${url}`);
    console.log(`Converted: ${result.directUrl}`);
    console.log(`Provider: ${result.provider}`);
    console.log(`Valid: ${result.isValid}`);
    console.log('---');
  });
}
