import express from 'express';
import { generatePDF } from '../controllers/pdf.controller.js';

const router = express.Router();

// POST route to generate PDF from HTML content
router.post('/generate', generatePDF);

export default router;
