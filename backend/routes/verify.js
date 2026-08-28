const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const router = express.Router();


// =========================================================
// MULTER
// =========================================================

// Store uploaded document temporarily in memory
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf"
        ];

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(
                new Error(
                    "Only JPG, PNG and PDF files are allowed"
                )
            );
        }
    }
});


// =========================================================
// VERIFY DOCUMENT
// =========================================================

router.post(
    "/verify",
    upload.single("file"),
    async (req, res) => {

        try {

            // -------------------------------------------------
            // Check uploaded file
            // -------------------------------------------------

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please upload a document"
                });
            }


            console.log(
                "Document received:",
                req.file.originalname
            );


            // -------------------------------------------------
            // Create multipart form
            // -------------------------------------------------

            const form = new FormData();

            form.append(
                "file",
                req.file.buffer,
                {
                    filename:
                        req.file.originalname,

                    contentType:
                        req.file.mimetype
                }
            );


            // -------------------------------------------------
            // Send document ONCE to AI service
            // -------------------------------------------------

            const aiResponse = await axios.post(

                "http://127.0.0.1:8000/api/verify",

                form,

                {
                    headers: {
                        ...form.getHeaders()
                    },

                    maxContentLength:
                        Infinity,

                    maxBodyLength:
                        Infinity,

                    timeout: 120000
                }
            );


            // -------------------------------------------------
            // Return AI result to frontend
            // -------------------------------------------------

            return res.status(200).json(
                aiResponse.data
            );

        }

        catch (error) {

            console.error(
                "Verification error:",
                error.message
            );


            // AI service error
            if (error.response) {

                return res.status(
                    error.response.status || 500
                ).json({

                    success: false,

                    message:
                        "AI verification service returned an error",

                    error:
                        error.response.data
                });
            }


            // Connection error
            if (
                error.code ===
                "ECONNREFUSED"
            ) {

                return res.status(503).json({

                    success: false,

                    message:
                        "AI service is not running. Start FastAPI on port 8000."
                });
            }


            // Other error
            return res.status(500).json({

                success: false,

                message:
                    "Document verification failed",

                error:
                    error.message
            });
        }
    }
);


// =========================================================
// MULTER ERROR HANDLER
// =========================================================

router.use(
    (error, req, res, next) => {

        if (
            error instanceof multer.MulterError
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "File upload error",

                error:
                    error.message
            });
        }


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.message
            });
        }

        next();
    }
);


module.exports = router;