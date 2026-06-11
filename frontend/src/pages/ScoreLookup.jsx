import { useState } from 'react';
import { useScoreLookup } from '../hooks/useScoreLookup.js';
import styles from '../styles/scorelookup.module.css';

const BAND_COLORS = {
  excellent: '#22c55e',
  good: '#3b82f6',
  average: '#f59e0b',
  poor: '#ef4444',
};

function getBand(score) {
    if (score === null) return null;
    if (score >= 8) return 'excellent';
    if (score >= 6) return 'good';
    if (score >= 4) return 'average';
    return 'poor';
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
                        <div className={styles.resultHeader}>
                            <span className={styles.sbdLabel}>SBD</span>
                            <span className={styles.sbdValue}>{data.sbd}</span>
                            {data.ma_ngoai_ngu && (
                                <span className={styles.badge}>Ngoại ngữ: {data.ma_ngoai_ngu}</span>
                            )}
                        </div>

                        <div className={styles.scoreGrid}>
                            {data.scores.map(({ key, label, score }) => {
                                const band = getBand(score);
                                const color = band ? BAND_COLORS[band] : 'var(--text-muted)';
                                return (
                                <div
                                    key={key}
                                    className={styles.scoreItem}
                                    style={{ '--band': color }}
                                >
                                    <span className={styles.subjectLabel}>{label}</span>
                                    <span className={styles.scoreValue} style={{ color }}>
                                    {score !== null ? score.toFixed(2) : '—'}
                                    </span>
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