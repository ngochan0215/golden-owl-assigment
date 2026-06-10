// helper
export const SCORE_BANDS = [
  { band: 'excellent', label: '≥ 8',      min: 8,  max: Infinity },
  { band: 'good',      label: '6 – 7.99', min: 6,  max: 8 },
  { band: 'average',   label: '4 – 5.99', min: 4,  max: 6 },
  { band: 'poor',      label: '< 4',      min: 0,  max: 4 },
];

// base class
export class Subject {
    constructor(key, label, labelEn) {
        if (new.target === Subject) {
            throw new Error('Subject là abstract class, không khởi tạo trực tiếp được');
        }
        
        this.key = key;
        this.label = label;
        this.labelEn = labelEn;
    }

    classifyScore(score) {
        for (const band of SCORE_BANDS) {
            if (score >= band.min && score < band.max) 
                return band.band;
        }
        return 'poor';
    }

    isGroupA() {
        return false;
    }

    toJSON() {
        return { key: this.key, label: this.label, labelEn: this.labelEn };
    }
}

class ToanSubject extends Subject {
  constructor() { super('toan', 'Toán', 'Mathematics'); }
  isGroupA() { return true; }
}

class NguVanSubject extends Subject {
  constructor() { super('ngu_van', 'Ngữ văn', 'Literature'); }
}

class NgoaiNguSubject extends Subject {
  constructor() { super('ngoai_ngu', 'Ngoại ngữ', 'Foreign Language'); }
}

class VatLiSubject extends Subject {
  constructor() { super('vat_li', 'Vật lý', 'Physics'); }
  isGroupA() { return true; }
}

class HoaHocSubject extends Subject {
  constructor() { super('hoa_hoc', 'Hoá học', 'Chemistry'); }
  isGroupA() { return true; }
}

class SinhHocSubject extends Subject {
  constructor() { super('sinh_hoc', 'Sinh học', 'Biology'); }
}

class LichSuSubject extends Subject {
  constructor() { super('lich_su', 'Lịch sử', 'History'); }
}

class DiaLiSubject extends Subject {
  constructor() { super('dia_li', 'Địa lý', 'Geography'); }
}

class GdcdSubject extends Subject {
  constructor() { super('gdcd', 'GDCD', 'Civic Education'); }
}

export const ALL_SUBJECTS = [
    new ToanSubject(),
    new NguVanSubject(),
    new NgoaiNguSubject(),
    new VatLiSubject(),
    new HoaHocSubject(),
    new SinhHocSubject(),
    new LichSuSubject(),
    new DiaLiSubject(),
    new GdcdSubject(),
];

export const GROUP_A_SUBJECTS = ALL_SUBJECTS.filter(s => s.isGroupA());
