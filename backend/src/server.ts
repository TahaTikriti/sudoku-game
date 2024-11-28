import express, { Request, Response, RequestHandler } from 'express';
import multer from 'multer';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';
config(); // This loads environment variables from the .env file
// Initialize express app
const app = express();
const upload = multer();

// Initialize the Google Cloud Vision client
const client = new ImageAnnotatorClient();

// POST route for OCR
const ocrHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' });
      return; // Ensure early return here instead of returning res
    }

    // Save the uploaded file temporarily
    const tempFilePath = path.join(__dirname, 'temp_image.jpg');
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Log the saved file path
    console.log(`Saved image to ${tempFilePath}`);

    // Check if the file exists
    if (!fs.existsSync(tempFilePath)) {
      res.status(500).json({ error: 'Image not saved correctly.' });
      return;
    }

    // Call Google Cloud Vision API to perform OCR on the image
    const [result] = await client.textDetection(tempFilePath);
    
    // Log the raw API response for further inspection
    console.log('Vision API result:', JSON.stringify(result, null, 2)); // Log the entire response
    
    // Check if there's an error or empty result
    if (result.error) {
      console.error('Vision API error:', result.error);
      res.status(500).json({ error: 'Error from Google Vision API', details: result.error });
      return;
    }

    const fullTextAnnotation = result.fullTextAnnotation;

    // Delete the temporary file after processing
    fs.unlinkSync(tempFilePath);

    // Check if OCR text was found and return the result
    if (fullTextAnnotation && fullTextAnnotation.text) {
      res.json({ text: fullTextAnnotation.text });
    } else {
      res.status(404).json({ error: 'No text found in the image' });
    }

  } catch (error) {
    console.error('Error during OCR processing:', error);
    res.status(500).json({ error: 'Error processing image for OCR' });
  }
};

// POST route to use the handler
app.post('/ocr', upload.single('image'), ocrHandler);

// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
