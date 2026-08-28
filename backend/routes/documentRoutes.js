const express = require("express");
const multer = require("multer");
const fs = require("fs");

const supabase = require("../config/supabase");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

router.post("/upload", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No document uploaded"
      });
    }

    const file = req.file;

    // Read temporary file
    const fileBuffer = fs.readFileSync(file.path);

    // Determine correct MIME type
    const extension = file.originalname
      .split(".")
      .pop()
      .toLowerCase();

    let contentType;

    if (extension === "jpg" || extension === "jpeg") {
      contentType = "image/jpeg";
    } else if (extension === "png") {
      contentType = "image/png";
    } else if (extension === "pdf") {
      contentType = "application/pdf";
    } else {
      fs.unlinkSync(file.path);

      return res.status(400).json({
        success: false,
        message: "Only JPG, PNG and PDF files are allowed"
      });
    }

    // Unique filename for Supabase Storage
    const storagePath = `${Date.now()}-${file.originalname}`;

    // Upload to Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .upload(storagePath, fileBuffer, {
        contentType: contentType,
        upsert: false
      });

    if (storageError) {
      console.error("Supabase Storage Error:", storageError);

      fs.unlinkSync(file.path);

      return res.status(500).json({
        success: false,
        message: "Failed to upload document to Supabase Storage"
      });
    }

    // Save information in database
    const { data, error: databaseError } = await supabase
      .from("documents")
      .insert({
        original_name: file.originalname,
        storage_path: storagePath,
        file_type: contentType,
        file_size: file.size,
        status: "uploaded"
      })
      .select()
      .single();

    if (databaseError) {
      console.error("Database Error:", databaseError);

      // Remove file from Storage if database insert fails
      await supabase.storage
        .from("documents")
        .remove([storagePath]);

      fs.unlinkSync(file.path);

      return res.status(500).json({
        success: false,
        message: "Database record could not be created"
      });
    }

    // Delete temporary local copy
    fs.unlinkSync(file.path);

    return res.status(200).json({
      success: true,
      message: "Document uploaded successfully",
      document: data
    });

  } catch (error) {
    console.error("Upload Error:", error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Document upload failed"
    });
  }
});

module.exports = router;