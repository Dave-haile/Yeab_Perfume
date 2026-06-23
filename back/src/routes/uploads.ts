import { Router, Request, Response, NextFunction } from "express";
import upload from "../middleware/uploads";
import * as UploadsController from "../controllers/uploads";

const router = Router();

/**
 * POST /api/uploads/image
 *
 * upload.single("image") is Multer middleware — it:
 * 1. Reads the multipart form data
 * 2. Validates the file type (our fileFilter rejects non-images)
 * 3. Saves the file to disk
 * 4. Attaches req.file for the controller to use
 * 5. Calls next() so the controller runs
 *
 * If Multer rejects the file (wrong type, too large), we catch that
 * error here and return a clean 400 instead of a 500.
 */
router.post(
  "/image",
  (req: Request, res: Response, next: NextFunction) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        // Multer errors (file too large, wrong type, etc.)
        res.status(400).json({ error: err.message });
        return;
      }
      console.log("Content-Type:", req.headers["content-type"]);
      console.log("Content-Length:", req.headers["content-length"]);
      next();
    });
  },
  UploadsController.uploadImage,
);

/**
 * DELETE /api/uploads/image/:filename
 */
router.delete("/image/:filename", UploadsController.deleteImage);

export default router;
