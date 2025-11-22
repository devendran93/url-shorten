import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddLinkForm from "../components/AddLinkForm";
import LinkTable from "../components/LinkTable";
import axios from "axios";
import { API } from "../api"; // Your backend base URL

export default function Dashboard() {

  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleStats = () => {
    if (!code) return alert("Please enter a code");
    // Navigate to /stats/:code page
    navigate(`/code/${code}`);
  };

  const [links, setLinks] = useState([]);

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API}/codes`); // Make sure backend route exists
      setLinks(res.data.data || []);
    } catch (err) {
      console.error("Fetch links error:", err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">URL Shortener</h1>
      <AddLinkForm refresh={fetchLinks} />
      <LinkTable links={links} />
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="border-2 border-black px-2 py-1 rounded"
        />
        <button
          onClick={handleStats}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500"
        >
          Stats
        </button>
      </div>
    </div>

  );
}
