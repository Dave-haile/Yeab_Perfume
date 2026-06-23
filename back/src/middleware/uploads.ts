import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

/**
 * Multer configuration for image uploads.
 *
 * Two things to configure:
 * 1. storage  — where files land on disk and what they're named
 * 2. fileFilter — what file types are allowed (reject everything else)
 *
 * We use diskStorage (not memoryStorage) because images can be large
 * and we don't want them held in RAM — write straight to disk.
 */

const UPLOADS_DIR = path.join(__dirname, "../uploads");

// Create the uploads folder if it doesn't exist yet
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },

  filename: (_req, file, cb) => {
    /**
     * Why not keep the original filename?
     * Two reasons:
     * 1. Spaces and special chars in filenames cause URL problems.
     * 2. Two different perfumes could have an image named "front.jpg" —
     *    they'd overwrite each other.
     *
     * Strategy: timestamp + random suffix + original extension.
     * e.g. "1719123456789-482910273.jpg"
     * Guaranteed unique, URL-safe, extension preserved.
     */
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpeg", ".jpg", ".png", ".webp", ".avif"];

  const isValidMimeType = allowedTypes.includes(file.mimetype);
  const isValidExtension = allowedExtensions.includes(ext);

  if (isValidMimeType || isValidExtension) {
    cb(null, true);
  } else {
    console.log(`Rejected file: ${file.originalname} (MIME: ${file.mimetype})`);
    cb(new Error("Only JPEG, PNG, WebP, and AVIF images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max per file
  },
});

export default upload;
