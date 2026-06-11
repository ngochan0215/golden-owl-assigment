import { useState } from "react";
import { api } from "../services/api.js";

export function useScoreLookup() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function lookup(sbd) {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await api.getScoreByRegistrationNumber(sbd);
            setData(response);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return {
        data, loading, error, lookup
    };
}