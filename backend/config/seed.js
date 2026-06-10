import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parse } from "csv-parse";
import { connectDB, disconnectDB } from './database.js';
import Student from "../models/Student.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const CSV_PATH =
  process.env.CSV_PATH ||
  path.resolve(__dirname, '../utils/diem_thi_thpt_2024.csv');

const BATCH_SIZE = 1000;

function parseScore(raw) {
    if (!raw || raw.trim() === '') 
        return null;

    const n = parseFloat(raw.trim());

    return isNaN(n) ? null : n;
}

async function seed() {
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`Không tìm thấy file CSV tại: ${CSV_PATH}`);
        process.exit(1);
    }

    await connectDB();

    console.log(`Đọc CSV từ: ${CSV_PATH}`);
    console.log(`Đang seed dữ liệu vào MongoDB.\n`);

    const parser = fs.createReadStream(CSV_PATH).pipe(
        parse({ columns: true, skip_empty_lines: true, trim: true })
    );

    let batch = [];
    let total = 0;
    let batchCount = 0;

    const flushBatch = async () => {
        if (batch.length === 0) return;

        const ops = batch.map(doc => ({
            updateOne: {
                filter: { sbd: doc.sbd },
                update: { $set: doc },
                upsert: true,
            },
        }));

        await Student.bulkWrite(ops, { ordered: false });
        total += batch.length;
        batchCount++;
        process.stdout.write(`Batch ${batchCount}: ${total} dòng đã xử lý\r`);
        batch = [];
    };

    for await (const row of parser) {
        batch.push({
            sbd: row.sbd?.trim(),
            toan: parseScore(row.toan),
            ngu_van: parseScore(row.ngu_van),
            ngoai_ngu: parseScore(row.ngoai_ngu),
            vat_li: parseScore(row.vat_li),
            hoa_hoc: parseScore(row.hoa_hoc),
            sinh_hoc: parseScore(row.sinh_hoc),
            lich_su: parseScore(row.lich_su),
            dia_li: parseScore(row.dia_li),
            gdcd: parseScore(row.gdcd),
            ma_ngoai_ngu: row.ma_ngoai_ngu?.trim() || null,
        });

        if (batch.length >= BATCH_SIZE) await flushBatch();
    }

    await flushBatch();

    console.log(`Seed xong — ${total} thí sinh đã được import vào MongoDB`);
    await disconnectDB();
}

seed().catch(err => {
    console.error('Seed thất bại:', err);
    process.exit(1);
});