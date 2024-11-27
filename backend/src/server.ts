import express, { Request, Response } from 'express';
import cors from 'cors';
import vision from '@google-cloud/vision';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new vision.ImageAnnotatorClient();

app.post('/ocr', async (req: Request, res: Response) => {
  try {
    // Your OCR logic here
    const text = "OCR result";  // Example result
    res.json({ text });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
