import OtherClinicRecord from "../models/otherclinicrecord.js";
import dotenv from "dotenv";
import { Buffer } from 'buffer';
import CloudinaryService from "../utils/cloudinaryService.js";
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();









//Retrieve (All Other Clinic Record) Controller - Optimized for Medical Records
export const getotherclinicrecords = async (req, res) => {
  try {
    console.log('Fetching all other clinic records...'); // Debug log
    
    // Get query parameters for filtering and pagination
    const { email, limit = 50, skip = 0, includeImages = 'false' } = req.query;
    
    // Build the query
    let query = {};
    if (email) {
      query.patientotherclinicemail = email;
    }
    
    // First, try to get a count with timeout
    const countPromise = OtherClinicRecord.countDocuments(query).maxTimeMS(3000);
    let count = 0;
    
    try {
      count = await countPromise;
      console.log('Total records matching query:', count); // Debug log
    } catch (countError) {
      console.warn('Count query timed out, proceeding with fetch...'); // Debug log
    }
    
    if (count === 0 && !email) {
      console.log('No records found, returning empty array'); // Debug log
      return res.status(200).json([]);
    }
    
    // Optimize projection - exclude large image data by default for list views
    let projection = {};
    if (includeImages === 'false') {
      projection = { patientotherclinicrecordimage: 0 }; // Exclude image data for faster queries
    }
    
    console.log('Attempting to fetch records with optimized query...'); // Debug log
    
    let otherclinicrec = [];
    
    try {
      // Optimized query with projection and pagination
      otherclinicrec = await OtherClinicRecord.find(query, projection)
        .sort({ patientotherclinicconsultationdate: -1, createdAt: -1 }) // Sort by consultation date first
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .lean()
        .maxTimeMS(8000); // Increased timeout for complex queries
      
      console.log('Successfully fetched records:', otherclinicrec?.length || 0); // Debug log
      
    } catch (queryError) {
      console.log('Optimized query failed, trying fallback...'); // Debug log
      
      // Fallback: Simple query without sorting
      try {
        otherclinicrec = await OtherClinicRecord.find(query, projection)
          .limit(10) // Reduced limit for fallback
          .lean()
          .maxTimeMS(5000);
        
        console.log('Fallback query succeeded:', otherclinicrec?.length || 0); // Debug log
      } catch (fallbackError) {
        console.log('All queries failed, returning empty array'); // Debug log
        return res.status(200).json([]);
      }
    }
    
    console.log('Final result count:', otherclinicrec?.length || 0); // Debug log
    
    // Add metadata for frontend optimization
    const response = {
      data: otherclinicrec || [],
      count: otherclinicrec?.length || 0,
      totalCount: count,
      hasImages: includeImages === 'true',
      pagination: {
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: otherclinicrec?.length === parseInt(limit)
      }
    };
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in getotherclinicrecords:', error); // Debug log
    
    // Handle specific MongoDB timeout errors
    if (error.name === 'MongoNetworkTimeoutError' || error.message.includes('timeout')) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again.',
        error: 'SERVICE_UNAVAILABLE',
        retry: true
      });
    }
    
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};

//Retrieve (Single ) Controller
export const getotherclinicrecordbyemail = async (req, res) => {
  try {
    const { patientotherclinicemail } = req.params;
    const { includeImages = 'true' } = req.query; // Include images by default for single record
    
    console.log('Searching for email:', patientotherclinicemail); // Debug log
    
    // Optimized projection for single record queries
    let projection = {};
    if (includeImages === 'false') {
      projection = { patientotherclinicrecordimage: 0 };
    }
    
    // Add timeout wrapper for the database query with increased timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 15000); // Reduced from 30s
    });
    
    const queryPromise = OtherClinicRecord.findOne(
      { patientotherclinicemail: patientotherclinicemail }, 
      projection
    ).lean().maxTimeMS(12000);
    
    const otherclinicrec = await Promise.race([queryPromise, timeoutPromise]);
    
    console.log('Found record:', otherclinicrec ? 'Yes' : 'No'); // Debug log
    res.status(200).json(otherclinicrec);
  } catch (error) {
    console.error('Error in getotherclinicrecordbyemail:', error); // Debug log
    
    // Handle specific MongoDB timeout errors
    if (error.name === 'MongoNetworkTimeoutError' || error.message.includes('timeout')) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again.',
        error: 'SERVICE_UNAVAILABLE',
        retry: true
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// NEW: Optimized endpoint for patient medical records (multiple records by email)
export const getpatientmedicalrecords = async (req, res) => {
  try {
    const { patientotherclinicemail } = req.params;
    const { includeImages = 'false', limit = 20 } = req.query;
    
    console.log('Fetching medical records for patient:', patientotherclinicemail); // Debug log
    
    if (!patientotherclinicemail) {
      return res.status(400).json({ message: 'Patient email is required' });
    }
    
    // Optimized projection - exclude images by default for faster loading
    let projection = {};
    if (includeImages === 'false') {
      projection = { patientotherclinicrecordimage: 0 };
    }
    
    // Optimized query specifically for patient medical records
    const records = await OtherClinicRecord.find(
      { patientotherclinicemail: patientotherclinicemail },
      projection
    )
    .sort({ patientotherclinicconsultationdate: -1, createdAt: -1 }) // Most recent first
    .limit(parseInt(limit))
    .lean()
    .maxTimeMS(8000);
    
    console.log('Found medical records:', records?.length || 0); // Debug log
    
    // Return optimized response
    res.status(200).json({
      data: records || [],
      count: records?.length || 0,
      patientEmail: patientotherclinicemail,
      hasImages: includeImages === 'true'
    });
    
  } catch (error) {
    console.error('Error in getpatientmedicalrecords:', error); // Debug log
    
    if (error.name === 'MongoNetworkTimeoutError' || error.message.includes('timeout')) {
      return res.status(503).json({ 
        message: 'Database connection timeout. Please try again.',
        error: 'SERVICE_UNAVAILABLE',
        retry: true
      });
    }
    
    res.status(500).json({ message: error.message });
  }
};

// Get single medical record by ID (with option to include images)
export const getmedicalrecordbyid = async (req, res) => {
  try {
    const recordId = parseInt(req.params.id); // Convert to number since patientotherclinicrecordid is numeric
    const includeImages = req.query.includeImages === 'true';
    
    console.log('Fetching medical record ID:', recordId, 'includeImages:', includeImages); // Debug log
    
    // Validate the ID
    if (isNaN(recordId)) {
      return res.status(400).json({ error: 'Invalid record ID format' });
    }
    
    // Build projection object
    let projection = { __v: 0 }; // Exclude version field
    if (!includeImages) {
      projection.patientotherclinicrecordimage = 0; // Exclude images
    }

    // Use findOne with the custom numeric ID field
    const record = await OtherClinicRecord.findOne(
      { patientotherclinicrecordid: recordId }, 
      projection
    ).lean().maxTimeMS(3000);

    if (!record) {
      console.log('Medical record not found for ID:', recordId); // Debug log
      return res.status(404).json({ error: 'Medical record not found' });
    }

    console.log('Successfully found medical record:', recordId); // Debug log
    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ 
      error: 'Failed to fetch medical record',
      details: error.message 
    });
  }
};




//Create (Other Clinic Record) Controller
export const createotherclinicrecord = async (req, res) => {
  try {
    console.log('Creating other clinic record with data:', req.body);
    
    const newRecord = new OtherClinicRecord(req.body);
    const savedRecord = await newRecord.save();
    
    console.log('Successfully created other clinic record:', savedRecord.patientotherclinicrecordid);
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating other clinic record:', error);
    res.status(500).json({ message: error.message });
  }
};

//Update (Other Clinic Record) Controller
export const updateotherclinicrecord = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    
    console.log('Updating other clinic record ID:', numericId, 'with data:', req.body);
    
    const updatedRecord = await OtherClinicRecord.findOneAndUpdate(
      { patientotherclinicrecordid: numericId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ message: "Other clinic record does not exist" });
    }
    
    console.log('Successfully updated other clinic record:', numericId);
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating other clinic record:', error);
    res.status(500).json({ message: error.message });
  }
};


//Delete (Other Clinic Record) Controller
export const deleteotherclinicrecord = async (req, res) => {
  try{
    const {id} = req.params;
    const numericid = parseInt(id);

    const otherclinicrec = await OtherClinicRecord.findOneAndDelete({patientotherclinicrecordid: numericid});

    if(!otherclinicrec){
      return res.status(404).json({message: "Other clinic record does not exist"});
    }

    res.status(200).json({message: "Other clinic record deleted successfully"});
  
  }catch(error){
    console.error("Failed to delete: ", error);
    res.status(500).json({message: "Server error", error: error.message});
  }
}

// Secure File Download Controller - Proxy Download with Signed URLs
export const downloadFile = async (req, res) => {
  try {
    console.log('🔍 Download request received:', req.params);
    const fileName = req.params['0']; // Capture full path after /download/
    const requestedFilename = req.query.filename; // Get original filename from query
    
    if (!fileName) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    console.log(`📥 Generating signed URL for file: ${fileName}`);
    console.log(`📝 Requested filename: ${requestedFilename}`);
    
    // First, try to make the file public to avoid "Blocked for delivery" issues
    try {
      console.log(`🔧 Attempting to make file public first...`);
      await CloudinaryService.makeFilePublic(fileName, 'raw');
      console.log(`✅ File made public successfully`);
    } catch (publicError) {
      console.warn(`⚠️ Could not make file public (this might be okay):`, publicError.message);
      // Continue anyway - the file might already be accessible
    }
    
    // Try multiple URL approaches in order of preference
    const urlsToTry = [];
    
    // 1. First try a simple public URL (works if file is public)
    const publicUrl = cloudinary.url(fileName, {
      resource_type: 'raw',
      type: 'upload',
      secure: true
    });
    urlsToTry.push({ type: 'public', url: publicUrl });
    
    // 2. Try signed URL without attachment (sometimes works better)
    try {
      const signedUrlNoAttach = cloudinary.url(fileName, {
        resource_type: 'raw',
        type: 'upload',
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + (10 * 60), // 10 minutes
        secure: true
      });
      urlsToTry.push({ type: 'signed_no_attach', url: signedUrlNoAttach });
    } catch (e) {
      console.warn('Could not generate signed URL without attachment:', e.message);
    }
    
    // 3. Try signed URL with attachment
    try {
      const signedUrl = CloudinaryService.generateSignedUrl(fileName, {
        resource_type: 'raw',
        type: 'upload',
        expires_at: Math.floor(Date.now() / 1000) + (10 * 60)
      });
      urlsToTry.push({ type: 'signed_with_attach', url: signedUrl });
    } catch (e) {
      console.warn('Could not generate signed URL with attachment:', e.message);
    }

    console.log(`� Will try ${urlsToTry.length} different URL approaches...`);
    
    let lastError = null;
    
    // Try each URL approach until one works
    for (const { type, url } of urlsToTry) {
      try {
        console.log(`🔄 Trying ${type} URL: ${url}`);
        
        const response = await fetch(url);
        console.log(`📡 ${type} response status: ${response.status}`);
        
        if (response.ok) {
          console.log(`✅ ${type} URL worked! Streaming file...`);
          
          // Determine content type based on file extension
          const fileExtension = (requestedFilename || fileName).split('.').pop().toLowerCase();
          const contentTypeMap = {
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'txt': 'text/plain',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif'
          };
          
          const contentType = contentTypeMap[fileExtension] || 'application/octet-stream';
          
          // Set proper headers for forced download
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${requestedFilename || fileName}"`);
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          
          console.log(`✅ Streaming file to client with filename: ${requestedFilename || fileName}`);
          
          // Convert fetch response to Node.js readable stream and pipe to response
          if (response.body && response.body.getReader) {
            // For fetch API response, we need to handle it differently
            const reader = response.body.getReader();
            
            const pump = async () => {
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(value);
                }
                res.end();
              } catch (streamError) {
                console.error('❌ Streaming error:', streamError.message);
                res.status(500).json({ error: 'Failed to stream file' });
              }
            };
            
            pump();
          } else {
            // Fallback: get buffer and send it
            const buffer = await response.arrayBuffer();
            res.write(Buffer.from(buffer));
            res.end();
          }
          
          return; // Success! Exit the function
        } else {
          const errorText = await response.text();
          console.warn(`❌ ${type} failed: ${response.status} ${response.statusText} - ${errorText}`);
          lastError = { type, status: response.status, statusText: response.statusText, body: errorText };
        }
      } catch (fetchError) {
        console.warn(`❌ ${type} fetch error:`, fetchError.message);
        lastError = { type, error: fetchError.message };
      }
    }
    
    // If we get here, all URL approaches failed
    console.error(`❌ All URL approaches failed. Last error:`, lastError);
    return res.status(lastError?.status || 500).json({ 
      error: 'Failed to fetch file from Cloudinary - all approaches failed',
      lastError: lastError,
      triedApproaches: urlsToTry.length
    });
    
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};

// Utility function to update file access control to public
export const makeFilePublic = async (req, res) => {
  try {
    const fileName = req.params['0']; // Get file path
    
    if (!fileName) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    console.log(`🔧 Making file public: ${fileName}`);
    
    // Use CloudinaryService to make the file publicly accessible
    const result = await CloudinaryService.makeFilePublic(fileName, 'raw');
    
    console.log(`✅ File access updated:`, result);
    
    res.json({ 
      success: true, 
      message: 'File access updated to public',
      public_id: result.public_id,
      access_mode: result.access_mode
    });
    
  } catch (error) {
    console.error('❌ Error updating file access:', error);
    res.status(500).json({ error: 'Failed to update file access' });
  }
};

// Batch utility to fix all blocked files in the database
export const fixAllBlockedFiles = async (req, res) => {
  try {
    console.log('🔧 Starting batch fix for all blocked files...');
    
    // Get all records with files
    const records = await OtherClinicRecord.find({
      $or: [
        { patientotherclinicrecordfiles_public_ids: { $exists: true, $ne: [] } }
      ]
    });
    
    console.log(`Found ${records.length} records with files`);
    
    let fixedCount = 0;
    let errorCount = 0;
    const results = [];
    
    for (const record of records) {
      if (record.patientotherclinicrecordfiles_public_ids && record.patientotherclinicrecordfiles_public_ids.length > 0) {
        for (const publicId of record.patientotherclinicrecordfiles_public_ids) {
          try {
            console.log(`Fixing file: ${publicId}`);
            const result = await CloudinaryService.makeFilePublic(publicId, 'raw');
            results.push({ publicId, status: 'fixed', result });
            fixedCount++;
          } catch (error) {
            console.error(`Failed to fix ${publicId}:`, error.message);
            results.push({ publicId, status: 'error', error: error.message });
            errorCount++;
          }
        }
      }
    }
    
    console.log(`✅ Batch fix complete: ${fixedCount} fixed, ${errorCount} errors`);
    
    res.json({
      success: true,
      message: `Batch fix complete: ${fixedCount} files fixed, ${errorCount} errors`,
      totalRecords: records.length,
      fixedCount,
      errorCount,
      results
    });
    
  } catch (error) {
    console.error('❌ Error in batch fix:', error);
    res.status(500).json({ error: 'Failed to perform batch fix' });
  }
};
