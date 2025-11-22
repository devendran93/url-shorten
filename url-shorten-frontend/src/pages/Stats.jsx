import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../api";

export default function Stats() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/code/${code}`);
      setData(res.data);
    } catch (err) {
      console.error("Fetch stats error:", err);
      alert("Error fetching data. Check the code or server.");
    }
  };

  useEffect(() => {
    fetchStats();
  }, [code]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this short URL?")) return;
    try {
      await axios.delete(`${API}/delete/${code}`);
      alert("Link deleted successfully");
      navigate("/"); // redirect to dashboard after deletion
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting link");
    }
  };

  if (!data) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto p-4 border shadow mt-6 bg-white space-y-4">
      <h2 className="text-2xl font-bold">Stats for: {code}</h2>
      <p><b>Original URL:</b> {data.url}</p>
      <p><b>Total Clicks:</b> {data.clicks}</p>
      <p><b>Last Clicked:</b> {data.last_clicked || "Never"}</p>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
      >
        Delete Link
      </button>
    </div>
  );
}
