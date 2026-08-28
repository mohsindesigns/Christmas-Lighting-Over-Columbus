"use client";

import { useState, useEffect } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import ServicesEditor from "@/components/admin/editors/ServicesEditor";

export default function ServicesPageAdmin() {
  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to load content:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setMessage("Services page content saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save changes.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setMessage("Error saving changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2271b1]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-normal text-[#1d2327] font-serif m-0">Edit Services Page</h1>
          <Link
            href="/services"
            target="_blank"
            className="bg-white border border-[#c3c4c7] text-[#2c3338] text-[12px] px-1.5 py-0.5 rounded-[3px] hover:bg-[#f6f7f7] transition-colors flex items-center gap-1"
          >
            View Page <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#2271b1] text-white text-[13px] font-semibold px-4 py-1.5 rounded-[3px] border border-[#135e96] shadow-[0_1px_0_#135e96] hover:bg-[#135e96] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? "Updating..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded text-xs font-semibold ${
          message.includes("success") ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded-sm p-5">
        <ServicesEditor pageId="services" data={data} setData={setData} />
      </div>
    </div>
  );
}
