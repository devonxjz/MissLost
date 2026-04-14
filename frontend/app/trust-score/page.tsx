"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";

interface TrainingLog {
  id: string;
  points_delta: number;
  reason: string;
  balance_after: number;
  created_at: string;
}

interface TrainingScoreData {
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    training_points: number;
    created_at: string;
  };
  logs: TrainingLog[];
  stats: {
    total_points: number;
    total_handovers: number;
  };
}

/* ── helper: thời gian trước ── */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} ngày trước`;
  const months = Math.floor(days / 30);
  return `${months} tháng trước`;
}

/* ── helper: xác định cấp bậc ── */
function getLevel(pts: number) {
  if (pts >= 100) return { name: "Kim Cương", emoji: "💎", idx: 0 };
  if (pts >= 50) return { name: "Vàng", emoji: "🏅", idx: 1 };
  if (pts >= 20) return { name: "Bạc", emoji: "🥈", idx: 2 };
  return { name: "Đồng", emoji: "🥉", idx: 3 };
}

/* ── helper: next level ── */
function getNextLevel(pts: number) {
  if (pts >= 100) return null;
  if (pts >= 50) return { name: "Kim Cương", target: 100 };
  if (pts >= 20) return { name: "Vàng", target: 50 };
  return { name: "Bạc", target: 20 };
}

const LEVELS = [
  { icon: "💎", name: "Kim Cương", range: "100+ điểm", bg: "#EDE9FE", color: "#7C3AED", min: 100 },
  { icon: "🏅", name: "Vàng", range: "50 – 99 điểm", bg: "#EEF0FD", color: "#4F5FE8", min: 50 },
  { icon: "🥈", name: "Bạc", range: "20 – 49 điểm", bg: "#F1F5F9", color: "#64748B", min: 20 },
  { icon: "🥉", name: "Đồng", range: "0 – 19 điểm", bg: "#FFF7ED", color: "#C2410C", min: 0 },
];

export default function TrustScorePage() {
  const [data, setData] = useState<TrainingScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<TrainingScoreData>("/users/me/training-score")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div className="ts-loader">
          <span className="material-symbols-outlined" style={{ fontSize: 40, color: "var(--color-brand, #4F5FE8)", animation: "spin 1s linear infinite" }}>progress_activity</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 12 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#EF4444" }}>error</span>
        <p style={{ color: "#EF4444", fontWeight: 600 }}>Không thể tải dữ liệu điểm rèn luyện</p>
        <p style={{ color: "#999", fontSize: 13 }}>{error}</p>
      </div>
    );
  }

  const { user, logs, stats } = data;
  const pts = stats.total_points;
  const level = getLevel(pts);
  const nextLevel = getNextLevel(pts);

  // Ring progress (max 100 for diamond)
  const maxPts = 100;
  const ringCircumference = 2 * Math.PI * 58; // r=58
  const ringProgress = Math.min(pts / maxPts, 1);
  const ringOffset = ringCircumference * (1 - ringProgress);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .ts-page { font-family: 'Inter', sans-serif; max-width: 880px; margin: 0 auto; padding: 24px 16px 48px; display: flex; flex-direction: column; gap: 20px; }

        .ts-hero {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b59d6 40%, #6366f1 100%);
          border-radius: 20px; padding: 32px; color: white; position: relative; overflow: hidden;
        }
        .ts-hero::before {
          content: ''; position: absolute; top: -80px; right: -40px;
          width: 220px; height: 220px; border-radius: 50%; background: rgba(255,255,255,0.06);
        }
        .ts-hero::after {
          content: ''; position: absolute; bottom: -50px; left: 20%;
          width: 160px; height: 160px; border-radius: 50%; background: rgba(255,255,255,0.04);
        }
        .ts-hero-inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; position: relative; z-index: 1; flex-wrap: wrap; }
        .ts-hero-left { flex: 1; min-width: 200px; }
        .ts-hero-label { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.6; margin-bottom: 6px; }
        .ts-hero-name { font-size: 28px; font-weight: 900; margin-bottom: 4px; line-height: 1.15; letter-spacing: -0.02em; }
        .ts-hero-sub { font-size: 13px; opacity: 0.7; line-height: 1.6; max-width: 300px; }
        .ts-tags { display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap; }
        .ts-tag { padding: 5px 14px; border-radius: 100px; font-size: 11px; font-weight: 700; backdrop-filter: blur(8px); }
        .ts-tag-level { background: rgba(251,191,36,0.2); border: 1px solid rgba(251,191,36,0.4); color: #FDE68A; }
        .ts-tag-count { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }

        .ts-ring { position: relative; width: 130px; height: 130px; flex-shrink: 0; }
        .ts-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
        .ts-ring-bg { fill: none; stroke: rgba(255,255,255,0.12); stroke-width: 10; }
        .ts-ring-fg { fill: none; stroke: rgba(255,255,255,0.92); stroke-width: 10; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
        .ts-ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ts-ring-pts { font-size: 32px; font-weight: 900; color: white; line-height: 1; letter-spacing: -0.03em; }
        .ts-ring-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.55; margin-top: 3px; color: white; }

        .ts-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .ts-stat {
          background: var(--color-bg-card, #fff); border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.08));
          border-radius: 14px; padding: 16px; text-align: center; transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .ts-stat:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
        .ts-stat-icon { font-size: 22px; margin-bottom: 4px; }
        .ts-stat-num { font-size: 24px; font-weight: 900; letter-spacing: -0.02em; }
        .ts-stat-lbl { font-size: 11px; color: var(--color-text-secondary, #888); font-weight: 600; margin-top: 2px; }

        .ts-grid { display: grid; grid-template-columns: 320px 1fr; gap: 16px; }
        .ts-card {
          background: var(--color-bg-card, #fff); border: 1px solid var(--color-border-subtle, rgba(0,0,0,0.08));
          border-radius: 16px; padding: 24px;
        }
        .ts-card-title { font-size: 14px; font-weight: 800; margin-bottom: 16px; color: var(--color-text-primary, #111); letter-spacing: -0.01em; }

        /* Progress bar */
        .ts-prog-container { margin-bottom: 20px; }
        .ts-prog-top { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px; }
        .ts-prog-top span { color: var(--color-text-secondary, #888); font-weight: 600; }
        .ts-prog-top strong { color: var(--color-text-primary, #111); font-weight: 800; }
        .ts-prog-bar { background: var(--color-bg-input, #F0F0F0); border-radius: 100px; height: 7px; overflow: hidden; }
        .ts-prog-fill { height: 100%; background: linear-gradient(90deg, #4F46E5, #7C3AED); border-radius: 100px; transition: width 0.8s ease; }
        .ts-prog-hint { font-size: 11px; color: var(--color-text-muted, #aaa); margin-top: 4px; font-weight: 500; }

        /* Levels list */
        .ts-lv { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; margin-bottom: 6px; transition: all 0.15s; }
        .ts-lv-active { background: #EEF0FD; border: 1px solid #C7D0F9; }
        .ts-lv-past { opacity: 0.4; }
        .ts-lv-locked { opacity: 0.45; }
        .ts-lv-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .ts-lv-name { font-size: 13px; font-weight: 800; color: var(--color-text-primary, #111); }
        .ts-lv-range { font-size: 10px; color: var(--color-text-muted, #aaa); font-weight: 600; margin-top: 1px; }
        .ts-lv-check { font-size: 18px; color: #4F46E5; margin-left: auto; }

        /* Activities */
        .ts-act { display: flex; gap: 14px; align-items: flex-start; padding: 16px 0; border-bottom: 1px solid var(--color-border-subtle, rgba(0,0,0,0.06)); }
        .ts-act:last-child { border-bottom: none; }
        .ts-act-dot { width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
        .ts-act-body { flex: 1; min-width: 0; }
        .ts-act-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
        .ts-act-reason { font-size: 13px; font-weight: 700; color: var(--color-text-primary, #111); line-height: 1.4; }
        .ts-act-pts { font-size: 13px; font-weight: 800; white-space: nowrap; }
        .ts-act-pts.positive { color: #059669; }
        .ts-act-pts.negative { color: #EF4444; }
        .ts-act-meta { font-size: 11px; color: var(--color-text-muted, #aaa); margin-top: 4px; display: flex; align-items: center; gap: 8px; font-weight: 500; }
        .ts-act-chip { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 100px; font-size: 10px; font-weight: 700; }
        .ts-act-chip-green { background: #ECFDF5; color: #059669; }

        .ts-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; text-align: center; }
        .ts-empty-icon { font-size: 48px; color: var(--color-text-muted, #ccc); margin-bottom: 12px; }
        .ts-empty-text { font-size: 14px; color: var(--color-text-secondary, #888); font-weight: 600; }
        .ts-empty-sub { font-size: 12px; color: var(--color-text-muted, #aaa); margin-top: 4px; }

        @media (max-width: 768px) {
          .ts-grid { grid-template-columns: 1fr; }
          .ts-hero-inner { flex-direction: column; text-align: center; align-items: center; }
          .ts-tags { justify-content: center; }
          .ts-hero-sub { max-width: none; }
          .ts-hero-name { font-size: 24px; }
          .ts-ring { width: 110px; height: 110px; }
          .ts-ring-pts { font-size: 26px; }
        }
      `}</style>

      <div className="ts-page">
        {/* ═══ Hero ═══ */}
        <div className="ts-hero">
          <div className="ts-hero-inner">
            <div className="ts-hero-left">
              <p className="ts-hero-label">Điểm rèn luyện</p>
              <h1 className="ts-hero-name">{user.full_name}</h1>
              <p className="ts-hero-sub">
                Điểm rèn luyện dựa trên các hoạt động tìm &amp; trả đồ thất lạc trong cộng đồng UEH.
              </p>
              <div className="ts-tags">
                <span className="ts-tag ts-tag-level">{level.emoji} Cấp {level.name}</span>
                <span className="ts-tag ts-tag-count">
                  {stats.total_handovers} lần trao trả
                </span>
              </div>
            </div>
            <div className="ts-ring">
              <svg viewBox="0 0 140 140">
                <circle className="ts-ring-bg" cx="70" cy="70" r="58" />
                <circle
                  className="ts-ring-fg"
                  cx="70" cy="70" r="58"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                />
              </svg>
              <div className="ts-ring-center">
                <span className="ts-ring-pts">{pts}</span>
                <span className="ts-ring-lbl">Tổng điểm</span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Quick Stats ═══ */}
        <div className="ts-stats">
          <div className="ts-stat">
            <div className="ts-stat-icon">🤝</div>
            <div className="ts-stat-num" style={{ color: "#4F46E5" }}>{stats.total_handovers}</div>
            <div className="ts-stat-lbl">Lần trao trả</div>
          </div>
          <div className="ts-stat">
            <div className="ts-stat-icon">⭐</div>
            <div className="ts-stat-num" style={{ color: "#059669" }}>{pts}</div>
            <div className="ts-stat-lbl">Tổng điểm</div>
          </div>
          <div className="ts-stat">
            <div className="ts-stat-icon">📝</div>
            <div className="ts-stat-num" style={{ color: "#F59E0B" }}>{logs.length}</div>
            <div className="ts-stat-lbl">Lịch sử hoạt động</div>
          </div>
        </div>

        {/* ═══ Main Grid ═══ */}
        <div className="ts-grid">
          {/* Left: Levels */}
          <div className="ts-card">
            <p className="ts-card-title">Cấp bậc rèn luyện</p>

            {nextLevel && (
              <div className="ts-prog-container">
                <div className="ts-prog-top">
                  <span>Tiến độ lên {nextLevel.name}</span>
                  <strong>{pts}/{nextLevel.target}</strong>
                </div>
                <div className="ts-prog-bar">
                  <div className="ts-prog-fill" style={{ width: `${Math.min((pts / nextLevel.target) * 100, 100)}%` }} />
                </div>
                <p className="ts-prog-hint">Còn {Math.max(nextLevel.target - pts, 0)} điểm nữa</p>
              </div>
            )}
            {!nextLevel && (
              <div className="ts-prog-container">
                <div className="ts-prog-top">
                  <span>Bạn đã đạt cấp cao nhất! 🎉</span>
                  <strong>{pts} điểm</strong>
                </div>
                <div className="ts-prog-bar">
                  <div className="ts-prog-fill" style={{ width: "100%" }} />
                </div>
              </div>
            )}

            {LEVELS.map((lv) => {
              const isActive = level.idx === LEVELS.indexOf(lv);
              const isPast = pts >= lv.min && !isActive && LEVELS.indexOf(lv) > level.idx;
              const isLocked = LEVELS.indexOf(lv) < level.idx;

              return (
                <div
                  key={lv.name}
                  className={`ts-lv ${isActive ? "ts-lv-active" : ""} ${isPast ? "ts-lv-past" : ""} ${isLocked ? "ts-lv-locked" : ""}`}
                >
                  <div className="ts-lv-icon" style={{ background: lv.bg, color: lv.color }}>
                    {lv.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="ts-lv-name" style={isActive ? { color: "#4F46E5" } : undefined}>
                      {lv.name} {isActive && "✦ Hiện tại"}
                    </div>
                    <div className="ts-lv-range" style={isActive ? { color: "#818CF8" } : undefined}>{lv.range}</div>
                  </div>
                  {isActive && (
                    <span className="material-symbols-outlined ts-lv-check" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                  {isLocked && (
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#bbb", fontVariationSettings: "'FILL' 0" }}>lock</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Activity History */}
          <div className="ts-card" style={{ display: "flex", flexDirection: "column" }}>
            <p className="ts-card-title">Lịch sử hoạt động</p>

            {logs.length === 0 ? (
              <div className="ts-empty">
                <span className="material-symbols-outlined ts-empty-icon">history</span>
                <p className="ts-empty-text">Chưa có hoạt động nào</p>
                <p className="ts-empty-sub">Hãy trao trả đồ thất lạc để nhận điểm rèn luyện nhé!</p>
              </div>
            ) : (
              <div>
                {logs.map((log) => {
                  const isPositive = log.points_delta > 0;
                  const icon = isPositive ? "volunteer_activism" : "remove_circle";
                  const iconBg = isPositive ? "#D1FAE5" : "#FEE2E2";
                  const iconColor = isPositive ? "#059669" : "#EF4444";

                  return (
                    <div key={log.id} className="ts-act">
                      <div className="ts-act-dot" style={{ background: iconBg, color: iconColor }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                      </div>
                      <div className="ts-act-body">
                        <div className="ts-act-row">
                          <span className="ts-act-reason">{log.reason}</span>
                          <span className={`ts-act-pts ${isPositive ? "positive" : "negative"}`}>
                            {isPositive ? "+" : ""}{log.points_delta} điểm
                          </span>
                        </div>
                        <div className="ts-act-meta">
                          <span className="ts-act-chip ts-act-chip-green">
                            <span className="material-symbols-outlined" style={{ fontSize: 11 }}>verified</span>
                            Hệ thống xác nhận
                          </span>
                          <span>{timeAgo(log.created_at)}</span>
                          <span>•</span>
                          <span>Số dư: {log.balance_after} điểm</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}