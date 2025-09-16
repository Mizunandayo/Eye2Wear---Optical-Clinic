import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import the patientdemographic model with our emergency fixes
import './models/patientdemographic.js';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Emergency database connection
const MONGO_URI = "mongodb+srv://tristandivider8:KG3HOQ4gxc0Utd6U@eye2wear.9dotohy.mongodb.net/eyetowear?retryWrites=true&w=majority&appName=Eye2Wear";

// Connect to database
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Database connection success");
    
    // Emergency test endpoint
    app.get('/api/test/patientdemographics', async (req, res) => {
      try {
        const startTime = Date.now();
        console.log("🚀 Emergency test endpoint called");
        
        const Patientdemographic = mongoose.model('Patientdemographic');
        
        // Ultra minimal query with 5 record limit
        const patients = await Patientdemographic
          .find({})
          .select('patientemail patientfirstname patientlastname')
          .limit(5)
          .lean()
          .maxTimeMS(5000); // 5 second timeout
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        console.log(`⚡ Query completed in ${duration}ms`);
        
        res.json({
          success: true,
          count: patients.length,
          duration: `${duration}ms`,
          data: patients
        });
        
      } catch (error) {
        console.error("❌ Error in test endpoint:", error);
        res.status(500).json({
          success: false,
          error: error.message,
          duration: "timeout"
        });
      }
    });
    
    // Start server
    app.listen(3001, () => {
      console.log("🚀 Test server listening on port 3001");
    });
    
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });