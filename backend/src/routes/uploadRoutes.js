import express from 'express';
import multer from 'multer';
import { uploadImage } from '../services/cloudinaryService.js';
import { requireAdmin } from '../middleware/auth.js';
import { fail, success } from '../utils/apiResponse.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.mimetype)) cb(new Error('Invalid file type'));
    else cb(null, true);
  },
});

router.post('/products', requireAdmin, upload.array('images', 8), async (req, res) => {
  if (!req.files?.length) return fail(res, 'No files uploaded', 400);
  try {
    const images = [];
    for (let i = 0; i < req.files.length; i += 1) {
      const result = await uploadImage(req.files[i].buffer, 'jlf/products');
      images.push({
        url: result.secure_url,
        publicId: result.public_id,
        alt: req.files[i].originalname,
        order: i,
      });
    }
    return success(res, images);
  } catch (error) {
    return fail(res, error.statusCode === 503 ? 'Image upload unavailable' : 'Upload failed', error.statusCode || 500);
  }
});

router.post('/testimonials', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) return fail(res, 'No file uploaded', 400);
  try {
    const result = await uploadImage(req.file.buffer, 'jlf/testimonials');
    return success(res, { url: result.secure_url, publicId: result.public_id, alt: req.file.originalname });
  } catch (error) {
    return fail(res, error.statusCode === 503 ? 'Image upload unavailable' : 'Upload failed', error.statusCode || 500);
  }
});

export default router;
