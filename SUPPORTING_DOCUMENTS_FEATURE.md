# Supporting Documents Upload Feature

## Overview
This feature allows patients to upload up to 5 supporting documents and images when booking appointments. The system supports various file types but excludes videos for security and storage optimization.

## Features Implemented

### Frontend (PatientDashboard.jsx)
- **Multiple file upload interface** with drag-and-drop styling
- **File validation** for type and size restrictions
- **Real-time preview** of selected files with icons and file information
- **Individual file removal** capability
- **Progress indication** during file processing
- **Image compression** for uploaded images to optimize storage

### Backend (patientappointment.controller.js)
- **Multer integration** for handling multipart form data
- **File storage** in `uploads/appointment-documents/` directory
- **Automatic file cleanup** if appointment creation fails
- **Database integration** with appointment records

### Database Schema (patientappointment.js)
- **New field**: `patientsupportingdocuments` array containing:
  - `filename`: Generated unique filename
  - `originalname`: Original filename from user
  - `mimetype`: File MIME type
  - `size`: File size in bytes
  - `url`: Relative URL path to file
  - `uploaddate`: Upload timestamp

### File Display
- **Appointment view** shows all uploaded supporting documents
- **File type icons** for different document types
- **Image previews** for uploaded images
- **Download links** for all files
- **File metadata** display (size, upload date)

## File Restrictions

### Supported File Types
- **Images**: JPEG, JPG, PNG, WebP
- **Documents**: PDF, Word (.doc, .docx), Text (.txt)

### File Limits
- **Maximum files**: 5 per appointment
- **Maximum file size**: 10MB per file
- **Total storage**: No explicit limit (monitored)

### Excluded Types
- **Videos**: All video formats are blocked for security and storage reasons
- **Executables**: .exe, .bat, .sh files are blocked
- **Archives**: .zip, .rar files are blocked

## API Endpoints

### POST /api/patientappointments/appointments
- **Content-Type**: `multipart/form-data`
- **Files**: Accepts `supportingdocuments[]` field
- **Response**: Includes count of uploaded documents

## File Organization

```
uploads/
└── appointment-documents/
    ├── supportingdocuments-1672531200000-123456789.pdf
    ├── supportingdocuments-1672531200001-987654321.jpg
    └── ...
```

## Security Measures

1. **File type validation** on both frontend and backend
2. **File size limits** to prevent abuse
3. **Unique filename generation** to prevent conflicts
4. **Error handling** with automatic cleanup
5. **MIME type checking** to verify file authenticity

## Usage Instructions

### For Patients
1. Navigate to appointment booking form
2. Fill in appointment details
3. Scroll to "Supporting Documents" section
4. Click "Add Documents/Images" to select files
5. Review selected files in the preview area
6. Remove unwanted files using the trash icon
7. Submit appointment with documents

### For Staff/Admins
1. View appointment details in admin dashboard
2. Supporting documents appear in dedicated section
3. Click download links to access files
4. View image previews directly in interface

## Performance Considerations

- **Image compression** reduces file sizes automatically
- **Lazy loading** for file previews
- **Efficient storage** with organized directory structure
- **Database indexing** for quick file lookups

## Future Enhancements

- [ ] Drag-and-drop file upload interface
- [ ] Bulk download option for all appointment files
- [ ] File versioning system
- [ ] Advanced image editing tools
- [ ] Cloud storage integration (AWS S3, Google Cloud)
- [ ] File sharing with clinic staff
- [ ] OCR text extraction from uploaded documents

## Testing

Use the test file `test-file-upload.html` to verify upload functionality:
1. Open `http://localhost:3000/test-file-upload.html`
2. Select multiple files (up to 5)
3. Test different file types
4. Verify file size limits
5. Check upload success/failure scenarios

## Troubleshooting

### Common Issues
1. **Files not uploading**: Check file type and size restrictions
2. **Missing files in appointment view**: Verify API URL configuration
3. **Server errors**: Check uploads directory permissions
4. **Database errors**: Ensure MongoDB schema is updated

### Error Messages
- "File type not supported": Upload only allowed file types
- "File too large": Reduce file size to under 10MB
- "Too many files": Remove files to stay under 5-file limit
- "Upload failed": Check network connection and server status
