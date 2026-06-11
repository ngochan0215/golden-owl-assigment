const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchAPI(path) {
    const response = await fetch(`${BASE_URL}${path}`);
    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.message || 'API request failed');
    }
    return json;
}

export const api = {
    getScoreByRegistrationNumber: (sbd) => fetchAPI(`/scores/${sbd}`),
    getAllScores: () => fetchAPI('/scores'),
    getScoreDistribution: () => fetchAPI('/scores/distribution'),
    getTop10GroupA: () => fetchAPI('/scores/top10/groupA'),
}