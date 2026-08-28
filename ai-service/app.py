
import io
import re
import os
from datetime import datetime

import cv2
import numpy as np
import pytesseract
import fitz  # PyMuPDF

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pyzbar.pyzbar import decode as pyzbar_decode


# ============================================================
# TESSERACT CONFIGURATION
# ============================================================

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


# ============================================================
# FASTAPI CONFIGURATION
# ============================================================

app = FastAPI(
    title="AI Document Verification",
    version="3.0.0",
    description="OCR, QR/2D barcode detection and document verification service"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():
    return {
        "success": True,
        "service": "AI Document Verification",
        "version": "3.0.0",
        "endpoints": {
            "verify": "/api/verify",
            "ocr": "/api/ocr",
            "qr": "/api/qr"
        }
    }


# ============================================================
# FILE VALIDATION
# ============================================================

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/tiff"
}

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".bmp",
    ".tif",
    ".tiff",
    ".pdf"
}


def is_pdf(filename: str, content_type: str) -> bool:
    filename = filename or ""
    content_type = content_type or ""

    return (
        content_type.lower() == "application/pdf"
        or filename.lower().endswith(".pdf")
    )


def validate_file(filename: str, content_type: str) -> bool:
    filename = filename or ""
    content_type = content_type or ""

    extension = os.path.splitext(filename.lower())[1]

    if extension not in ALLOWED_EXTENSIONS:
        return False

    if is_pdf(filename, content_type):
        return True

    if content_type in ALLOWED_IMAGE_TYPES:
        return True

    # Some browsers send generic MIME types
    if extension in {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".bmp",
        ".tif",
        ".tiff"
    }:
        return True

    return False


# ============================================================
# PDF -> IMAGES
# Using PyMuPDF instead of pdf2image/Poppler
# ============================================================

def pdf_to_images(pdf_bytes: bytes):
    """
    Convert PDF pages into PIL images using PyMuPDF.

    This does NOT require Poppler.
    """

    images = []

    try:
        pdf_document = fitz.open(
            stream=pdf_bytes,
            filetype="pdf"
        )

        for page_index in range(len(pdf_document)):

            page = pdf_document.load_page(page_index)

            # High quality rendering
            matrix = fitz.Matrix(2.5, 2.5)

            pixmap = page.get_pixmap(
                matrix=matrix,
                alpha=False
            )

            image_bytes = pixmap.tobytes("png")

            image = Image.open(
                io.BytesIO(image_bytes)
            ).convert("RGB")

            images.append(image)

        pdf_document.close()

        return images

    except Exception as e:
        print("PDF conversion error:", repr(e))
        return []


# ============================================================
# IMAGE CONVERSION
# ============================================================

def pil_to_cv(image: Image.Image):
    """
    PIL image -> OpenCV BGR image.
    """

    image = image.convert("RGB")

    array = np.array(image)

    return cv2.cvtColor(
        array,
        cv2.COLOR_RGB2BGR
    )


def bytes_to_image(file_bytes: bytes):
    """
    Convert uploaded image bytes into OpenCV image.
    """

    try:

        array = np.frombuffer(
            file_bytes,
            dtype=np.uint8
        )

        image = cv2.imdecode(
            array,
            cv2.IMREAD_COLOR
        )

        return image

    except Exception as e:

        print(
            "Image decode error:",
            repr(e)
        )

        return None


# ============================================================
# IMAGE PREPROCESSING
# ============================================================

def create_ocr_images(image):
    """
    Create multiple image versions for better OCR.
    """

    if image is None:
        return []

    images = []

    # --------------------------------------------------------
    # Original
    # --------------------------------------------------------

    images.append(image)

    # --------------------------------------------------------
    # Upscaled
    # --------------------------------------------------------

    height, width = image.shape[:2]

    scale = 2

    upscaled = cv2.resize(
        image,
        (
            width * scale,
            height * scale
        ),
        interpolation=cv2.INTER_CUBIC
    )

    images.append(upscaled)

    # --------------------------------------------------------
    # Grayscale
    # --------------------------------------------------------

    gray = cv2.cvtColor(
        upscaled,
        cv2.COLOR_BGR2GRAY
    )

    images.append(gray)

    # --------------------------------------------------------
    # Contrast enhancement
    # --------------------------------------------------------

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8)
    )

    enhanced = clahe.apply(gray)

    images.append(enhanced)

    # --------------------------------------------------------
    # OTSU
    # --------------------------------------------------------

    _, otsu = cv2.threshold(
        enhanced,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )

    images.append(otsu)

    # --------------------------------------------------------
    # Adaptive threshold
    # --------------------------------------------------------

    adaptive = cv2.adaptiveThreshold(
        enhanced,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31,
        11
    )

    images.append(adaptive)

    return images


# ============================================================
# OCR
# ============================================================

def run_ocr(image):
    """
    Run Tesseract OCR using multiple preprocessing methods.
    """

    if image is None:
        return ""

    processed_images = create_ocr_images(image)

    all_text = []

    configs = [
        "--psm 6",
        "--psm 11",
        "--psm 12"
    ]

    for img in processed_images:

        for config in configs:

            try:

                text = pytesseract.image_to_string(
                    img,
                    config=config
                )

                if text and len(text.strip()) > 5:
                    all_text.append(text)

            except Exception as e:

                print(
                    "OCR error:",
                    repr(e)
                )

    # --------------------------------------------------------
    # Remove duplicate OCR blocks
    # --------------------------------------------------------

    unique_text = []

    seen = set()

    for text in all_text:

        normalized = re.sub(
            r"\s+",
            " ",
            text.strip().lower()
        )

        if normalized not in seen:

            seen.add(normalized)

            unique_text.append(text)

    return "\n".join(unique_text)


# ============================================================
# QR CODE - OPENCV
# ============================================================

def detect_qr_opencv(image):

    results = []

    if image is None:
        return results

    detector = cv2.QRCodeDetector()

    images = [image]

    try:

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        images.append(gray)

        height, width = image.shape[:2]

        enlarged = cv2.resize(
            image,
            (
                width * 2,
                height * 2
            ),
            interpolation=cv2.INTER_CUBIC
        )

        images.append(enlarged)

    except Exception as e:

        print(
            "QR preprocessing error:",
            repr(e)
        )

    for img in images:

        try:

            data, points, _ = detector.detectAndDecode(img)

            if data:

                data = data.strip()

                if data and data not in results:

                    results.append(data)

        except Exception as e:

            print(
                "OpenCV QR error:",
                repr(e)
            )

    return results


# ============================================================
# QR / BARCODE - PYZBAR
# ============================================================

def detect_barcodes_pyzbar(image):

    results = []

    if image is None:
        return results

    images = [image]

    try:

        gray = cv2.cvtColor(
            image,
            cv2.COLOR_BGR2GRAY
        )

        images.append(gray)

        height, width = image.shape[:2]

        enlarged = cv2.resize(
            image,
            (
                width * 3,
                height * 3
            ),
            interpolation=cv2.INTER_CUBIC
        )

        images.append(enlarged)

    except Exception as e:

        print(
            "Barcode preprocessing error:",
            repr(e)
        )

    for img in images:

        try:

            decoded = pyzbar_decode(img)

            for item in decoded:

                try:

                    data = item.data.decode(
                        "utf-8",
                        errors="ignore"
                    ).strip()

                except Exception:

                    data = str(item.data)

                if data and data not in results:

                    results.append(data)

        except Exception as e:

            # pyzbar can fail if ZBar is not installed.
            print(
                "PyZBar error:",
                repr(e)
            )

    return results


# ============================================================
# COMBINED QR / BARCODE
# ============================================================

def detect_qr_and_barcodes(image):

    results = []

    # OpenCV
    results.extend(
        detect_qr_opencv(image)
    )

    # PyZBar
    results.extend(
        detect_barcodes_pyzbar(image)
    )

    # Remove duplicates
    final_results = []

    for value in results:

        value = value.strip()

        if value and value not in final_results:

            final_results.append(value)

    return final_results


# ============================================================
# OCR NORMALIZATION
# ============================================================

def normalize_text(text):

    if not text:
        return ""

    text = text.replace(
        "\x00",
        " "
    )

    replacements = {

        "—": "-",
        "–": "-",
        "−": "-",

        "“": '"',
        "”": '"',

        "‘": "'",
        "’": "'"
    }

    for old, new in replacements.items():

        text = text.replace(
            old,
            new
        )

    text = re.sub(
        r"[ \t]+",
        " ",
        text
    )

    return text


# ============================================================
# CERTIFICATE NUMBER
# ============================================================

def clean_certificate_number(value):

    if not value:
        return None

    value = value.upper()

    value = value.replace(
        " ",
        ""
    )

    value = value.replace(
        "~",
        ""
    )

    value = value.replace(
        "_",
        ""
    )

    value = value.replace(
        "|",
        ""
    )

    # OCR O -> 0 when next to digits
    value = re.sub(
        r"(?<=\d)O",
        "0",
        value
    )

    value = re.sub(
        r"O(?=\d)",
        "0",
        value
    )

    value = re.sub(
        r"[.,:;]+$",
        "",
        value
    )

    return value


def extract_certificate_number(text):

    if not text:
        return None

    text = normalize_text(text)

    patterns = [

        # Certificate No: TN-123456
        r"certificate\s*(?:no|number)\s*[:.\-]?\s*([A-Z]{1,5}[-\s~]*\d[\dA-Z~\-\s]{5,30})",

        # Certificate No TN-123456
        r"certificate\s*(?:no|number)\s+([A-Z]{1,5}[-\s~]*\d[\dA-Z~\-\s]{5,30})",

        # TN-123456
        r"\b(TN[-\s~]?\d{6,25})\b",

        # TH-123456
        r"\b(TH[-\s~]?\d{6,25})\b",

        # Generic
        r"\b([A-Z]{2,5}[-]\d{6,25})\b"
    ]

    candidates = []

    for pattern in patterns:

        matches = re.findall(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        for match in matches:

            if isinstance(match, tuple):

                match = match[0]

            cleaned = clean_certificate_number(
                match
            )

            if cleaned:

                candidates.append(
                    cleaned
                )

    # Prefer TN
    for candidate in candidates:

        if candidate.startswith("TN-"):
            return candidate

    # Prefer TH
    for candidate in candidates:

        if candidate.startswith("TH-"):
            return candidate

    if candidates:
        return candidates[0]

    return None


# ============================================================
# CERTIFICATE TYPE
# ============================================================

def extract_certificate_type(text):

    if not text:
        return None

    lower = text.lower()

    certificate_types = [

        (
            "Income Certificate",
            [
                "income certificate",
                "income cert",
                "income"
            ]
        ),

        (
            "Community Certificate",
            [
                "community certificate",
                "community cert"
            ]
        ),

        (
            "Nativity Certificate",
            [
                "nativity certificate",
                "nativity cert"
            ]
        ),

        (
            "Residence Certificate",
            [
                "residence certificate",
                "residential certificate"
            ]
        ),

        (
            "Tree Certificate",
            [
                "tree certificate",
                "tree me certificate",
                "tree certificate me"
            ]
        ),

        (
            "Birth Certificate",
            [
                "birth certificate"
            ]
        ),

        (
            "Death Certificate",
            [
                "death certificate"
            ]
        ),

        (
            "Legal Heir Certificate",
            [
                "legal heir certificate",
                "legal heir"
            ]
        ),

        (
            "First Graduate Certificate",
            [
                "first graduate certificate",
                "first graduate"
            ]
        )
    ]

    for certificate_name, keywords in certificate_types:

        for keyword in keywords:

            if keyword in lower:

                return certificate_name

    # OCR tolerant fallback

    if "income" in lower and "cert" in lower:
        return "Income Certificate"

    if "community" in lower and "cert" in lower:
        return "Community Certificate"

    if "nativity" in lower and "cert" in lower:
        return "Nativity Certificate"

    if "residence" in lower and "cert" in lower:
        return "Residence Certificate"

    return None


# ============================================================
# NAME EXTRACTION
# ============================================================

def clean_name(name):

    if not name:
        return None

    name = name.strip()

    name = re.sub(
        r"\s+",
        " ",
        name
    )

    name = re.sub(
        r"^[^A-Za-z]+",
        "",
        name
    )

    name = re.sub(
        r"[^A-Za-z .'-]+$",
        "",
        name
    )

    if len(name) < 3:
        return None

    return name


def extract_name(text):

    if not text:
        return None

    lines = [
        line.strip()
        for line in text.splitlines()
        if line.strip()
    ]

    patterns = [

        # This is to certify that Thiru X son
        r"this\s+is\s+to\s+certify\s+that\s+thiru\s+([A-Za-z .'-]+?)\s+(?:son|daughter|s/o|d/o|residing|resides)",

        # certify that Thiru X son
        r"certify\s+that\s+thiru\s+([A-Za-z .'-]+?)\s+(?:son|daughter|s/o|d/o)",

        # Name: X
        r"(?:name|applicant\s+name)\s*[:\-]\s*([A-Za-z .'-]{3,60})"
    ]

    for pattern in patterns:

        matches = re.findall(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        if matches:

            name = clean_name(
                matches[0]
            )

            if name:
                return name

    # Line-based fallback

    for line in lines:

        lower = line.lower()

        if (
            "this is to certify that" in lower
            and "thiru" in lower
        ):

            try:

                after = re.split(
                    r"thiru",
                    line,
                    flags=re.IGNORECASE
                )[1]

                after = re.split(
                    r"\b(son|daughter|s/o|d/o|residing)\b",
                    after,
                    flags=re.IGNORECASE
                )[0]

                name = clean_name(after)

                if name:
                    return name

            except Exception:
                pass

    return None


# ============================================================
# DATE EXTRACTION
# ============================================================

DATE_PATTERNS = [

    r"\b\d{2}[-/]\d{2}[-/]\d{4}\b",

    r"\b\d{1,2}[-/]\d{1,2}[-/]\d{4}\b",

    r"\b\d{2}[-/][A-Za-z]{3}[-/]\d{4}\b",

    r"\b\d{1,2}[-/][A-Za-z]{3}[-/]\d{4}\b"
]


def normalize_date(value):

    if not value:
        return None

    value = value.strip()

    formats = [

        "%d-%m-%Y",
        "%d/%m/%Y",

        "%d-%b-%Y",
        "%d/%b/%Y",

        "%d-%B-%Y",
        "%d/%B/%Y"
    ]

    for fmt in formats:

        try:

            dt = datetime.strptime(
                value,
                fmt
            )

            return dt.strftime(
                "%d-%m-%Y"
            )

        except Exception:
            pass

    return value


def extract_dates(text):

    if not text:
        return None, None

    text = normalize_text(text)

    # --------------------------------------------------------
    # Explicit validity period
    # --------------------------------------------------------

    patterns = [

        r"certificate\s+validity\s+period\s*[:\-]?\s*"
        r"(\d{1,2}[-/]\d{1,2}[-/]\d{4})"
        r"\s+to\s+"
        r"(\d{1,2}[-/]\d{1,2}[-/]\d{4})",

        r"validity\s+period\s*[:\-]?\s*"
        r"(\d{1,2}[-/]\d{1,2}[-/]\d{4})"
        r"\s+to\s+"
        r"(\d{1,2}[-/]\d{1,2}[-/]\d{4})",

        r"valid\s+from\s*[:\-]?\s*"
        r"(\d{1,2}[-/]\d{1,2}[-/]\d{4})"
        r"\s+(?:to|until|-)\s+"
        r"(\d{1,2}[-/]\d{1,2}[-/]\d{4})"
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        if match:

            return (
                normalize_date(
                    match.group(1)
                ),
                normalize_date(
                    match.group(2)
                )
            )

    # --------------------------------------------------------
    # Generic date list
    # --------------------------------------------------------

    dates = []

    for pattern in DATE_PATTERNS:

        matches = re.findall(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        for value in matches:

            normalized = normalize_date(
                value
            )

            if (
                normalized
                and normalized not in dates
            ):

                dates.append(
                    normalized
                )

    if len(dates) >= 2:

        return (
            dates[0],
            dates[1]
        )

    return None, None


# ============================================================
# URL EXTRACTION
# ============================================================

def clean_url(url):

    if not url:
        return None

    url = url.strip()

    url = url.rstrip(
        ".,;:)]}>\"'"
    )

    # OCR sometimes inserts spaces
    url = url.replace(
        " ",
        ""
    )

    # OCR typo
    if url.lower().startswith("http3://"):

        url = (
            "https://"
            + url[8:]
        )

    if url.lower().startswith("htps://"):

        url = (
            "https://"
            + url[7:]
        )

    if url.lower().startswith("www."):

        url = (
            "https://"
            + url
        )

    if not url.lower().startswith(
        ("http://", "https://")
    ):

        return None

    return url


def extract_verification_url(text):

    if not text:
        return None

    patterns = [

        r"https?://[^\s<>\"']+",

        r"www\.[^\s<>\"']+",

        r"https?\s*:\s*/\s*/[^\s<>\"']+"
    ]

    candidates = []

    for pattern in patterns:

        matches = re.findall(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        for match in matches:

            url = clean_url(match)

            if (
                url
                and url not in candidates
            ):

                candidates.append(url)

    # Prefer verification URL
    for url in candidates:

        lower = url.lower()

        if (
            "verify" in lower
            or "verification" in lower
            or "certificate" in lower
            or "tnedistrict" in lower
        ):

            return url

    if candidates:
        return candidates[0]

    return None


# ============================================================
# EXPIRY CHECK
# ============================================================

def check_expiry(valid_to):

    if not valid_to:
        return None

    try:

        expiry_date = datetime.strptime(
            valid_to,
            "%d-%m-%Y"
        ).date()

        today = datetime.now().date()

        return expiry_date < today

    except Exception as e:

        print(
            "Expiry check error:",
            repr(e)
        )

        return None


# ============================================================
# DOCUMENT ANALYSIS
# ============================================================

def analyze_document(text, qr_codes):

    text = normalize_text(text)

    certificate_number = (
        extract_certificate_number(text)
    )

    certificate_type = (
        extract_certificate_type(text)
    )

    name = (
        extract_name(text)
    )

    valid_from, valid_to = (
        extract_dates(text)
    )

    verification_url = (
        extract_verification_url(text)
    )

    expired = (
        check_expiry(valid_to)
    )

    qr_detected = (
        len(qr_codes) > 0
    )

    checks = {

        "document_readable":
            len(text.strip()) > 20,

        "certificate_number_found":
            certificate_number is not None,

        "certificate_type_found":
            certificate_type is not None,

        "name_found":
            name is not None,

        "validity_dates_found":
            valid_from is not None
            and valid_to is not None,

        "verification_url_found":
            verification_url is not None,

        "qr_detected":
            qr_detected,

        "expired":
            expired is True
            if expired is not None
            else False
    }

    # ========================================================
    # SCORE
    # ========================================================

    score = 0

    if checks["document_readable"]:
        score += 10

    if checks["certificate_number_found"]:
        score += 20

    if checks["certificate_type_found"]:
        score += 10

    if checks["name_found"]:
        score += 15

    if checks["validity_dates_found"]:
        score += 15

    if checks["verification_url_found"]:
        score += 10

    if checks["qr_detected"]:
        score += 20

    # ========================================================
    # STATUS
    # ========================================================

    if expired is True:

        status = "EXPIRED"

        verified = False

    elif score >= 80:

        status = "VERIFIED"

        verified = True

    elif score >= 50:

        status = "PARTIALLY_VERIFIED"

        verified = False

    else:

        status = "NOT_VERIFIED"

        verified = False

    return {

        "verified": verified,

        "verification": {

            "status": status,

            "confidence": score
        },

        "document": {

            "fields": {

                "certificate_number":
                    certificate_number,

                "certificate_type":
                    certificate_type,

                "name":
                    name,

                "valid_from":
                    valid_from,

                "valid_to":
                    valid_to,

                "verification_url":
                    verification_url
            },

            "checks":
                checks
        }
    }


# ============================================================
# PROCESS DOCUMENT
# ============================================================

async def process_document(file: UploadFile):

    filename = (
        file.filename
        or "unknown"
    )

    content_type = (
        file.content_type
        or ""
    )

    # --------------------------------------------------------
    # Read file
    # --------------------------------------------------------

    file_bytes = await file.read()

    if not file_bytes:

        return {

            "success": False,

            "verified": False,

            "filename": filename,

            "message": "Empty file"
        }

    # --------------------------------------------------------
    # Validate
    # --------------------------------------------------------

    if not validate_file(
        filename,
        content_type
    ):

        return {

            "success": False,

            "verified": False,

            "filename": filename,

            "message":
                "Unsupported file type"
        }

    # ========================================================
    # PDF
    # ========================================================

    if is_pdf(
        filename,
        content_type
    ):

        print(
            f"Processing PDF: {filename}"
        )

        pil_images = pdf_to_images(
            file_bytes
        )

        if not pil_images:

            return {

                "success": False,

                "verified": False,

                "filename": filename,

                "message":
                    "Unable to render PDF. "
                    "Make sure the PDF is valid."
            }

        print(
            f"PDF pages detected: {len(pil_images)}"
        )

        combined_text = []

        all_qr_codes = []

        # ----------------------------------------------------
        # Process every PDF page
        # ----------------------------------------------------

        for page_number, pil_image in enumerate(
            pil_images,
            start=1
        ):

            print(
                f"Processing PDF page {page_number}"
            )

            image = pil_to_cv(
                pil_image
            )

            # OCR
            page_text = run_ocr(
                image
            )

            if page_text:

                combined_text.append(
                    f"\n--- PAGE {page_number} ---\n"
                )

                combined_text.append(
                    page_text
                )

            # QR / barcode
            page_codes = (
                detect_qr_and_barcodes(
                    image
                )
            )

            for code in page_codes:

                if code not in all_qr_codes:

                    all_qr_codes.append(
                        code
                    )

        text = "\n".join(
            combined_text
        )

        qr_codes = all_qr_codes

    # ========================================================
    # IMAGE
    # ========================================================

    else:

        print(
            f"Processing image: {filename}"
        )

        image = bytes_to_image(
            file_bytes
        )

        if image is None:

            return {

                "success": False,

                "verified": False,

                "filename": filename,

                "message":
                    "Invalid or unsupported image file"
            }

        text = run_ocr(
            image
        )

        qr_codes = (
            detect_qr_and_barcodes(
                image
            )
        )

    # ========================================================
    # ANALYSIS
    # ========================================================

    print(
        f"OCR text length: {len(text)}"
    )

    print(
        f"QR codes detected: {len(qr_codes)}"
    )

    analysis = analyze_document(
        text,
        qr_codes
    )

    # ========================================================
    # RESPONSE
    # ========================================================

    response = {

        "success": True,

        "verified":
            analysis["verified"],

        "filename":
            filename,

        "verification":
            analysis["verification"],

        "document":
            analysis["document"],

        "ocr": {

            "text_length":
                len(text),

            "extracted_text":
                text
        },

        "qr": {

            "detected":
                len(qr_codes) > 0,

            "codes":
                qr_codes
        },

        "message":
            "Document verification completed"
    }

    return response


# ============================================================
# VERIFY ENDPOINT
# ============================================================

@app.post("/api/verify")
async def verify_document(
    file: UploadFile = File(...)
):

    try:

        return await process_document(
            file
        )

    except Exception as e:

        print(
            "VERIFY ERROR:",
            repr(e)
        )

        return {

            "success": False,

            "verified": False,

            "filename":
                file.filename,

            "message":
                f"Verification failed: {str(e)}"
        }


# ============================================================
# OCR ENDPOINT
# ============================================================

@app.post("/api/ocr")
async def extract_text(
    file: UploadFile = File(...)
):

    try:

        filename = (
            file.filename
            or "unknown"
        )

        content_type = (
            file.content_type
            or ""
        )

        file_bytes = await file.read()

        if not file_bytes:

            return {

                "success": False,

                "filename": filename,

                "message": "Empty file"
            }

        # ----------------------------------------------------
        # PDF
        # ----------------------------------------------------

        if is_pdf(
            filename,
            content_type
        ):

            pages = pdf_to_images(
                file_bytes
            )

            if not pages:

                return {

                    "success": False,

                    "filename": filename,

                    "message":
                        "Unable to render PDF"
                }

            text_parts = []

            for page_number, page in enumerate(
                pages,
                start=1
            ):

                image = pil_to_cv(
                    page
                )

                page_text = run_ocr(
                    image
                )

                text_parts.append(
                    f"\n--- PAGE {page_number} ---\n"
                    + page_text
                )

            text = "\n".join(
                text_parts
            )

        # ----------------------------------------------------
        # IMAGE
        # ----------------------------------------------------

        else:

            image = bytes_to_image(
                file_bytes
            )

            if image is None:

                return {

                    "success": False,

                    "filename": filename,

                    "message":
                        "Invalid or unsupported image file"
                }

            text = run_ocr(
                image
            )

        return {

            "success": True,

            "filename":
                filename,

            "message":
                "OCR completed successfully",

            "text_length":
                len(text),

            "extracted_text":
                text
        }

    except Exception as e:

        print(
            "OCR ERROR:",
            repr(e)
        )

        return {

            "success": False,

            "message":
                f"OCR failed: {str(e)}"
        }


# ============================================================
# QR / BARCODE ENDPOINT
# ============================================================

@app.post("/api/qr")
async def read_qr(
    file: UploadFile = File(...)
):

    try:

        filename = (
            file.filename
            or "unknown"
        )

        content_type = (
            file.content_type
            or ""
        )

        file_bytes = await file.read()

        if not file_bytes:

            return {

                "success": False,

                "filename": filename,

                "qr_detected": False,

                "qr_codes": [],

                "message": "Empty file"
            }

        all_codes = []

        # ----------------------------------------------------
        # PDF
        # ----------------------------------------------------

        if is_pdf(
            filename,
            content_type
        ):

            pages = pdf_to_images(
                file_bytes
            )

            if not pages:

                return {

                    "success": False,

                    "filename": filename,

                    "qr_detected": False,

                    "qr_codes": [],

                    "message":
                        "Unable to render PDF"
                }

            for page in pages:

                image = pil_to_cv(
                    page
                )

                codes = (
                    detect_qr_and_barcodes(
                        image
                    )
                )

                for code in codes:

                    if code not in all_codes:

                        all_codes.append(
                            code
                        )

        # ----------------------------------------------------
        # IMAGE
        # ----------------------------------------------------

        else:

            image = bytes_to_image(
                file_bytes
            )

            if image is None:

                return {

                    "success": False,

                    "filename": filename,

                    "qr_detected": False,

                    "qr_codes": [],

                    "message":
                        "Invalid or unsupported image file"
                }

            all_codes = (
                detect_qr_and_barcodes(
                    image
                )
            )

        return {

            "success": True,

            "qr_detected":
                len(all_codes) > 0,

            "qr_codes":
                all_codes,

            "message":

                (
                    "QR/2D barcode detected successfully"

                    if all_codes

                    else

                    "No QR/2D barcode detected"
                )
        }

    except Exception as e:

        print(
            "QR ERROR:",
            repr(e)
        )

        return {

            "success": False,

            "qr_detected": False,

            "qr_codes": [],

            "message":
                f"QR detection failed: {str(e)}"
        }


# ============================================================
# SERVER
# ============================================================

# Run with:
#
# uvicorn app:app --reload
#
# ============================================================

