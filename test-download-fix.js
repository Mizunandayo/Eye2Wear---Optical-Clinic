// Test script to verify PDF download with correct extension
const testDownloadFunction = () => {
  // Simulate the downloadFile function with MIME type detection
  const downloadFile = async (url, fileName = 'download') => {
    try {
      console.log('Testing download for URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Blob MIME type:', blob.type);
      
      // Enhanced MIME type to extension mapping
      const mimeToExtension = {
        'application/pdf': 'pdf',
        'image/jpeg': 'jpg',
        'image/jpg': 'jpg', 
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'text/plain': 'txt',
        'application/zip': 'zip',
        'application/x-rar-compressed': 'rar'
      };
      
      // Get file extension from MIME type or default
      const extension = mimeToExtension[blob.type] || 'bin';
      console.log('Detected extension:', extension);
      
      // Clean filename and add proper extension
      const cleanFileName = fileName.replace(/\.[^/.]+$/, ''); // Remove existing extension
      const finalFileName = `${cleanFileName}.${extension}`;
      
      console.log('Final filename will be:', finalFileName);
      
      // In browser, this would trigger download
      const url2 = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url2;
      a.download = finalFileName;
      a.click();
      window.URL.revokeObjectURL(url2);
      
      return { success: true, fileName: finalFileName, mimeType: blob.type };
    } catch (error) {
      console.error('Download error:', error);
      return { success: false, error: error.message };
    }
  };
  
  return downloadFile;
};

// Test URLs (examples)
const testCases = [
  'https://res.cloudinary.com/your-cloud/raw/upload/v123456/test.pdf',
  'https://res.cloudinary.com/your-cloud/image/upload/v123456/test.jpg'
];

console.log('Download function test ready!');
console.log('This will test MIME type detection for proper file extensions');

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testDownloadFunction };
}