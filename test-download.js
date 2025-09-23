// Test simple download approach
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileName = 'eye2wear/otherclinic-records/files/otherclinic_record_1758630828615_1.pdf';

console.log('Testing download approaches for:', fileName);

// Try using Admin API to get resource info
try {
  console.log('Getting resource info via Admin API...');
  const resource = await cloudinary.api.resource(fileName, {
    resource_type: 'raw',
    type: 'upload'
  });
  
  console.log('Resource info:');
  console.log('- URL:', resource.secure_url);
  console.log('- Access mode:', resource.access_mode);
  console.log('- Public ID:', resource.public_id);
  console.log('- Format:', resource.format);
  
  // Try the secure_url from the resource
  console.log('Testing resource secure_url...');
  const response = await fetch(resource.secure_url);
  console.log('Resource URL response:', response.status, response.statusText);
  
  if (response.ok) {
    console.log('SUCCESS! Resource URL is accessible');
  } else {
    const errorText = await response.text();
    console.log('Resource URL error:', errorText);
  }
  
} catch (apiError) {
  console.error('Admin API error:', apiError.message);
}

// Try creating an archive with just this file
try {
  console.log('Creating archive...');
  const archive = await cloudinary.uploader.create_archive({
    type: 'upload',
    target_public_id: `download_${Date.now()}`,
    public_ids: [fileName],
    resource_type: 'raw'
  });
  
  console.log('Archive created:', archive.secure_url);
  
  // Test archive URL
  const archiveResponse = await fetch(archive.secure_url);
  console.log('Archive response:', archiveResponse.status, archiveResponse.statusText);
  
} catch (archiveError) {
  console.error('Archive error:', archiveError.message);
}