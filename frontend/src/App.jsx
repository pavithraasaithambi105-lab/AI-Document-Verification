import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError("");
  };

  const verifyDocument = async () => {
    if (!file) {
      setError("Please select a document first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/verify",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Verification request failed.");
      }

      const data = await response.json();

      console.log("Verification Result:", data);

      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to connect to the AI verification server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">✓</div>

          <div>
            <h1>DocVerify AI</h1>
            <span>Intelligent Document Verification</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container">

        <div className="hero">
          <h2>Verify your document</h2>

          <p>
            Upload a certificate or document and let AI
            analyze its authenticity.
          </p>
        </div>

        {/* UPLOAD CARD */}
        <section className="upload-card">

          <div className="section-title">
            <div>
              <h3>Upload Document</h3>
              <p>
                Supported formats: PDF, JPG, PNG, WEBP
              </p>
            </div>
          </div>

          <label className="upload-area">

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />

            <div className="upload-icon">
              ↑
            </div>

            <h4>
              {file
                ? "Document selected"
                : "Choose your document"}
            </h4>

            <p>
              {file
                ? file.name
                : "Click here to browse your files"}
            </p>

          </label>

          {file && (
            <div className="selected-file">
              <div className="file-symbol">
                📄
              </div>

              <div className="file-details">
                <strong>{file.name}</strong>
                <span>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>

              <button
                className="remove-file"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setError("");
                }}
              >
                ×
              </button>
            </div>
          )}

          <button
            className="verify-button"
            onClick={verifyDocument}
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying document...
              </>
            ) : (
              <>
                Verify Document
                <span>→</span>
              </>
            )}
          </button>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

        </section>

        {/* RESULT */}
        {result && (
          <section className="result-card">

            <div className="result-header">
              <div>
                <h3>Verification Result</h3>
                <p>{result.filename}</p>
              </div>

              <div
                className={`status-badge ${
                  result.verified
                    ? "verified"
                    : "not-verified"
                }`}
              >
                {result.verified
                  ? "✓ VERIFIED"
                  : "✕ NOT VERIFIED"}
              </div>
            </div>

            {/* CONFIDENCE */}
            <div className="confidence-card">

              <div className="confidence-info">
                <span>Verification Confidence</span>

                <strong>
                  {result.verification?.confidence ?? 0}%
                </strong>
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${
                      result.verification?.confidence ?? 0
                    }%`,
                  }}
                ></div>
              </div>

              <span className="status-text">
                {result.verification?.status ||
                  "UNKNOWN"}
              </span>

            </div>

            {/* DOCUMENT DETAILS */}
            <div className="details-section">

              <h3>Document Details</h3>

              <div className="details-grid">

                <Detail
                  label="Certificate Number"
                  value={
                    result.document?.fields
                      ?.certificate_number
                  }
                />

                <Detail
                  label="Certificate Type"
                  value={
                    result.document?.fields
                      ?.certificate_type
                  }
                />

                <Detail
                  label="Name"
                  value={
                    result.document?.fields?.name
                  }
                />

                <Detail
                  label="Valid From"
                  value={
                    result.document?.fields
                      ?.valid_from
                  }
                />

                <Detail
                  label="Valid To"
                  value={
                    result.document?.fields
                      ?.valid_to
                  }
                />

                <Detail
                  label="Verification URL"
                  value={
                    result.document?.fields
                      ?.verification_url
                  }
                />

              </div>

            </div>

            {/* CHECKS */}
            <div className="checks-section">

              <h3>Document Checks</h3>

              <div className="checks-grid">

                <Check
                  label="Document readable"
                  value={
                    result.document?.checks
                      ?.document_readable
                  }
                />

                <Check
                  label="Certificate number found"
                  value={
                    result.document?.checks
                      ?.certificate_number_found
                  }
                />

                <Check
                  label="Certificate type found"
                  value={
                    result.document?.checks
                      ?.certificate_type_found
                  }
                />

                <Check
                  label="Name found"
                  value={
                    result.document?.checks
                      ?.name_found
                  }
                />

                <Check
                  label="Validity dates found"
                  value={
                    result.document?.checks
                      ?.validity_dates_found
                  }
                />

                <Check
                  label="Verification URL found"
                  value={
                    result.document?.checks
                      ?.verification_url_found
                  }
                />

                <Check
                  label="QR detected"
                  value={
                    result.document?.checks
                      ?.qr_detected
                  }
                />

                <Check
                  label="Expired"
                  value={
                    result.document?.checks
                      ?.expired
                  }
                  invert
                />

              </div>

            </div>

          </section>
        )}

      </main>

      <footer>
        AI-powered document analysis • Local verification service
      </footer>

    </div>
  );
}


/* DETAIL COMPONENT */

function Detail({ label, value }) {
  return (
    <div className="detail">

      <span>{label}</span>

      <strong>
        {value || "Not found"}
      </strong>

    </div>
  );
}


/* CHECK COMPONENT */

function Check({ label, value, invert = false }) {
  const success = invert ? !value : value;

  return (
    <div
      className={`check ${
        success ? "check-success" : "check-failed"
      }`}
    >

      <div className="check-icon">
        {success ? "✓" : "✕"}
      </div>

      <span>{label}</span>

    </div>
  );
}

export default App;