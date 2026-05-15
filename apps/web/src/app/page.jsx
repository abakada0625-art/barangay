import React, { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  User,
  LogOut,
  Droplets,
  Lightbulb,
  Hammer,
  X,
  Camera,
  Trash2,
  Users,
  ShieldCheck,
  ChevronDown,
  Image as ImageIcon,
  FileCheck,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import useUser from "@/utils/useUser";
import useUpload from "@/utils/useUpload";

// ── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "lighting", label: "Lighting", icon: "💡" },
  { value: "road", label: "Road / Pavement", icon: "🛣️" },
  { value: "water", label: "Water / Drainage", icon: "💧" },
  { value: "garbage", label: "Garbage / Waste", icon: "🗑️" },
  { value: "other", label: "Other", icon: "⚠️" },
];

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    bg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  resolved: {
    label: "Resolved",
    dot: "bg-green-500",
    bg: "bg-green-50 text-green-700 border-green-200",
  },
};

function StatusBadge({ status }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${c.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function RoleBadge({ role }) {
  const map = {
    resident: {
      label: "Resident",
      cls: "bg-blue-50 text-blue-600 border-blue-200",
    },
    official: {
      label: "Barangay Official",
      cls: "bg-purple-50 text-purple-600 border-purple-200",
    },
    admin: {
      label: "Super Admin",
      cls: "bg-red-50 text-red-600 border-red-200",
    },
  };
  const m = map[role] || map.resident;
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${m.cls}`}
    >
      {m.label}
    </span>
  );
}

function PhotoUploadBox({ label, file, preview, onPick, onClear, required }) {
  const inputRef = useRef(null);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 h-40">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-gray-600 hover:text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
        >
          <Camera size={24} />
          <span className="text-sm">Tap to upload photo</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files[0])}
      />
    </div>
  );
}

// ── Report Card ───────────────────────────────────────────────────────────────

function ReportCard({ report, role, onMarkFixed, currentProfile }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {report.image_url && (
        <div className="h-44 overflow-hidden">
          <img
            src={report.image_url}
            alt="issue"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <StatusBadge status={report.status} />
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium capitalize">
            {CATEGORIES.find((c) => c.value === report.category)?.icon}{" "}
            {report.category}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-1">
          {report.title}
        </h3>
        {report.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {report.description}
          </p>
        )}

        <div className="space-y-1 text-xs text-gray-500 mb-4">
          {(report.address || report.location) && (
            <div className="flex items-start gap-1.5">
              <MapPin size={12} className="mt-0.5 shrink-0 text-gray-400" />
              <span>{report.address || report.location}</span>
            </div>
          )}
          {report.reporter_name && (
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-gray-400" />
              <span>Reported by {report.reporter_name}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-gray-400" />
            <span>
              {format(new Date(report.created_at), "MMM d, yyyy · h:mm a")}
            </span>
          </div>
        </div>

        {report.status === "resolved" && report.proof_image_url && (
          <div className="mt-3 rounded-xl overflow-hidden border border-green-100">
            <div className="bg-green-50 px-3 py-1.5 flex items-center gap-1.5 text-xs text-green-700 font-semibold">
              <FileCheck size={12} /> Proof of Fix
              {report.official_name && (
                <span className="ml-auto font-normal text-green-600">
                  by {report.official_name}
                </span>
              )}
            </div>
            <img
              src={report.proof_image_url}
              alt="proof"
              className="w-full h-36 object-cover"
            />
          </div>
        )}

        {role === "official" && report.status === "pending" && (
          <button
            onClick={() => onMarkFixed(report)}
            className="mt-3 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} /> Mark as Fixed
          </button>
        )}
      </div>
    </div>
  );
}

// ── Resident View ─────────────────────────────────────────────────────────────

function ResidentView({ profile }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [upload, { loading: uploading }] = useUpload();
  const [form, setForm] = useState({
    title: "",
    category: "lighting",
    address: "",
    location: "",
    description: "",
  });
  const [error, setError] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["my-reports"],
    queryFn: async () => {
      const res = await fetch("/api/reports?mine=true");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
  const reports = data?.reports || [];

  const createMutation = useMutation({
    mutationFn: async (body) => {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create report");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-reports"]);
      setShowForm(false);
      setForm({
        title: "",
        category: "lighting",
        address: "",
        location: "",
        description: "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      toast.success("Issue reported! The barangay has been notified.");
    },
    onError: () => toast.error("Failed to submit report."),
  });

  const handlePickPhoto = useCallback((file) => {
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setError(null);
      if (!photoFile) {
        setError("Please attach a photo of the issue.");
        return;
      }

      let image_url = null;
      if (photoFile) {
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
          reader.onload = (ev) => resolve(ev.target.result);
          reader.readAsDataURL(photoFile);
        });
        const result = await upload({ url: dataUrl });
        if (result.error) {
          setError("Photo upload failed. Try again.");
          return;
        }
        image_url = result.url;
      }

      createMutation.mutate({
        ...form,
        image_url,
        reporter_name: profile.name || profile.email,
      });
    },
    [form, photoFile, upload, profile, createMutation],
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Reports</h2>
          <p className="text-sm text-gray-500">
            {reports.length} issue{reports.length !== 1 ? "s" : ""} submitted
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} /> Report Issue
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold text-gray-700">No reports yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Tap "Report Issue" to flag a problem in your area.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} role="resident" />
          ))}
        </div>
      )}

      {/* Report Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
              <h2 className="text-lg font-bold text-gray-900">
                Report an Issue
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <PhotoUploadBox
                label="Photo of the Problem"
                required
                file={photoFile}
                preview={photoPreview}
                onPick={handlePickPhoto}
                onClear={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Broken Streetlight near Plaza"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complete Address <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  placeholder="e.g. 123 Rizal St., Brgy. San Jose"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark / Location <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder="e.g. Near the public market"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe the issue in detail..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={createMutation.isLoading || uploading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
              >
                {createMutation.isLoading || uploading
                  ? "Submitting..."
                  : "Submit Report"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Official View ─────────────────────────────────────────────────────────────

function OfficialView({ profile }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("pending");
  const [fixing, setFixing] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [upload, { loading: uploading }] = useUpload();
  const [fixError, setFixError] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["reports-official", tab],
    queryFn: async () => {
      const res = await fetch(`/api/reports?status=${tab}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });
  const reports = data?.reports || [];

  const fixMutation = useMutation({
    mutationFn: async ({ id, proof_image_url }) => {
      const res = await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "resolved",
          proof_image_url,
          official_name: profile.name || profile.email,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["reports-official"]);
      setFixing(null);
      setProofFile(null);
      setProofPreview(null);
      toast.success("Report marked as fixed!");
    },
    onError: () => toast.error("Failed to update report."),
  });

  const handlePickProof = useCallback((file) => {
    if (!file) return;
    setProofFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setProofPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleFix = useCallback(async () => {
    setFixError(null);
    if (!proofFile) {
      setFixError("Please upload a proof photo.");
      return;
    }
    const reader = new FileReader();
    const dataUrl = await new Promise((resolve) => {
      reader.onload = (ev) => resolve(ev.target.result);
      reader.readAsDataURL(proofFile);
    });
    const result = await upload({ url: dataUrl });
    if (result.error) {
      setFixError("Photo upload failed. Try again.");
      return;
    }
    fixMutation.mutate({ id: fixing.id, proof_image_url: result.url });
  }, [proofFile, upload, fixing, fixMutation]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Issue Reports</h2>
        <p className="text-sm text-gray-500">
          Review and resolve community-reported issues
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {["pending", "resolved"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
          <CheckCircle2 size={40} className="mx-auto text-green-400 mb-3" />
          <p className="font-semibold text-gray-700">
            {tab === "pending"
              ? "No pending issues!"
              : "No resolved issues yet"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {tab === "pending"
              ? "The community is all good."
              : "Resolved reports will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              role="official"
              onMarkFixed={setFixing}
            />
          ))}
        </div>
      )}

      {/* Mark as Fixed Modal */}
      {fixing && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-100 z-10">
              <h2 className="text-lg font-bold text-gray-900">Mark as Fixed</h2>
              <button
                onClick={() => {
                  setFixing(null);
                  setProofFile(null);
                  setProofPreview(null);
                }}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide mb-1">
                  Issue Being Fixed
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {fixing.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {fixing.address || fixing.location}
                </p>
              </div>
              <PhotoUploadBox
                label="Proof Photo (After Fix)"
                required
                file={proofFile}
                preview={proofPreview}
                onPick={handlePickProof}
                onClear={() => {
                  setProofFile(null);
                  setProofPreview(null);
                }}
              />
              {fixError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                  {fixError}
                </div>
              )}
              <button
                onClick={handleFix}
                disabled={fixMutation.isLoading || uploading}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                {fixMutation.isLoading || uploading
                  ? "Uploading..."
                  : "Confirm Fix"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Admin View ────────────────────────────────────────────────────────────────

function AdminView({ profile }) {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("reports");

  const { data: reportsData, isLoading: loadingReports } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: tab === "reports",
  });

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: tab === "users",
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }) => {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-users"]);
      toast.success("User role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const reports = reportsData?.reports || [];
  const users = usersData?.users || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Admin Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Oversee all reports and manage user roles
        </p>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {["reports", "users"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {t === "reports" ? "All Reports" : "Users"}
          </button>
        ))}
      </div>

      {tab === "reports" &&
        (loadingReports ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((r) => (
              <ReportCard key={r.id} report={r} role="admin" />
            ))}
          </div>
        ))}

      {tab === "users" &&
        (loadingUsers ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Email
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {u.name || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={u.role || "resident"} />
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={u.role || "resident"}
                        onChange={(e) =>
                          updateRoleMutation.mutate({
                            userId: u.id,
                            role: e.target.value,
                          })
                        }
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="resident">Resident</option>
                        <option value="official">Official</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AyosPHPage() {
  const { data: authUser, loading: authLoading } = useUser();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!authUser,
    retry: false,
  });

  const profile = profileData?.user;

  useEffect(() => {
    if (!authLoading && !authUser) {
      window.location.href = "/account/signin";
    }
  }, [authLoading, authUser]);

  if (authLoading || profileLoading || !authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-2xl font-black text-blue-600">A</span>
          </div>
          <h1 className="text-2xl font-black">AyosPH</h1>
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mt-4" />
        </div>
      </div>
    );
  }

  const role = profile?.role || "resident";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-lg font-black text-white">A</span>
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              AyosPH
            </span>
          </div>
          <div className="flex items-center gap-3">
            <RoleBadge role={role} />
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900 leading-none">
                {profile?.name || authUser.email}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{authUser.email}</p>
            </div>
            <a
              href="/account/logout"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {role === "resident" && (
          <ResidentView
            profile={profile || { name: authUser.name, email: authUser.email }}
          />
        )}
        {role === "official" && (
          <OfficialView
            profile={profile || { name: authUser.name, email: authUser.email }}
          />
        )}
        {role === "admin" && (
          <AdminView
            profile={profile || { name: authUser.name, email: authUser.email }}
          />
        )}
      </main>
    </div>
  );
}
