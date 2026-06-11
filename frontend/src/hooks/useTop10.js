import { useState, useEffect } from "react";
import { api } from "../services/api.js";

export function useTop10() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.getTop10GroupA()
            .then(response => setData(response))
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    return {
        data, loading, error
    };
}