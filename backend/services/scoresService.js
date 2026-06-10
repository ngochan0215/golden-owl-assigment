export class ScoresService {
    constructor({ Student, ALL_SUBJECTS, GROUP_A_SUBJECTS, SCORE_BANDS }) {
        this.Student = Student;
        this.ALL_SUBJECTS = ALL_SUBJECTS;
        this.GROUP_A_SUBJECTS = GROUP_A_SUBJECTS;
        this.SCORE_BANDS = SCORE_BANDS;
    }

    // main business logic
    async getScoreByRegistrationNumber(sbd) {
        try {
            if (!sbd) {
                throw new Error("Registration number (sbd) is required.");
            }

            if (typeof sbd !== 'string' || !/^\d+$/.test(sbd)) {
                throw new Error("Registration number must be a string containing only digits.");
            }

            if (sbd.length !== 8) {
                throw new Error("Registration number must have exactly 8 digits.");
            }

            const student = await this.Student.findOne({ sbd }).lean();
            if (!student) return null;
            
            const scores = this.ALL_SUBJECTS.map(subject => ({
                key: subject.key,
                label: subject.label,
                labelEn: subject.labelEn,
                score: student[subject.key] ?? null,
            }));
            
            return {
                sbd: student.sbd,
                ma_ngoai_ngu: student.ma_ngoai_ngu,
                scores,
            };
        } catch (error) {
            console.log("Failed to get score by registration number: ", error.message);
            throw error;
        }
    }

    async getAllScores({ page = 1, limit = 20 }) {
        try {
            const skip = (page - 1) * limit;
            const [students, total] = await Promise.all([
                this.Student.find().lean().skip(skip).limit(limit),
                this.Student.countDocuments(),
            ]);

            return {
                data: students,
                pagination: {
                    total, page, limit,
                    totalPages: Math.ceil(total / limit),
                } 
            };

        } catch (error) {
            console.log("Failed to get all scores: ", error.message);
            throw error;
        }
    }

    async getScoreDistribution() {
        try {
            const distribution = await Promise.all(
                this.ALL_SUBJECTS.map(async subject => {
                const k = subject.key;
        
                const [result] = await this.Student.aggregate([
                    { $match: { [k]: { $ne: null } } },
                    {
                        $group: {
                            _id: null,
                            excellent: {
                                $sum: { $cond: [{ $gte: [`$${k}`, 8] }, 1, 0] },
                            },
                            good: {
                                $sum: {
                                    $cond: [
                                    { $and: [{ $gte: [`$${k}`, 6] }, { $lt: [`$${k}`, 8] }] },
                                    1, 0,
                                    ],
                                },
                            },
                            average: {
                                $sum: {
                                    $cond: [
                                    { $and: [{ $gte: [`$${k}`, 4] }, { $lt: [`$${k}`, 6] }] },
                                    1, 0,
                                    ],
                                },
                            },
                            poor: {
                                $sum: { $cond: [{ $lt: [`$${k}`, 4] }, 1, 0] },
                            },
                        },
                    },
                ]);
            
                    return {
                        subjectKey: k,
                        label: subject.label,
                        labelEn: subject.labelEn,
                        excellent: result?.excellent ?? 0,
                        good: result?.good ?? 0,
                        average: result?.average ?? 0,
                        poor: result?.poor ?? 0,
                    };
                })
            );
        
            return {
                subjects: this.ALL_SUBJECTS.map(s => s.toJSON()),
                bands: this.SCORE_BANDS.map(b => ({ band: b.band, label: b.label })),
                distribution,
            };
        } catch (error) {
            console.log("Failed to get score distribution: ", error.message);
            throw error;
        }
    }
 
    async getTop10GroupA() {
        try {
            const top10 = await this.Student.aggregate([
                {
                    $match: {
                        toan: { $ne: null },
                        vat_li: { $ne: null },
                        hoa_hoc: { $ne: null },
                    },
                },
                {
                    $addFields: {
                        groupATotal: { $add: ['$toan', '$vat_li', '$hoa_hoc'] },
                    },
                },
                { $sort: { groupATotal: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        _id: 0,
                        sbd: 1,
                        toan: 1,
                        vat_li: 1,
                        hoa_hoc: 1,
                        groupATotal: 1,
                    },
                },
            ]);
            
            return {
                subjects: this.GROUP_A_SUBJECTS.map(s => s.toJSON()),
                students: top10.map((s, i) => ({ rank: i + 1, ...s })),
            };

        } catch (error) {
            console.log("Failed to get top 10 Group A: ", error.message);
            throw error;
        }
    }
}