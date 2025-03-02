import { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedPII, setSelectedPII] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [redactError, setRedactError] = useState(null);

  // File validation
  const isValidFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf"
    ];
    return file && validTypes.includes(file.type);
  };

  // File upload handler
  const handleUpload = async () => {
    setUploadError(null);
    setRedactError(null);
    
    if (!file) {
      setUploadError("Please select a file");
      return;
    }

    if (!isValidFile(file)) {
      setUploadError("Invalid file type. Please upload JPG, PNG, or PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload", 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(
        error.response?.data?.error || "File upload failed. Please try again."
      );
    }
  };

  // Redaction handler
  const handleRedaction = async () => {
    setRedactError(null);
    
    if (!result || selectedPII.length === 0) {
      setRedactError("Please select PII to redact");
      return;
    }

    setProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("selectedPII", JSON.stringify(selectedPII));

      const response = await axios.post(
        "http://localhost:3000/redact",
        formData,
        {
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "secured-document.png");
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

    } catch (error) {
      console.error("Redaction error:", error);
      
      try {
        if (error.response?.data) {
          const errorBlob = await new Response(error.response.data).json();
          setRedactError(errorBlob.error || "Redaction failed");
        }
      } catch (parseError) {
        setRedactError("Failed to process document");
      }
    } finally {
      setProcessing(false);
    }
  };

  // Risk level classification
  const riskLevel = (score) => {
    if (score > 7) return "High Risk - Sensitive Information";
    if (score > 4) return "Moderate Risk";
    return "Low Risk";
  };

  return (
    <div className="container">
      <h1 className="title">Document Security Scanner</h1>
      
      {/* File Upload Section */}
      <div className="upload-section">
        <input
          type="file"
          id="fileInput"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".png, .jpg, .jpeg, .pdf"
          disabled={processing}
        />
        <button 
          onClick={handleUpload}
          disabled={processing}
          className="btn upload-btn"
        >
          Upload Document
        </button>
      </div>

      {/* Error Messages */}
      {uploadError && <div className="alert error">{uploadError}</div>}
      {redactError && <div className="alert error">{redactError}</div>}

      {/* Results Display */}
      {result && (
        <div>
          <h3>Detected PII:</h3>
          <pre>{JSON.stringify(result.piiData, null, 2)}</pre>

          <h3>Risk Score: {result.riskScore}</h3>
          <h3>Risk Level: {riskLevel(result.riskScore)}</h3>

        
          <h3>Select Information to Redact</h3>
          {Object.keys(result.piiData).map((piiType) => (
            <label key={piiType} style={{ display: "block", margin: "5px 0" }}>
              <input
                type="checkbox"
                checked={selectedPII.includes(piiType)}
                onChange={(e) =>
                  setSelectedPII((prev) =>
                    e.target.checked
                      ? [...prev, piiType]
                      : prev.filter((t) => t !== piiType)
                  )
                }
              />
              {piiType}
            </label>
          ))}

{/* // Modify your button text */}
          <button
            onClick={handleRedaction}
            disabled={processing || !file}
            style={{ margin: "10px", padding: "10px" }}
          >
            {processing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status"></span>
                Generating Document...
              </>
            ) : (
              "Download Redacted Document"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;