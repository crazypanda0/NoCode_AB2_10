import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadImage = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const res = await axios.post("http://localhost:3000/upload");
      if (res.status === 200) {
        alert("Upload successful!");
      } else {
        setError("Failed to upload. Try again.");
      }
    } catch (err) {
      setError("Error uploading. Try again later.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center px-5">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Upload File</h1>
      <p className="text-gray-500 mb-6">Select a file to upload</p>
      <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="file"
          onChange={() => setError(null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleUpload}
          className="w-full py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-300 ease-in-out focus:outline-none"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-blue-900 font-semibold underline mt-4"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default UploadImage;
