import { useTop10 } from '../hooks/useTop10.js';
import styles from '../styles/top10.module.css';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function Top10() {
    const { data, loading, error } = useTop10();

    if (loading) return <div className={styles.center}>Đang tải dữ liệu...</div>;
    if (error) return <div className={styles.center}>Lỗi: {error}</div>;
    if (!data) return null;

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>Top 10 thí sinh khối A</h1>
                <p className={styles.subtitle}>
                    Xếp hạng theo tổng điểm Toán + Vật lý + Hoá học
                </p>

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