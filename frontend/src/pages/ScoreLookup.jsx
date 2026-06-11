import { useState } from 'react';
import { useScoreLookup } from '../hooks/useScoreLookup.js';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import styles from '../styles/scorelookup.module.css';

const BAND_COLORS = {
  excellent: '#22c55e',
  good: '#3b82f6',
  average: '#f59e0b',
  poor: '#ef4444',
};

const BAND_TEXT = {
  excellent: 'Giỏi',
  good: 'Khá',
  average: 'Trung bình',
  poor: 'Cần cố gắng',
};

function getBand(score) {
    if (score === null) return null;
    if (score >= 8) return 'excellent';
    if (score >= 6) return 'good';
    if (score >= 4) return 'average';
    return 'poor';
}

function Gauge({ value }) {
    const pct = Math.max(0, Math.min(value / 10, 1));
    const r = 52;
    const c = 2 * Math.PI * r;
    const band = getBand(value);
    const color = band ? BAND_COLORS[band] : '#94a3b8';

    return (
        <div className={styles.gauge}>
            <svg width="132" height="132" viewBox="0 0 132 132">
                <circle cx="66" cy="66" r={r} fill="none" stroke="#eef2f7" strokeWidth="11" />
                <circle
                    cx="66" cy="66" r={r} fill="none"
                    stroke={color} strokeWidth="11" strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - pct)}
                    transform="rotate(-90 66 66)"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }}
                />
            </svg>
            <div className={styles.gaugeText}>
                <span className={styles.gaugeValue} style={{ color }}>{value.toFixed(2)}</span>
                <span className={styles.gaugeLabel}>Điểm TB</span>
            </div>
        </div>
    );
}

export default function ScoreLookup() {
    const [input, setInput]   = useState('');
    const [touched, setTouched] = useState(false);
    const { data, loading, error, lookup } = useScoreLookup();

    const validationError =
        touched && (input.length === 0 ? 'Vui lòng nhập số báo danh' : !/^\d{8}$/.test(input)
        ? 'Số báo danh phải gồm đúng 8 chữ số' : null);

    function handleSubmit(e) {
        e.preventDefault();
        setTouched(true);

        if (!/^\d{8}$/.test(input)) return;
        lookup(input.trim());
    }

    const validScores = data ? data.scores.filter(s => s.score !== null) : [];
    const average = validScores.length
        ? validScores.reduce((sum, s) => sum + s.score, 0) / validScores.length
        : 0;
    const radarData = validScores.map(s => ({ subject: s.label, score: s.score }));

    return (
        <main className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>Tra cứu điểm thi THPT 2024</h1>
                <p className={styles.subtitle}>Nhập số báo danh để xem kết quả thi</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            className={`${styles.input} ${validationError ? styles.inputError : ''}`}
                            type="text"
                            placeholder="Nhập số báo danh (8 chữ số)"
                            maxLength={8}
                            value={input}
                            onChange={e => { setInput(e.target.value); setTouched(true); }}
                        />
                        <button className={styles.btn} type="submit" disabled={loading}>
                            {loading ? 'Đang tìm...' : 'Tra cứu'}
                        </button>
                    </div>
                    {validationError && <p className={styles.errorMsg}>{validationError}</p>}
                </form>

                {error && (
                    <div className={styles.alert}>
                        {error === 'Không tìm thấy thí sinh với số báo danh này'
                        ? `Không tìm thấy thí sinh với SBD "${input}"`
                        : error}
                    </div>
                )}

                {data && (
                    <div className={styles.result}>
                        {/* Hero summary */}
                        <div className={styles.summary}>
                            <div className={styles.summaryInfo}>
                                <span className={styles.sbdLabel}>Số báo danh</span>
                                <span className={styles.sbdValue}>{data.sbd}</span>
                                <div className={styles.tags}>
                                    {data.ma_ngoai_ngu && (
                                        <span className={styles.badge}>Ngoại ngữ: {data.ma_ngoai_ngu}</span>
                                    )}
                                    <span className={styles.badgeAlt}>{validScores.length} môn thi</span>
                                </div>
                            </div>
                            <Gauge value={average} />
                        </div>

                        {/* Radar overview */}
                        {radarData.length >= 3 && (
                            <div className={styles.radarWrap}>
                                <span className={styles.blockTitle}>Phổ điểm các môn</span>
                                <ResponsiveContainer width="100%" height={280}>
                                    <RadarChart data={radarData} outerRadius="72%">
                                        <defs>
                                            <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.15} />
                                            </linearGradient>
                                        </defs>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
                                        <PolarRadiusAxis domain={[0, 10]} angle={90} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                        <Radar dataKey="score" stroke="#4f46e5" strokeWidth={2} fill="url(#radarFill)" />
                                        <Tooltip formatter={(v) => [Number(v).toFixed(2), 'Điểm']} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Score tiles */}
                        <div className={styles.scoreGrid}>
                            {data.scores.map(({ key, label, score }) => {
                                const band = getBand(score);
                                const color = band ? BAND_COLORS[band] : 'var(--text-muted)';
                                return (
                                <div key={key} className={styles.scoreItem} style={{ '--band': color }}>
                                    <div className={styles.scoreItemTop}>
                                        <span className={styles.subjectLabel}>{label}</span>
                                        <span className={styles.scoreValue} style={{ color }}>
                                            {score !== null ? score.toFixed(2) : '—'}
                                        </span>
                                    </div>
                                    <div className={styles.bar}>
                                        <div
                                            className={styles.barFill}
                                            style={{ width: `${(score ?? 0) * 10}%`, background: color }}
                                        />
                                    </div>
                                    {band && (
                                        <span className={styles.bandTag} style={{ color }}>
                                            {BAND_TEXT[band]}
                                        </span>
                                    )}
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
