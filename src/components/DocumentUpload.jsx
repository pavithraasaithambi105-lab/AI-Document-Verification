import { useRef, useState } from "react";
import {
  CloudUpload,
  FileText,
  X,
  ScanLine,
} from "lucide-react";

export default function DocumentUpload({ onFileSelect }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);

    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];

    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      className={`upload-zone ${dragging ? "dragging" : ""} ${
        file ? "has-file" : ""
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !file && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!file ? (
        <>
          <div className="upload-orbit">
            <div className="upload-circle">
              <CloudUpload size={30} />
            </div>
          </div>

          <h3>Drop your document here</h3>

          <p>
            or <span>browse files</span> from your computer
          </p>

          <div className="upload-formats">
            <span>PDF</span>
            <span>JPG</span>
            <span>PNG</span>
            <small>Maximum 20MB</small>
          </div>

          <div className="upload-security">
            <ScanLine size={15} />
            Your document is encrypted during analysis
          </div>
        </>
      ) : (
        <div className="selected-file">
          <div className="file-icon">
            <FileText size={27} />
          </div>

          <div className="file-info">
            <strong>{file.name}</strong>
            <span>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>

          <button
            className="remove-file"
            onClick={(e) => {
              e.stopPropagation();
              removeFile();
            }}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}