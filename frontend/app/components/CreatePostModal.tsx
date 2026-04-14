"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiFetch, uploadFile } from "@/app/lib/api";
import { useGeolocation } from "@/app/hooks/useGeolocation";

/* ─────────── types ─────────── */
interface Category {
  id: string;
  name: string;
  icon_name: string;
}

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type PostType = "lost" | "found";

/* ─────────── component ─────────── */
export default function CreatePostModal({ open, onClose, onSuccess }: CreatePostModalProps) {
  /* ── state ── */
  const [postType, setPostType] = useState<PostType>("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [rewardNote, setRewardNote] = useState("");
  const [isInStorage, setIsInStorage] = useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { loading: geoLoading, error: geoError, getAddress } = useGeolocation();

  /* ── fetch categories ── */
  useEffect(() => {
    if (!open) return;
    apiFetch<{ data: Category[] }>("/categories")
      .then((res) => {
        // Backend may return array directly or wrapped
        const list = Array.isArray(res) ? res : res.data ?? [];
        setCategories(list as Category[]);
      })
      .catch(() => {});
  }, [open]);

  /* ── generate previews ── */
  useEffect(() => {
    const urls = images.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  /* ── reset form on close ── */
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setCategoryId("");
      setIncidentDate("");
      setLocation("");
      setContactInfo("");
      setIsUrgent(false);
      setRewardNote("");
      setIsInStorage(false);
      setImages([]);
      setSubmitting(false);
      setUploadProgress(0);
      setToast(null);
    }
  }, [open]);

  /* ── close on ESC ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !submitting) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, submitting, onClose]);

  /* ── close on backdrop click ── */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === modalRef.current && !submitting) onClose();
    },
    [submitting, onClose],
  );

  /* ── image handling ── */
  const MAX_IMAGES = 5;

  const addFiles = (files: FileList | File[]) => {
    const valid = Array.from(files)
      .filter((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type))
      .slice(0, MAX_IMAGES - images.length);
    if (valid.length === 0) return;
    setImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addFiles(e.dataTransfer.files);
  };

  /* ── geolocation ── */
  const handleGetLocation = async () => {
    try {
      const addr = await getAddress();
      setLocation(addr);
    } catch {
      /* error is in geoError state */
    }
  };

  /* ── submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (title.length < 10) {
      showToast("Tiêu đề cần ít nhất 10 ký tự", "error");
      return;
    }
    if (description.length < 20) {
      showToast("Mô tả cần ít nhất 20 ký tự", "error");
      return;
    }
    if (!location.trim()) {
      showToast("Vui lòng nhập vị trí", "error");
      return;
    }
    if (!incidentDate) {
      showToast("Vui lòng chọn thời gian", "error");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      /* Bước 1: Upload ảnh song song */
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const total = images.length;
        let done = 0;

        const results = await Promise.allSettled(
          images.map(async (file) => {
            const result = await uploadFile("/upload/post-image", file);
            done++;
            setUploadProgress(Math.round((done / total) * 100));
            return result;
          }),
        );

        imageUrls = results
          .filter(
            (r): r is PromiseFulfilledResult<{ url: string }> =>
              r.status === "fulfilled",
          )
          .map((r) => r.value.url);

          const failCount = results.filter((r) => r.status === "rejected").length;
        if (failCount > 0 && imageUrls.length === 0) {
          // Bỏ qua nếu lỗi là do token hết hạn (sắp bị redirect)
          const isUnauthorized = results.some(
            (r) => r.status === "rejected" && r.reason?.message === "Unauthorized"
          );
          if (!isUnauthorized) {
            showToast("Upload ảnh thất bại. Vui lòng thử lại.", "error");
            setSubmitting(false);
          }
          return;
        }
      }

      /* Bước 2: Tạo bài đăng */
      const endpoint = postType === "lost" ? "/lost-posts" : "/found-posts";

      const body: Record<string, unknown> = {
        title,
        description,
        image_urls: imageUrls,
        contact_info: contactInfo || undefined,
      };

      if (categoryId) body.category_id = categoryId;

      if (postType === "lost") {
        body.location_lost = location;
        body.time_lost = new Date(incidentDate).toISOString();
        body.is_urgent = isUrgent;
        if (rewardNote) body.reward_note = rewardNote;
      } else {
        body.location_found = location;
        body.time_found = new Date(incidentDate).toISOString();
        body.is_in_storage = isInStorage;
      }

      await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      showToast("🎉 Đăng bài thành công!", "success");

      // Delay close to let user see the toast
      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Đăng bài thất bại";
      if (msg !== "Unauthorized") {
        showToast(msg, "error");
        setSubmitting(false);
      }
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── render ── */
  if (!open) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="relative w-full sm:max-w-2xl max-h-[92vh] bg-[var(--color-bg-card-solid)] rounded-t-3xl sm:rounded-3xl shadow-2xl shadow-indigo-900/20 overflow-hidden flex flex-col animate-slideUp"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-subtle)]">
          <h2 className="text-lg font-extrabold text-[var(--color-text-primary)]">Đăng tin mới</h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-bg-input)] transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[var(--color-text-secondary)]">close</span>
          </button>
        </div>

        {/* ── Body (scrollable) ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Toggle Lost / Found */}
          <div className="flex gap-2 p-1 bg-[var(--color-bg-input)] rounded-2xl">
            <button
              type="button"
              onClick={() => setPostType("lost")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                postType === "lost"
                  ? "bg-[#b41340] text-white shadow-lg shadow-[#b41340]/20"
                  : "text-[var(--color-text-secondary)] hover:text-slate-700"
              }`}
            >
              <span className="material-symbols-outlined text-base align-middle mr-1">search_off</span>
              Mất đồ
            </button>
            <button
              type="button"
              onClick={() => setPostType("found")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                postType === "found"
                  ? "bg-[#4050bc] text-white shadow-lg shadow-[#4050bc]/20"
                  : "text-[var(--color-text-secondary)] hover:text-slate-700"
              }`}
            >
              <span className="material-symbols-outlined text-base align-middle mr-1">location_on</span>
              Nhặt được
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
              Tiêu đề <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={postType === "lost" ? "Ví dụ: Mất ba lô đen tại thư viện" : "Ví dụ: Nhặt được ví nam tại sân B"}
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-transparent focus:border-[#5B6CFF] focus:ring-2 focus:ring-[#5B6CFF]/10 outline-none transition-all text-sm"
              maxLength={255}
              required
            />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{title.length}/255 — tối thiểu 10 ký tự</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
              Mô tả chi tiết <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả đặc điểm nhận dạng, thời gian, hoàn cảnh..."
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-transparent focus:border-[#5B6CFF] focus:ring-2 focus:ring-[#5B6CFF]/10 outline-none transition-all text-sm resize-none h-28"
              required
            />
            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{description.length} ký tự — tối thiểu 20</p>
          </div>

          {/* Category + Date — 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                Loại đồ vật
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-transparent focus:border-[#5B6CFF] focus:ring-2 focus:ring-[#5B6CFF]/10 outline-none transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="">— Chọn loại —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                Thời gian <span className="text-red-400">*</span>
              </label>
              <input
                type="datetime-local"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-transparent focus:border-[#5B6CFF] focus:ring-2 focus:ring-[#5B6CFF]/10 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
              Vị trí {postType === "lost" ? "mất đồ" : "nhặt được"} <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Thư viện tòa B, Cơ sở A UEH"
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-transparent focus:border-[#5B6CFF] focus:ring-2 focus:ring-[#5B6CFF]/10 outline-none transition-all text-sm"
                required
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={geoLoading}
                className="flex items-center gap-1 px-4 py-3 rounded-xl bg-[#5B6CFF]/10 text-[#5B6CFF] font-bold text-sm hover:bg-[#5B6CFF]/20 transition-all disabled:opacity-50 shrink-0"
                title="Lấy vị trí hiện tại"
              >
                <span className={`material-symbols-outlined text-base ${geoLoading ? "animate-spin" : ""}`}>
                  {geoLoading ? "progress_activity" : "my_location"}
                </span>
                <span className="hidden sm:inline">{geoLoading ? "Đang lấy..." : "GPS"}</span>
              </button>
            </div>
            {geoError && <p className="text-[10px] text-red-400 mt-1">{geoError}</p>}
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
              Thông tin liên hệ
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="SĐT, Zalo, Facebook... (không bắt buộc)"
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-transparent focus:border-[#5B6CFF] focus:ring-2 focus:ring-[#5B6CFF]/10 outline-none transition-all text-sm"
            />
          </div>

          {/* ── Conditional fields ── */}
          {postType === "lost" && (
            <div className="space-y-4">
              {/* Urgent toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-[var(--color-bg-input-hover)] rounded-full peer-checked:bg-[#b41340] transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-[var(--color-bg-card-solid)] rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
                </div>
                <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">🚨 Khẩn cấp</span>
              </label>

              {/* Reward note */}
              <div>
                <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
                  Ghi chú thưởng
                </label>
                <input
                  type="text"
                  value={rewardNote}
                  onChange={(e) => setRewardNote(e.target.value)}
                  placeholder="Ví dụ: Cảm ơn 200k, mời cafe..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-input)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] border border-transparent focus:border-[#5B6CFF] focus:ring-2 focus:ring-[#5B6CFF]/10 outline-none transition-all text-sm"
                  maxLength={255}
                />
              </div>
            </div>
          )}

          {postType === "found" && (
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isInStorage}
                  onChange={(e) => setIsInStorage(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-[var(--color-bg-input-hover)] rounded-full peer-checked:bg-[#4050bc] transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-[var(--color-bg-card-solid)] rounded-full shadow-sm peer-checked:translate-x-4 transition-transform" />
              </div>
              <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800">
                📦 Đã nộp vào kho lưu giữ
              </span>
            </label>
          )}

          {/* ── Image Upload Zone ── */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text-secondary)] mb-1.5 uppercase tracking-wider">
              Ảnh đồ vật ({images.length}/{MAX_IMAGES})
            </label>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-slate-200 hover:border-[#5B6CFF]/40 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-[#5B6CFF]/[0.02] group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => e.target.files && addFiles(e.target.files)}
                className="hidden"
              />
              <span className="material-symbols-outlined text-4xl text-[var(--color-text-muted)] group-hover:text-[#5B6CFF]/60 transition-colors">
                cloud_upload
              </span>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Kéo thả hoặc <span className="text-[#5B6CFF] font-semibold">chọn ảnh</span>
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1">JPG, PNG, WebP — tối đa 5MB/ảnh</p>
            </div>

            {/* Previews */}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {previews.map((url, i) => (
                  <div key={i} className="relative shrink-0 group/img">
                    <img
                      src={url}
                      alt={`Preview ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-xl border border-[var(--color-border-subtle)]"
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* ── Footer ── */}
        <div className="p-5 border-t border-[var(--color-border-subtle)] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-input)] transition-all disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`relative px-8 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all disabled:opacity-70 ${
              postType === "lost"
                ? "bg-gradient-to-r from-[#b41340] to-[#e05578] shadow-[#b41340]/20 hover:scale-[1.02]"
                : "bg-gradient-to-r from-[#3647dc] to-[#8c98ff] shadow-[#3647dc]/20 hover:scale-[1.02]"
            } active:scale-95`}
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                {uploadProgress > 0 && uploadProgress < 100
                  ? `Đang upload ${uploadProgress}%`
                  : "Đang đăng..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">send</span>
                Đăng tin
              </span>
            )}
          </button>
        </div>

        {/* ── Toast notification ── */}
        {toast && (
          <div
            className={`absolute bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl animate-slideUp z-10 ${
              toast.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>

      {/* ── CSS animations ── */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
}
