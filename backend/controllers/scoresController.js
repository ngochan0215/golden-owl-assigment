import { ScoresService } from "../services/scoresService.js";
import Student from '../models/Student.js';
import { ALL_SUBJECTS, GROUP_A_SUBJECTS, SCORE_BANDS } from '../services/subjectClass.js';

export class ScoresController {
    constructor() {
        this.scoresService = new ScoresService({ Student, ALL_SUBJECTS, GROUP_A_SUBJECTS, SCORE_BANDS });
    }

    getScoreByRegistrationNumber = async (req, res) => {
        try {
            const { sbd } = req.params;
            
            const result = await this.scoresService.getScoreByRegistrationNumber(sbd);
            if (!result) {
                return res.status(404).json({ message: "Cannot find registration number." });
            }
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    getAllScores = async (req, res) => {
        try {
            const { page, limit } = req.query;
            const result = await this.scoresService.getAllScores({ page: parseInt(page), limit: parseInt(limit) });
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ message: "Failed to get scores: ", error: error.message });
        }
    }

    getScoreDistribution = async (req, res) => {
        try {
            const distribution = await this.scoresService.getScoreDistribution();
            return res.status(200).json(distribution);
        } catch (error) {
            return res.status(500).json({ message: "Failed to get score distribution." });
        }
    }

    getTop10GroupA = async (req, res) => {
        try {
            const top10 = await this.scoresService.getTop10GroupA();
            return res.status(200).json(top10);
        } catch (error) {
            return res.status(500).json({ message: "Failed to get top 10 Group A." });
        }
    }
}

