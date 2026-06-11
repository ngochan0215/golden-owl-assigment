import { useReport } from '../hooks/useReport.js';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
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

export default function Report() {
    const { data, loading, error } = useReport();

    if (loading) return <div className={styles.center}>Đang tải dữ liệu...</div>;
    if (error) return <div className={styles.center}>Lỗi: {error}</div>;
    if (!data) return null;

    const chartData = data.distribution.map(d => ({
        name: d.label,
        '≥ 8': d.excellent,
        '6 – 7.99': d.good,
        '4 – 5.99': d.average,
        '< 4': d.poor,
    }));

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Thống kê phân bổ điểm thi</h1>
                <p className={styles.subtitle}>Số thí sinh theo 4 mức điểm, phân theo môn thi</p>

                <div className={styles.card}>
                    <ResponsiveContainer width="100%" height={420}>
                        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                        />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} width={70} />
                        <Tooltip
                            formatter={(value, name) => [value.toLocaleString('vi-VN'), name]}
                        />
                        <Legend verticalAlign="top" height={36} />
                        {Object.entries(BAND_COLORS).map(([band, color]) => (
                            <Bar key={band} dataKey={BAND_LABELS[band]} fill={color} radius={[3,3,0,0]} />
                        ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Bảng số liệu chi tiết */}
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