import { useTop10 } from '../hooks/useTop10.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import styles from '../styles/top10.module.css';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const PODIUM_ORDER = [2, 1, 3]; // silver, gold, bronze — gold raised in the middle

export default function Top10() {
    const { data, loading, error } = useTop10();

    if (loading) return <div className={styles.center}><span className={styles.spinner} />Đang tải dữ liệu...</div>;
    if (error) return <div className={styles.center}>Lỗi: {error}</div>;
    if (!data) return null;

    const byRank = Object.fromEntries(data.students.map(s => [s.rank, s]));
    const chartData = data.students.map(s => ({
        name: `#${s.rank}`,
        sbd: s.sbd,
        total: Number(s.groupATotal?.toFixed(2)),
    }));

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header>
                    <h1 className={styles.title}>Top 10 thí sinh khối A</h1>
                    <p className={styles.subtitle}>
                        Xếp hạng theo tổng điểm Toán + Vật lý + Hoá học
                    </p>
                </header>

                {/* Podium for the top 3 */}
                <div className={styles.podium}>
                    {PODIUM_ORDER.map(rank => {
                        const s = byRank[rank];
                        if (!s) return null;
                        return (
                            <div
                                key={rank}
                                className={`${styles.podiumCard} ${styles['p' + rank]}`}
                            >
                                <span className={styles.podiumMedal}>{MEDAL[rank]}</span>
                                <span className={styles.podiumRank}>Hạng {rank}</span>
                                <span className={styles.podiumSbd}>{s.sbd}</span>
                                <span className={styles.podiumTotal}>{s.groupATotal?.toFixed(2)}</span>
                                <span className={styles.podiumLabel}>tổng điểm</span>
                            </div>
                        );
                    })}
                </div>

                {/* Totals chart */}
                <div className={styles.card}>
                    <h2 className={styles.chartTitle}>Tổng điểm theo thứ hạng</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 18, right: 16, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                            <YAxis domain={[0, 30]} tick={{ fontSize: 11, fill: '#64748b' }} width={36} />
                            <Tooltip
                                cursor={{ fill: 'rgba(79,70,229,.05)' }}
                                formatter={(v) => [v, 'Tổng']}
                                labelFormatter={(l, p) => p?.[0] ? `SBD ${p[0].payload.sbd}` : l}
                            />
                            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                                <LabelList dataKey="total" position="top" style={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} />
                                {chartData.map((d, i) => (
                                    <Cell key={i} fill={i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : 'url(#barGrad)'} />
                                ))}
                            </Bar>
                            <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Full ranking table */}
                <div className={styles.card}>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                <th>Hạng</th>
                                <th>Số báo danh</th>
                                {data.subjects.map(s => <th key={s.key}>{s.label}</th>)}
                                <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.students.map(student => (
                                    <tr key={student.sbd} className={student.rank <= 3 ? styles.topRow : ''}>
                                        <td className={styles.rank}>
                                        {MEDAL[student.rank] ?? student.rank}
                                        </td>
                                        <td className={styles.sbd}>{student.sbd}</td>
                                        <td>{student.toan?.toFixed(2)}</td>
                                        <td>{student.vat_li?.toFixed(2)}</td>
                                        <td>{student.hoa_hoc?.toFixed(2)}</td>
                                        <td className={styles.total}>{student.groupATotal?.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
