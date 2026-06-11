import { useReport } from '../hooks/useReport.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import styles from '../styles/report.module.css';

const BAND_COLORS = {
  excellent: '#22c55e',
  good: '#3b82f6',
  average: '#f59e0b',
  poor: '#ef4444',
};

const BAND_LABELS = {
  excellent: '≥ 8',
  good: '6 – 7.99',
  average: '4 – 5.99',
  poor: '< 4',
};

const BAND_NAMES = {
  excellent: 'Giỏi',
  good: 'Khá',
  average: 'Trung bình',
  poor: 'Cần cố gắng',
};

const BANDS = ['excellent', 'good', 'average', 'poor'];

export default function Report() {
    const { data, loading, error } = useReport();

    if (loading) return <div className={styles.center}><span className={styles.spinner} />Đang tải dữ liệu...</div>;
    if (error) return <div className={styles.center}>Lỗi: {error}</div>;
    if (!data) return null;

    const chartData = data.distribution.map(d => ({
        name: d.label,
        '≥ 8': d.excellent,
        '6 – 7.99': d.good,
        '4 – 5.99': d.average,
        '< 4': d.poor,
    }));

    // Aggregate totals across every subject for each band
    const totals = BANDS.reduce((acc, band) => {
        acc[band] = data.distribution.reduce((sum, d) => sum + d[band], 0);
        return acc;
    }, {});
    const grandTotal = BANDS.reduce((sum, b) => sum + totals[b], 0);

    const pieData = BANDS.map(band => ({
        name: BAND_NAMES[band],
        value: totals[band],
        color: BAND_COLORS[band],
    }));

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <header>
                    <h1 className={styles.title}>Thống kê phân bổ điểm thi</h1>
                    <p className={styles.subtitle}>Số lượt điểm theo 4 mức, phân theo môn thi</p>
                </header>

                {/* Summary stat cards */}
                <div className={styles.statRow}>
                    {BANDS.map(band => {
                        const pct = grandTotal ? (totals[band] / grandTotal) * 100 : 0;
                        return (
                            <div key={band} className={styles.statCard} style={{ '--c': BAND_COLORS[band] }}>
                                <span className={styles.statName}>{BAND_NAMES[band]}</span>
                                <span className={styles.statValue}>{totals[band].toLocaleString('vi-VN')}</span>
                                <span className={styles.statMeta}>{BAND_LABELS[band]} · {pct.toFixed(1)}%</span>
                            </div>
                        );
                    })}
                </div>

                {/* Donut + bar side by side */}
                <div className={styles.grid}>
                    <div className={styles.card}>
                        <h2 className={styles.tableTitle}>Tỉ lệ theo mức điểm</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={62}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    stroke="none"
                                >
                                    {pieData.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                                </Pie>
                                <Tooltip formatter={(v, n) => [v.toLocaleString('vi-VN'), n]} />
                                <Legend verticalAlign="bottom" height={24} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.tableTitle}>So sánh giữa các môn</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: '#64748b' }}
                                    angle={-35}
                                    textAnchor="end"
                                    interval={0}
                                />
                                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} width={56} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(79,70,229,.05)' }}
                                    formatter={(value, name) => [value.toLocaleString('vi-VN'), name]}
                                />
                                <Legend verticalAlign="top" height={32} iconType="circle" />
                                {BANDS.map(band => (
                                    <Bar key={band} dataKey={BAND_LABELS[band]} fill={BAND_COLORS[band]} radius={[3,3,0,0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed data table */}
                <div className={styles.card}>
                    <h2 className={styles.tableTitle}>Chi tiết số liệu</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                <th>Môn</th>
                                <th style={{ color: BAND_COLORS.excellent }}>≥ 8</th>
                                <th style={{ color: BAND_COLORS.good }}>6 – 7.99</th>
                                <th style={{ color: BAND_COLORS.average }}>4 – 5.99</th>
                                <th style={{ color: BAND_COLORS.poor }}>{'< 4'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.distribution.map(d => (
                                <tr key={d.subjectKey}>
                                    <td>{d.label}</td>
                                    <td>{d.excellent.toLocaleString('vi-VN')}</td>
                                    <td>{d.good.toLocaleString('vi-VN')}</td>
                                    <td>{d.average.toLocaleString('vi-VN')}</td>
                                    <td>{d.poor.toLocaleString('vi-VN')}</td>
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
