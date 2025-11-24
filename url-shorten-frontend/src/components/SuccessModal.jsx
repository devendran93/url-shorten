import React from "react";

export default function SuccessModal({ url, onClose }) {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Copied to clipboard 📋");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-80 shadow-lg text-center">
        <h2 className="text-xl font-semibold mb-3 text-blue-600">Short URL Created 🎉</h2>

        <div className="border rounded-md bg-gray-100 p-2 text-sm break-all">
          {url} {/* 👈 This now shows backend short URL */}
        </div>

        <button
          onClick={copyToClipboard}
          className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
        >
          Copy Link 📋
        </button>

        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
