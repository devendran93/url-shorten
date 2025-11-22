import { useState } from "react";
import axios from "axios";
import { API } from "../api";

export default function AddLinkForm({ refresh }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) return setMessage("URL is required");

    setLoading(true);
    try {
      await axios.post(API, { url, code: code || undefined });
      setUrl("");
      setCode("");
      setMessage("Added successfully!");
      refresh();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2 bg-white p-4 rounded shadow">
      {message && <p className="text-sm text-red-600">{message}</p>}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Original URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Custom code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-40 p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          {loading ? "Adding..." : "Add Link"}
        </button>
      </div>
    </form>
  );
}
