import { Request, Response } from "express";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.join(__dirname, "../uploads");

/**
 * POST /api/uploads/image
 *
 * Expects: multipart/form-data with a field named "image"
 * Returns: { url: "/uploads/1719123456789-482910273.jpg" }
 *
 * By the time this controller runs, Multer has already:
 * - validated the file type
 * - saved the file to disk
 * - attached req.file with the saved filename
 *
 * So all we do here is build the public URL and return it.
 * The admin panel stores this URL in mainImage or galleryImages.
 */
export function uploadImage(req: Request, res: Response) {
  if (!req.file) {
    res.status(400).json({ error: "No image file provided" });
    return;
  }

  // Build the URL path that the frontend can use to display the image.
  // e.g. http://localhost:3001/uploads/1719123456789-482910273.jpg
  const url = `/uploads/${req.file.filename}`;

  res.status(201).json({
    url,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
}

/**
 * DELETE /api/uploads/image/:filename
 *
 * Deletes an image file from disk.
 * Called when:
 * - admin removes a gallery image from a perfume
 * - admin replaces the main image
 * - a perfume is deleted entirely
 *
 * Security note: we only allow filenames (no slashes, no ".." path traversal).
 * If someone sends "../../etc/passwd" we reject it.
 */
export function deleteImage(req: Request, res: Response) {
  const { filename } = req.params as { filename: string };

  // Reject anything that looks like a path traversal attempt
  if (
    filename.includes("/") ||
    filename.includes("..") ||
    filename.includes("\\")
  ) {
    res.status(400).json({ error: "Invalid filename" });
    return;
  }

  const filePath = path.join(UPLOADS_DIR, filename);

  // Check the file actually exists before trying to delete
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Image not found" });
    return;
  }

  fs.unlinkSync(filePath);
  res.status(204).send();
}
