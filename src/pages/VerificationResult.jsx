import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  Fingerprint,
  Lock,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import DocumentUpload from "../components/DocumentUpload";

export default function VerifyDocument() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [method, setMethod] = useState("upload");
  const [isScanning, setIsScanning] = useState(false);

  const startVerification = () => {
    if (!file && method === "upload") {
      alert("Please upload a document first.");
      return;
    }

    setIsScanning(true);

    setTimeout(() => {
      navigate("/result");
    }, 1800);
  };

  return (
    <div className="verify-page">

      <div className="page-heading">
        <div>
          <div className="heading-kicker">
            <Sparkles size={15} />
            AI DOCUMENT ANALYSIS
          </div>

          <h1>Verify a document</h1>

          <p>
            Upload a document and let our AI investigate
            its authenticity.
          </p>
        </div>

        <div className="secure-pill">
          <Lock size={14} />
          End-to-end encrypted
        </div>
      </div>

      <div className="verification-layout">

        {/* LEFT */}
        <div className="verification-main">

          <div className="method-tabs">
            <button
              className={method === "upload" ? "active" : ""}
              onClick={() => setMethod("upload")}
            >
              <UploadCloud size={18} />
              Upload document
            </button>

            <button
              className={method === "qr" ? "active" : ""}
              onClick={() => setMethod("qr")}
            >
              <QrCode size={18} />
              Scan QR code
            </button>
          </div>

          {method === "upload" ? (
            <DocumentUpload onFileSelect={setFile} />
          ) : (
            <div className="qr-scanner">
              <div className="scanner-frame">
                <div className="corner top-left" />
                <div className="corner top-right" />
                <div className="corner bottom-left" />
                <div className="corner bottom-right" />

                <div className="scanner-line" />

                <QrCode size={95} strokeWidth={1.2} />
              </div>

              <h3>Scan document QR code</h3>

              <p>
                Position the QR code inside the frame.
                We'll validate its embedded information.
              </p>

              <button
                className="secondary-button"
                onClick={() => alert("Camera scanner will connect here.")}
              >
                Open camera
              </button>
            </div>
          )}

          <div className="analysis-preview">
            <div className="preview-header">
              <div>
                <span className="panel-kicker">
                  ANALYSIS PIPELINE
                </span>

                <h2>What our AI checks</h2>
              </div>

              <span className="pipeline-status">
                <span />
                Ready
              </span>
            </div>

            <div className="pipeline">

              <PipelineItem
                number="01"
                icon={<ScanLine size={19} />}
                title="Document structure"
                text="Layout, fonts and visual consistency"
              />

              <div className="pipeline-connector" />

              <PipelineItem
                number="02"
                icon={<Fingerprint size={19} />}
                title="Tamper detection"
                text="Pixel-level manipulation analysis"
              />

              <div className="pipeline-connector" />

              <PipelineItem
                number="03"
                icon={<FileCheck2 size={19} />}
                title="Data extraction"
                text="OCR and information matching"
              />

              <div className="pipeline-connector" />

              <PipelineItem
                number="04"
                icon={<ShieldCheck size={19} />}
                title="Fraud assessment"
                text="AI confidence and risk scoring"
              />
            </div>
          </div>

          <button
            className="verify-button"
            onClick={startVerification}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <span className="button-spinner" />
                AI is analyzing...
              </>
            ) : (
              <>
                Start AI verification
                <ArrowRight size={19} />
              </>
            )}
          </button>

          <div className="privacy-note">
            <Lock size={14} />
            Files are automatically removed after verification.
          </div>
        </div>

        {/* RIGHT */}
        <aside className="verification-side">

          <div className="side-card ai-card">
            <div className="ai-glow" />

            <div className="ai-icon">
              <Sparkles size={22} />
            </div>

            <span className="panel-kicker">
              AI ENGINE
            </span>

            <h3>Forensic Intelligence</h3>

            <p>
              Our analysis engine looks beyond simple OCR.
              It investigates visual, structural and metadata
              signals.
            </p>

            <div className="ai-tags">
              <span>OCR</span>
              <span>Metadata</span>
              <span>Tamper AI</span>
              <span>QR</span>
            </div>
          </div>

          <div className="side-card tips-card">
            <h3>For best results</h3>

            <Tip
              icon={<CheckCircle2 />}
              text="Use the original document whenever possible."
            />

            <Tip
              icon={<CheckCircle2 />}
              text="Make sure all four corners are visible."
            />

            <Tip
              icon={<CheckCircle2 />}
              text="Avoid blurry or heavily compressed images."
            />
          </div>

          <div className="side-card security-card">
            <ShieldCheck size={21} />

            <div>
              <strong>Secure verification</strong>
              <span>
                Your documents are encrypted during
                processing.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PipelineItem({
  number,
  icon,
  title,
  text,
}) {
  return (
    <div className="pipeline-item">
      <div className="pipeline-number">{number}</div>

      <div className="pipeline-icon">{icon}</div>

      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}

function Tip({ icon, text }) {
  return (
    <div className="tip">
      {icon}
      <span>{text}</span>
    </div>
  );
}