"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Calendar, User, Phone, Briefcase, Filter, Search, X, CheckCircle2, AlertCircle, FileDown, ExternalLink, ChevronRight, Download, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesType = filterType === "All" || sub.type === filterType;
      const matchesSearch = 
        (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sub.email && sub.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (sub.message && sub.message.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [submissions, filterType, searchQuery]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubmissions.length && filteredSubmissions.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubmissions.map((s) => String(s._id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const sId = String(id);
    setSelectedIds((prev) =>
      prev.includes(sId) ? prev.filter((item) => item !== sId) : [...prev, sId]
    );
  };

  const deleteSubmissions = async (idsToDelete: string[], confirmMessage?: string) => {
    if (!idsToDelete.length) {
      alert("Please select at least one submission to delete.");
      return;
    }
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setIsDeleting(true);
    setActionNotice(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete submission(s)");
      }

      const idStrings = idsToDelete.map(id => String(id));
      setSubmissions((prev) => prev.filter((s) => !idStrings.includes(String(s._id))));
      setSelectedIds((prev) => prev.filter((id) => !idStrings.includes(String(id))));
      if (selectedSubmission && idStrings.includes(String(selectedSubmission._id))) {
        setSelectedSubmission(null);
      }
      setActionNotice({
        type: 'success',
        message: `Successfully deleted ${idsToDelete.length} submission${idsToDelete.length > 1 ? 's' : ''}.`
      });
      setTimeout(() => setActionNotice(null), 4000);
    } catch (err: any) {
      console.error("Delete Submissions Error:", err);
      alert(err.message || "Failed to delete submission(s).");
      setActionNotice({
        type: 'error',
        message: err.message || "Failed to delete submission(s)."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkApply = () => {
    if (!bulkAction) {
      alert("Please select 'Delete Permanently' from the Bulk actions dropdown first.");
      return;
    }
    if (bulkAction === 'delete') {
      if (selectedIds.length === 0) {
        alert("Please select at least one submission by checking the box next to it.");
        return;
      }
      deleteSubmissions(
        selectedIds,
        `Are you sure you want to permanently delete ${selectedIds.length} submission${selectedIds.length > 1 ? 's' : ''}? This action cannot be undone.`
      );
    }
  };

  const handleDeleteSingle = (id: string, name?: string) => {
    deleteSubmissions(
      [id],
      `Are you sure you want to delete the submission from "${name || 'this contact'}"?`
    );
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-[#646970] font-serif">Loading Submissions...</div>;

  return (
    <div className="space-y-4">
      {/* WP Header Area */}
      <div className="flex items-center gap-4 mb-2">
        <h1 className="text-[23px] font-normal text-[#1d2327] font-serif m-0">Submissions</h1>
      </div>

      {/* Action Notice */}
      {actionNotice && (
        <div
          className={`p-3 text-[13px] rounded-[3px] flex items-center gap-2 border ${
            actionNotice.type === 'success'
              ? 'bg-[#edfaef] text-[#135e96] border-[#00a32a]'
              : 'bg-[#fcf0f1] text-[#d63638] border-[#d63638]'
          }`}
        >
          {actionNotice.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#00a32a] flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-[#d63638] flex-shrink-0" />
          )}
          <span>{actionNotice.message}</span>
        </div>
      )}

      {/* Filter Links */}
      <div className="flex items-center gap-2 text-[13px]">
        {[
          { label: "All", value: "All" },
          { label: "Quotes", value: "Quote Request" },
          { label: "Jobs", value: "Job Application" },
          { label: "Inquiries", value: "Contact Form" },
          { label: "Newsletter", value: "Newsletter" },
        ].map((opt, idx, arr) => (
          <React.Fragment key={opt.value}>
            <button onClick={() => setFilterType(opt.value)} className={`${filterType === opt.value ? 'text-black font-bold' : 'text-[#2271b1] hover:text-[#135e96] underline decoration-transparent hover:decoration-current'}`}>
              {opt.label} <span className="text-[#646970] font-normal">({submissions.filter(s => opt.value === 'All' || s.type === opt.value).length})</span>
            </button>
            {idx < arr.length - 1 && <span className="text-[#c3c4c7]">|</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Top Bar: Bulk Actions & Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="border border-[#8c8f94] bg-white text-[#2c3338] px-2 py-1 text-[13px] rounded-[3px] outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] cursor-pointer"
          >
            <option value="">Bulk actions</option>
            <option value="delete">Delete Permanently</option>
          </select>
          <button
            type="button"
            onClick={handleBulkApply}
            disabled={isDeleting}
            className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7] transition-colors disabled:opacity-50 cursor-pointer font-medium"
          >
            {isDeleting ? "Applying..." : "Apply"}
          </button>
          {selectedIds.length > 0 && (
            <span className="text-[12px] text-[#2271b1] font-semibold ml-1">
              ({selectedIds.length} selected)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
           <input
             type="text"
             placeholder="Search Leads"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="border border-[#8c8f94] bg-white px-3 py-1 text-[13px] rounded-[3px] outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
           />
           <button className="bg-white border border-[#8c8f94] text-[#2c3338] px-3 py-1 text-[13px] rounded-[3px] hover:bg-[#f6f7f7] transition-colors">Search</button>
        </div>
      </div>

      {/* WP-Style Table */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden shadow-[0_1px_1px_rgba(0,0,0,0.04)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-[#c3c4c7] text-[#1d2327]">
              <th className="w-8 py-2 px-3">
                <input
                  type="checkbox"
                  checked={filteredSubmissions.length > 0 && selectedIds.length === filteredSubmissions.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 border-[#8c8f94] rounded-[3px] cursor-pointer"
                />
              </th>
              <th className="py-2 px-3 text-[14px] font-semibold">Contact</th>
              <th className="py-2 px-3 text-[14px] font-semibold">Type</th>
              <th className="py-2 px-3 text-[14px] font-semibold">Message</th>
              <th className="py-2 px-3 text-[14px] font-semibold w-32">Date</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-[#2c3338]">
            {filteredSubmissions.length === 0 ? (
              <tr><td colSpan={5} className="py-6 px-4 text-[#50575e]">No submissions found.</td></tr>
            ) : (
              filteredSubmissions.map((sub, idx) => (
                <tr
                  key={sub._id}
                  className={`border-b border-[#f0f0f1] ${selectedIds.includes(String(sub._id)) ? "bg-[#f0f6fc]" : idx % 2 === 0 ? "bg-[#f9f9f9]" : "bg-white"} hover:bg-[#f0f0f1] transition-colors`}
                >
                  <td className="py-3 px-3 align-top w-8">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(String(sub._id))}
                      onChange={() => toggleSelectOne(sub._id)}
                      className="w-4 h-4 border-[#8c8f94] rounded-[3px] cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 align-top">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(sub)}
                      className="text-[#2271b1] block text-[14px] font-bold hover:underline text-left cursor-pointer"
                    >
                      {sub.name}
                    </button>
                    <span className="text-[#646970] block text-[12px]">{sub.email}</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedSubmission(sub)}
                        className="text-[#2271b1] hover:underline text-[12px] cursor-pointer font-medium"
                      >
                        View Details
                      </button>
                      <span className="text-[#a7aaad]">|</span>
                      <a
                        href={`mailto:${sub.email}`}
                        className="text-[#2271b1] hover:underline text-[12px]"
                      >
                        Email
                      </a>
                      <span className="text-[#a7aaad]">|</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSingle(sub._id, sub.name)}
                        disabled={isDeleting}
                        className="text-[#d63638] hover:underline text-[12px] font-semibold disabled:opacity-50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-top">
                    <span className={`font-semibold ${
                      sub.type === 'Job Application' ? 'text-purple-600' :
                      sub.type === 'Quote Request' ? 'text-blue-600' : 'text-[#50575e]'
                    }`}>
                      {sub.type.replace(' Request', '')}
                    </span>
                  </td>
                  <td className="py-3 px-3 align-top text-[#50575e] italic line-clamp-2">
                    {sub.message || "No message."}
                  </td>
                  <td className="py-3 px-3 align-top text-[#50575e]">
                    {new Date(sub.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* WP-Style Modal for Details */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSubmission(null)} className="absolute inset-0 bg-[#00000066]" />
             <motion.div
               initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
               className="relative w-full max-w-2xl bg-[#f1f1f1] border border-[#c3c4c7] shadow-lg rounded-[3px] overflow-hidden flex flex-col"
             >
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#c3c4c7]">
                   <h2 className="text-[#1d2327] text-lg font-normal font-serif">Submission Details</h2>
                   <button onClick={() => setSelectedSubmission(null)} className="text-[#787c82] hover:text-[#d63638]"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-6 bg-[#f0f0f1] overflow-y-auto max-h-[70vh]">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                         <label className="text-[11px] font-bold text-[#646970] uppercase">Name</label>
                         <p className="text-[14px] text-[#1d2327] font-medium">{selectedSubmission.name}</p>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[11px] font-bold text-[#646970] uppercase">Type</label>
                         <p className="text-[14px] text-[#1d2327] font-medium">{selectedSubmission.type}</p>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[11px] font-bold text-[#646970] uppercase">Email</label>
                         <p className="text-[14px] text-[#2271b1] hover:underline cursor-pointer">{selectedSubmission.email}</p>
                      </div>
                      <div className="space-y-1">
                         <label className="text-[11px] font-bold text-[#646970] uppercase">Phone</label>
                         <p className="text-[14px] text-[#1d2327] font-medium">{selectedSubmission.phone || "N/A"}</p>
                      </div>
                   </div>
 
                   {selectedSubmission.extraData && Object.keys(selectedSubmission.extraData).length > 0 && (() => {
                     // Filter out media fields that are rendered in the media gallery
                     const displayEntries = Object.entries(selectedSubmission.extraData).filter(
                       ([key]) => !['images', 'photos', 'attachmentUrls', 'attachments', 'attachment'].includes(key)
                     );
                     if (displayEntries.length === 0) return null;

                     const formatValue = (key: string, val: any) => {
                       if (val === null || val === undefined) return 'N/A';
                       if (typeof val === 'boolean') return val ? 'Yes' : 'No';
                       if (typeof val === 'object') {
                         if (Array.isArray(val)) {
                           return val.join(', ') || 'None';
                         }
                         if (key.toLowerCase().includes('area')) {
                           const active = Object.keys(val).filter(k => val[k]);
                           return active.length > 0 ? active.join(', ') : 'None specified';
                         }
                         return Object.entries(val)
                           .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
                           .join(' | ');
                       }
                       return String(val);
                     };

                     return (
                       <div className="space-y-3 pt-4 border-t border-[#c3c4c7]">
                         <label className="text-[11px] font-bold text-[#646970] uppercase">Additional Information</label>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {displayEntries.map(([key, value]) => (
                             <div key={key} className="bg-white border border-[#c3c4c7] p-2 rounded-[3px]">
                               <label className="block text-[10px] text-[#8c8f94] font-bold uppercase mb-0.5">{key.replace(/_/g, ' ')}</label>
                               <p className="text-[13px] text-[#2c3338] break-words">{formatValue(key, value)}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                     );
                   })()}

                   <div className="space-y-1 pt-4 border-t border-[#c3c4c7]">
                      <label className="text-[11px] font-bold text-[#646970] uppercase">Message</label>
                      <div className="bg-white border border-[#c3c4c7] p-4 text-[14px] text-[#2c3338] rounded-[3px] italic leading-relaxed shadow-inner">
                         "{selectedSubmission.message}"
                      </div>
                   </div>

                   {(() => {
                     // Collect all attached images and files
                     const attachments: string[] = [];
                     if (selectedSubmission.attachmentUrl) attachments.push(selectedSubmission.attachmentUrl);
                     if (Array.isArray(selectedSubmission.attachmentUrls)) {
                       selectedSubmission.attachmentUrls.forEach((u: any) => { if (typeof u === 'string') attachments.push(u); });
                     }
                     if (selectedSubmission.extraData) {
                       if (Array.isArray(selectedSubmission.extraData.images)) {
                         selectedSubmission.extraData.images.forEach((u: any) => { if (typeof u === 'string') attachments.push(u); });
                       }
                       if (Array.isArray(selectedSubmission.extraData.photos)) {
                         selectedSubmission.extraData.photos.forEach((u: any) => { if (typeof u === 'string') attachments.push(u); });
                       }
                       if (typeof selectedSubmission.extraData.attachment === 'string') attachments.push(selectedSubmission.extraData.attachment);
                     }
                     const uniqueAttachments = Array.from(new Set(attachments.filter(Boolean)));
                     if (uniqueAttachments.length === 0) return null;

                     return (
                       <div className="pt-4 border-t border-[#c3c4c7] space-y-3">
                          <label className="text-[11px] font-bold text-[#646970] uppercase block">
                            Attached Photos & Files ({uniqueAttachments.length})
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {uniqueAttachments.map((url, i) => {
                              const isImg = /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(url) || url.includes('/uploads') || url.includes('cloudinary');
                              return (
                                <div key={i} className="group border border-[#c3c4c7] rounded bg-white overflow-hidden shadow-sm flex flex-col">
                                  {isImg ? (
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="block relative aspect-video bg-gray-100 overflow-hidden">
                                      <img
                                        src={url}
                                        alt={`Attachment ${i + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                        onError={(e) => {
                                          (e.target as HTMLElement).style.display = 'none';
                                        }}
                                      />
                                    </a>
                                  ) : (
                                    <div className="p-6 flex flex-col items-center justify-center text-center bg-gray-50 flex-1">
                                      <FileDown className="w-8 h-8 text-[#2271b1] mb-2" />
                                      <span className="text-[12px] text-[#2c3338] font-medium truncate max-w-full">
                                        {url.split('/').pop() || 'Document'}
                                      </span>
                                    </div>
                                  )}
                                  <div className="p-2 bg-[#f6f7f7] border-t border-[#c3c4c7] flex items-center justify-between">
                                    <span className="text-[11px] text-[#646970]">Photo #{i + 1}</span>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[12px] text-[#2271b1] hover:underline font-semibold"
                                    >
                                      Open <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                       </div>
                     );
                   })()}
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-[#f6f7f7] border-t border-[#c3c4c7]">
                   <button
                     onClick={() => handleDeleteSingle(selectedSubmission._id, selectedSubmission.name)}
                     disabled={isDeleting}
                     className="bg-white border border-[#d63638] text-[#d63638] hover:bg-[#d63638] hover:text-white px-3 py-1.5 rounded-[3px] text-[13px] font-medium transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                   >
                     <Trash2 className="w-4 h-4" />
                     {isDeleting ? "Deleting..." : "Delete Submission"}
                   </button>
                   <button onClick={() => setSelectedSubmission(null)} className="bg-white border border-[#8c8f94] text-[#2c3338] px-4 py-1.5 rounded-[3px] text-[13px] hover:bg-[#f6f7f7]">Close</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
